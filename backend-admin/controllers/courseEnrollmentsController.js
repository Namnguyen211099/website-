const db = require('../config/db');
const accounting = require('./accountingController');
const crypto = require('crypto');

exports.enrollPublic = async (req, res) => {
  const { course_id, guest_name, guest_phone, guest_email, note, payment_method = 'cash' } = req.body;
  if (!guest_name || !guest_phone) return res.status(400).json({ ok: false, error: 'Thiếu tên/SĐT' });
  const allowedMethods = ['cash','vnpay','momo'];
  if (!allowedMethods.includes(payment_method)) return res.status(400).json({ ok:false,error:'Phương thức thanh toán không hợp lệ' });

  try {
    const result = await db.transaction(async conn => {
      const [c] = await conn.query('SELECT * FROM courses WHERE id=? FOR UPDATE', [course_id]);
      if (!c || !['open','opening_soon'].includes(c.status)) throw Object.assign(new Error('Khóa học không mở đăng ký'),{status:400});
      if (c.max_students > 0 && c.enrolled_count >= c.max_students) throw Object.assign(new Error('Khóa học đã hết chỗ'),{status:400});

      const user_id = req.user?.id || null;
      if (user_id) {
        const [ex] = await conn.query('SELECT id FROM course_enrollments WHERE user_id=? AND course_id=?', [user_id, course_id]);
        if (ex) throw Object.assign(new Error('Bạn đã đăng ký khóa này'),{status:400});
      }
      const price = Number(c.price_sale > 0 ? c.price_sale : c.price_original);
      const payment_code = 'KH-' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(4).toString('hex').toUpperCase();
      const paid_status = price <= 0 ? 'paid' : 'unpaid';
      const status = price <= 0 ? 'active' : 'pending';
      const [r] = await conn.query(`INSERT INTO course_enrollments
        (course_id,user_id,guest_name,guest_phone,guest_email,amount_paid,payment_method,payment_code,payment_status,status,note)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [course_id,user_id,guest_name.trim(),guest_phone.trim(),guest_email||'',0,payment_method,payment_code,paid_status,status,note||'']);

      if (paid_status === 'paid') {
        await conn.query('UPDATE courses SET enrolled_count=enrolled_count+1 WHERE id=?',[course_id]);
      }
      return { id:r.insertId,payment_code,status,need_payment:paid_status!=='paid',amount:price };
    });
    res.json({ok:true,...result});
  } catch(e) {
    res.status(e.status || 500).json({ok:false,error:e.message});
  }
};

exports.adminList = async (req,res) => {
  const {course_id,status,payment_status,q}=req.query;
  let sql='SELECT e.*, c.title course_title, c.course_code FROM course_enrollments e JOIN courses c ON c.id=e.course_id WHERE 1=1'; const p=[];
  if(course_id){sql+=' AND e.course_id=?';p.push(course_id);}
  if(status){sql+=' AND e.status=?';p.push(status);}
  if(payment_status){sql+=' AND e.payment_status=?';p.push(payment_status);}
  if(q){sql+=' AND (e.guest_name LIKE ? OR e.guest_phone LIKE ? OR e.payment_code LIKE ?)';p.push(`%${q}%`,`%${q}%`,`%${q}%`);}
  sql+=' ORDER BY e.id DESC LIMIT 500';
  res.json({ok:true,data:await db.query(sql,p)});
};

exports.updateStatus = async (req,res) => {
  const {status,payment_status,amount_paid}=req.body;
  const result=await db.transaction(async conn=>{
    const [old]=await conn.query('SELECT * FROM course_enrollments WHERE id=? FOR UPDATE',[req.params.id]);
    if(!old) throw Object.assign(new Error('Học viên không tồn tại'),{status:404});
    const fields=[],vals=[];
    if(status!==undefined){
      if(!['pending','active','completed'].includes(status)) throw Object.assign(new Error('Status không hợp lệ'),{status:400});
      fields.push('status=?'); vals.push(status);
    }
    if(payment_status!==undefined){
      if(!['unpaid','paid','refunded'].includes(payment_status)) throw Object.assign(new Error('Payment status không hợp lệ'),{status:400});
      fields.push('payment_status=?'); vals.push(payment_status);
    }
    const becamePaid=payment_status==='paid' && old.payment_status!=='paid';
    if(amount_paid!==undefined){
      const n=Number(amount_paid);
      if(!Number.isFinite(n)||n<0) throw Object.assign(new Error('amount_paid không hợp lệ'),{status:400});
      fields.push('amount_paid=?'); vals.push(n);
    }
    if(becamePaid){
      const [c]=await conn.query('SELECT * FROM courses WHERE id=? FOR UPDATE',[old.course_id]);
      const amount=amount_paid!==undefined?Number(amount_paid):Number(old.amount_paid);
      if(amount<=0) throw Object.assign(new Error('Phải có số tiền thanh toán hợp lệ'),{status:400});
      if(c.max_students>0 && c.enrolled_count>=c.max_students && old.status!=='active') throw Object.assign(new Error('Khóa học đã đủ chỗ'),{status:400});
      fields.push('status=?'); vals.push('active');
      await conn.query('UPDATE courses SET enrolled_count=enrolled_count+1 WHERE id=?',[old.course_id]);
      await accounting.autoRecordPayment({type:'income',category:'khoa_hoc',amount,method:old.payment_method,payer_payee:old.guest_name,reference_type:'course_enrollment',reference_id:old.id,note:c.course_code+' xác nhận',conn});
    }
    if(status==='completed' && old.status!=='completed'){
      const cert='CERT-DX-'+String(old.course_id).padStart(3,'0')+'-'+String(old.id).padStart(6,'0');
      fields.push('certificate_no=?','certificate_issued_at=NOW()','completed_at=NOW()'); vals.push(cert);
    }
    if(!fields.length) return;
    vals.push(req.params.id);
    await conn.query(`UPDATE course_enrollments SET ${fields.join(',')} WHERE id=?`,vals);
  });
  res.json({ok:true,data:result});
};

exports.sendReminder = async(req,res)=>{
  const [e]=await db.query('SELECT e.*,c.title,c.start_date FROM course_enrollments e JOIN courses c ON c.id=e.course_id WHERE e.id=?',[req.params.id]);
  if(!e)return res.status(404).json({ok:false});
  res.json({ok:true,sent:true,to:e.guest_phone,message:`DXGroup: Khóa ${e.title} khai giảng ${e.start_date||'sớm'}. Chi tiết: 1900 1234`});
};

exports.myEnrollments=async(req,res)=>{
  const rows=await db.query('SELECT e.*,c.title,c.thumbnail,c.course_code,c.teacher_name FROM course_enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=? ORDER BY e.id DESC',[req.user.id]);
  res.json({ok:true,data:rows});
};

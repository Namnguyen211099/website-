const crypto = require('crypto');
const axios = require('axios');
const accounting = require('./accountingController');
const db = require('../config/db');

const MOCK_MODE = process.env.NODE_ENV !== 'production' && process.env.PAYMENT_MOCK === 'true';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:4000').replace(/\/$/, '');

const hmac = (secret, data, algorithm = 'sha512') => crypto.createHmac(algorithm, secret).update(data, 'utf8').digest('hex');
const timingSafeEqualHex = (a, b) => {
  const aa = Buffer.from(String(a || '').toLowerCase(), 'utf8');
  const bb = Buffer.from(String(b || '').toLowerCase(), 'utf8');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};
const sortedQuery = (query) => Object.keys(query)
  .filter(k => !['vnp_SecureHash','vnp_SecureHashType'].includes(k) && query[k] !== undefined && query[k] !== '')
  .sort()
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k]).replace(/%20/g, '+')}`)
  .join('&');

async function expectedOrder(orderType, orderId) {
  if (orderType === 'khoa_hoc') {
    const [r] = await db.query(`SELECT e.*, c.price_sale, c.price_original, c.course_code, c.title
      FROM course_enrollments e JOIN courses c ON c.id=e.course_id WHERE e.payment_code=?`, [orderId]);
    if (!r) return null;
    return { amount: Number(r.amount_paid || r.price_sale || r.price_original || 0), referenceType: 'course_enrollment', referenceId: r.id, name: r.guest_name, courseId: r.course_id, paymentStatus: r.payment_status };
  }
  const [r] = await db.query('SELECT * FROM appointments WHERE code=?', [orderId]);
  if (!r) return null;
  return { amount: Number(r.amount || 0), referenceType: 'appointment', referenceId: r.id, name: r.full_name, paid: !!r.paid };
}

async function settle(orderType, orderId, gateway, gatewayTxId, responseCode, raw, receivedAmount) {
  return db.transaction(async conn => {
    const [tx] = await conn.query('SELECT * FROM payment_transactions WHERE gateway=? AND transaction_code=? FOR UPDATE', [gateway, orderId]);
    if (!tx) throw new Error('Giao dịch chưa được tạo');
    if (Number(tx.amount) !== Number(receivedAmount)) throw new Error('Số tiền giao dịch không khớp');
    if (tx.status === 'paid') return { alreadyPaid: true };

    const order = await expectedOrderWithConn(conn, orderType, orderId);
    if (!order || Number(order.amount) !== Number(receivedAmount)) throw new Error('Đơn hàng không tồn tại hoặc số tiền không khớp');

    if (responseCode === '00' || responseCode === 0 || responseCode === '0') {
      await conn.query(`UPDATE payment_transactions SET status='paid',gateway_transaction_id=?,response_code=?,raw_response=?,paid_at=NOW() WHERE id=?`,
        [gatewayTxId || null, String(responseCode), JSON.stringify(raw || {}), tx.id]);

      if (orderType === 'khoa_hoc') {
        const [e] = await conn.query('SELECT payment_status FROM course_enrollments WHERE payment_code=? FOR UPDATE', [orderId]);
        if (e && e.payment_status !== 'paid') {
          await conn.query("UPDATE course_enrollments SET payment_status='paid',status='active',amount_paid=? WHERE payment_code=?", [receivedAmount, orderId]);
          await conn.query('UPDATE courses SET enrolled_count=enrolled_count+1 WHERE id=?', [e ? order.courseId : null]);
          await accounting.autoRecordPayment({ type:'income', category:'khoa_hoc', amount:receivedAmount, method:gateway, payer_payee:order.name, reference_type:'course_enrollment', reference_id:order.referenceId, note:'Thanh toán ' + gateway + ' ' + orderId, conn });
        }
      } else {
        if (!order.paid) {
          await conn.query("UPDATE appointments SET paid=1,status='confirmed' WHERE code=?", [orderId]);
          await accounting.autoRecordPayment({ type:'income', category:'appointment', amount:receivedAmount, method:gateway, payer_payee:order.name, reference_type:'appointment', reference_id:order.referenceId, note:'Thanh toán ' + gateway + ' ' + orderId, conn });
        }
      }
      return { paid: true };
    }

    await conn.query(`UPDATE payment_transactions SET status='failed',response_code=?,raw_response=? WHERE id=?`,
      [String(responseCode), JSON.stringify(raw || {}), tx.id]);
    return { paid: false };
  });
}

async function expectedOrderWithConn(conn, orderType, orderId) {
  if (orderType === 'khoa_hoc') {
    const [r] = await conn.query(`SELECT e.*, c.price_sale, c.price_original, c.course_code, c.title
      FROM course_enrollments e JOIN courses c ON c.id=e.course_id WHERE e.payment_code=?`, [orderId]);
    if (!r) return null;
    return { amount: Number(r.amount_paid || r.price_sale || r.price_original || 0), referenceType:'course_enrollment', referenceId:r.id, name:r.guest_name, courseId:r.course_id };
  }
  const [r] = await conn.query('SELECT * FROM appointments WHERE code=?', [orderId]);
  if (!r) return null;
  return { amount:Number(r.amount || 0), referenceType:'appointment', referenceId:r.id, name:r.full_name, paid:!!r.paid };
}

exports.vnpayCreate = async (req, res) => {
  const { order_id, order_type='appointment' } = req.body;
  if (!order_id || !['appointment','khoa_hoc'].includes(order_type)) return res.status(400).json({ok:false,error:'order_id/order_type không hợp lệ'});
  const order = await expectedOrder(order_type, order_id);
  if (!order || order.amount <= 0) return res.status(404).json({ok:false,error:'Đơn hàng không tồn tại hoặc số tiền không hợp lệ'});

  await db.query(`INSERT INTO payment_transactions (gateway,transaction_code,order_type,order_id,amount,status)
    VALUES ('vnpay',?,?,?,?, 'pending')
    ON DUPLICATE KEY UPDATE amount=VALUES(amount),order_type=VALUES(order_type),order_id=VALUES(order_id)`,
    [order_id, order_type, order_id, order.amount]);

  const redirect = process.env.VNPAY_RETURN_URL || `${FRONTEND_URL}/payment/result`;
  if (MOCK_MODE) {
    const q = new URLSearchParams({vnp_ResponseCode:'00',vnp_TxnRef:order_id,vnp_Amount:String(Math.round(order.amount*100)),vnp_OrderInfo:order_type});
    const secure = hmac('mock', q.toString());
    return res.json({ok:true,mock:true,payment_url:`/api/payment/vnpay/return?${q}&vnp_SecureHash=${secure}`});
  }
  if (!process.env.VNPAY_TMN_CODE || !process.env.VNPAY_HASHSECRET) return res.status(503).json({ok:false,error:'VNPay chưa được cấu hình'});

  const date = new Date();
  const createDate = date.getFullYear().toString()+String(date.getMonth()+1).padStart(2,'0')+String(date.getDate()).padStart(2,'0')+String(date.getHours()).padStart(2,'0')+String(date.getMinutes()).padStart(2,'0')+String(date.getSeconds()).padStart(2,'0');
  const params = {vnp_Version:'2.1.0',vnp_Command:'pay',vnp_TmnCode:process.env.VNPAY_TMN_CODE,vnp_Amount:Math.round(order.amount*100),vnp_CurrCode:'VND',vnp_TxnRef:order_id,vnp_OrderInfo:order_type,vnp_OrderType:'other',vnp_Locale:'vn',vnp_ReturnUrl:redirect,vnp_IpAddr:(req.ip||'127.0.0.1').replace('::ffff:',''),vnp_CreateDate:createDate};
  const qs = sortedQuery(params);
  const secure = hmac(process.env.VNPAY_HASHSECRET, qs);
  const base = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  res.json({ok:true,payment_url:`${base}?${qs}&vnp_SecureHash=${secure}`});
};

exports.vnpayReturn = async (req,res) => {
  try {
    if (!MOCK_MODE && !process.env.VNPAY_HASHSECRET) throw new Error('VNPay chưa được cấu hình');
    const expectedSig = MOCK_MODE ? hmac('mock', sortedQuery(req.query)) : hmac(process.env.VNPAY_HASHSECRET, sortedQuery(req.query));
    if (!timingSafeEqualHex(expectedSig, req.query.vnp_SecureHash)) throw new Error('VNPay signature không hợp lệ');
    const ref=req.query.vnp_TxnRef, type=req.query.vnp_OrderInfo || 'appointment';
    const amount=Number(req.query.vnp_Amount||0)/100;
    const code=req.query.vnp_ResponseCode;
    await settle(type, ref, 'vnpay', req.query.vnp_TransactionNo, code, req.query, amount);
    res.redirect(`${FRONTEND_URL}/payment/result?success=${code==='00'?1:0}&ref=${encodeURIComponent(ref||'')}`);
  } catch(e) {
    console.error('VNPay return:',e.message);
    res.redirect(`${FRONTEND_URL}/payment/result?success=0&error=payment_verification`);
  }
};

exports.momoCreate = async (req,res) => {
  const {order_id, order_type='appointment'} = req.body;
  if (!order_id || !['appointment','khoa_hoc'].includes(order_type)) return res.status(400).json({ok:false,error:'order_id/order_type không hợp lệ'});
  const order=await expectedOrder(order_type,order_id);
  if (!order || order.amount<=0) return res.status(404).json({ok:false,error:'Đơn hàng không tồn tại hoặc số tiền không hợp lệ'});
  await db.query(`INSERT INTO payment_transactions (gateway,transaction_code,order_type,order_id,amount,status)
    VALUES ('momo',?,?,?,?, 'pending')
    ON DUPLICATE KEY UPDATE amount=VALUES(amount),order_type=VALUES(order_type)`,[order_id,order_type,order_id,order.amount]);
  if (MOCK_MODE) return res.json({ok:true,mock:true,payUrl:`/api/payment/momo/return?resultCode=0&orderId=${encodeURIComponent(order_id)}&amount=${order.amount}&orderInfo=DXGroup&partnerCode=MOCK&signature=mock`});
  const required=['MOMO_PARTNER_CODE','MOMO_ACCESS_KEY','MOMO_SECRET_KEY'];
  if (required.some(k=>!process.env[k])) return res.status(503).json({ok:false,error:'MoMo chưa được cấu hình'});
  const requestId=`${order_id}-${Date.now()}`;
  const redirectUrl=process.env.MOMO_REDIRECT_URL || `${FRONTEND_URL}/payment/result`;
  const ipnUrl=process.env.MOMO_IPN_URL;
  if (!ipnUrl) return res.status(503).json({ok:false,error:'MOMO_IPN_URL chưa được cấu hình'});
  const amount=String(Math.round(order.amount));
  const extraData='';
  const requestType='captureWallet';
  const orderInfo=`DXGroup ${order_type} ${order_id}`;
  const raw=`accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${order_id}&orderInfo=${orderInfo}&partnerCode=${process.env.MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature=hmac(process.env.MOMO_SECRET_KEY,raw,'sha256');
  const payload={partnerCode:process.env.MOMO_PARTNER_CODE,partnerName:'DXGroup',storeId:'DXGroup',requestId,amount:Number(amount),orderId:order_id,orderInfo,redirectUrl,ipnUrl,requestType,extraData,autoCapture:true,lang:'vi',signature};
  const endpoint=process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
  const response=await axios.post(endpoint,payload,{timeout:35000,headers:{'Content-Type':'application/json'}});
  if (response.data?.resultCode !== 0) return res.status(502).json({ok:false,error:response.data?.message||'MoMo từ chối tạo giao dịch'});
  res.json({ok:true,payUrl:response.data.payUrl,qrCodeUrl:response.data.qrCodeUrl||null,requestId});
};

exports.momoReturn=async(req,res)=>{
  const q=req.query;
  let ok=false;
  if (MOCK_MODE) ok=q.resultCode==='0' && q.signature==='mock';
  else if (process.env.MOMO_SECRET_KEY) {
    const raw=`accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${q.amount}&extraData=${q.extraData||''}&message=${q.message||''}&orderId=${q.orderId}&orderInfo=${q.orderInfo||''}&orderType=${q.orderType||''}&partnerCode=${q.partnerCode}&payType=${q.payType||''}&requestId=${q.requestId}&responseTime=${q.responseTime}&resultCode=${q.resultCode}&transId=${q.transId||''}`;
    ok=timingSafeEqualHex(hmac(process.env.MOMO_SECRET_KEY,raw,'sha256'),q.signature);
  }
  if (ok) {
    try {
      const [tx]=await db.query('SELECT order_type FROM payment_transactions WHERE gateway="momo" AND transaction_code=?',[q.orderId]);
      if(!tx) throw new Error('Giao dịch MoMo không tồn tại');
      await settle(tx.order_type,q.orderId,'momo',q.transId,q.resultCode,q,Number(q.amount));
    } catch(e) { console.error('MoMo return:',e.message); ok=false; }
  }
  res.redirect(`${FRONTEND_URL}/payment/result?success=${ok?1:0}&ref=${encodeURIComponent(q.orderId||'')}`);
};

exports.momoIpn=async(req,res)=>{
  try {
    const q=req.body||{};
    if (!process.env.MOMO_SECRET_KEY && !MOCK_MODE) return res.status(503).json({resultCode:1,message:'MoMo chưa cấu hình'});
    if (!MOCK_MODE) {
      const raw=`accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${q.amount}&extraData=${q.extraData||''}&message=${q.message||''}&orderId=${q.orderId}&orderInfo=${q.orderInfo||''}&orderType=${q.orderType||''}&partnerCode=${q.partnerCode}&payType=${q.payType||''}&requestId=${q.requestId}&responseTime=${q.responseTime}&resultCode=${q.resultCode}&transId=${q.transId||''}`;
      if (!timingSafeEqualHex(hmac(process.env.MOMO_SECRET_KEY,raw,'sha256'),q.signature)) return res.status(400).json({resultCode:1,message:'Invalid signature'});
    }
    const tx=await db.query('SELECT order_type FROM payment_transactions WHERE gateway="momo" AND transaction_code=?',[q.orderId]);
    if (!tx.length) return res.status(404).json({resultCode:1,message:'Unknown order'});
    await settle(tx[0].order_type,q.orderId,'momo',q.transId,q.resultCode,q,Number(q.amount));
    return res.json({resultCode:0,message:'OK'});
  } catch(e) {
    console.error('MoMo IPN:',e.message);
    return res.status(400).json({resultCode:1,message:'Invalid transaction'});
  }
};

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Map([
  ['.png','image/png'],['.jpg','image/jpeg'],['.jpeg','image/jpeg'],['.webp','image/webp'],
  ['.gif','image/gif'],['.pdf','application/pdf'],['.mp4','video/mp4']
]);

const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null,UPLOAD_DIR),
  filename: (req,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits:{fileSize:8*1024*1024,files:1},
  fileFilter:(req,file,cb)=>{
    const ext=path.extname(file.originalname).toLowerCase();
    if(!ALLOWED.has(ext) || file.mimetype!==ALLOWED.get(ext))
      return cb(new Error('Định dạng file không được phép'));
    cb(null,true);
  }
});

function validMagic(filePath, ext) {
  const b=fs.readFileSync(filePath);
  if(ext==='.png') return b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if(ext==='.jpg'||ext==='.jpeg') return b[0]===0xff&&b[1]===0xd8&&b[2]===0xff;
  if(ext==='.gif') return b.subarray(0,6).toString('ascii').match(/^GIF8[79]a$/)!==null;
  if(ext==='.pdf') return b.subarray(0,5).toString('ascii')==='%PDF-';
  if(ext==='.webp') return b.subarray(0,4).toString('ascii')==='RIFF' && b.subarray(8,12).toString('ascii')==='WEBP';
  if(ext==='.mp4') return b.length>=12 && b.subarray(4,8).toString('ascii')==='ftyp';
  return false;
}

exports.multer=upload;
exports.uploadOne=async(req,res)=>{
  if(!req.file)return res.status(400).json({ok:false,error:'Không có file'});
  const ext=path.extname(req.file.originalname).toLowerCase();
  if(!validMagic(req.file.path,ext)){
    try{fs.unlinkSync(req.file.path);}catch(_){}
    return res.status(400).json({ok:false,error:'Nội dung file không khớp định dạng'});
  }
  let url=`/uploads/${req.file.filename}`;
  try{
    const cloudinary=require('cloudinary').v2;
    if(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD&&process.env.CLOUDINARY_KEY&&process.env.CLOUDINARY_SECRET)){
      cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD,api_key:process.env.CLOUDINARY_KEY,api_secret:process.env.CLOUDINARY_SECRET});
      const r=await cloudinary.uploader.upload(req.file.path,{folder:'dxgroup',resource_type:'auto'});
      url=r.secure_url;
      try{fs.unlinkSync(req.file.path);}catch(_){}
    }
  }catch(e){ console.error('Cloudinary upload:',e.message); }
  res.json({ok:true,url,filename:req.file.filename,size:req.file.size});
};

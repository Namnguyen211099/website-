// Du lieu mau cho dich vu
// Sau nay co the thay bang API call: fetch('/api/services')

export const servicesData = [
  {
    id: 1,
    name: 'Cham cuu tong hop',
    desc: 'Dieu tri bang phuong phap cham cuu truyen thong ket hop hien dai, giup giam dau va can bang nang luong',
    price: '350.000d',
    tag: 'Pho bien',
    duration: '45 phut',
    img: 'https://images.unsplash.com/photo-1600334129943-22998d46b010?w=500&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Xoa bop bam huyet',
    desc: 'Giam dau, thu gian co the bang ky thuat xoa bop chuyen nghiep, tang luong mau toan than',
    price: '280.000d',
    tag: '60 phut',
    duration: '60 phut',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Kham tong quat',
    desc: 'Kham suc khoe tong the, tu van chi tiet va dua ra phac do dieu tri phu hop cho moi nguoi',
    price: '200.000d',
    tag: 'Co ban',
    duration: '30 phut',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Dieu tri noi tiet',
    desc: 'Can bang noi tiet bang thuoc Dong Y, cai thien ham tuyen va suc khoe tong the cua ban',
    price: '420.000d',
    tag: 'Chuyen sau',
    duration: '60 phut',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Dieu tri cot song',
    desc: 'Dieu tri cac benh ly ve cot song, lien hop, goi dau bang phuong phap Dong Y an toan',
    price: '450.000d',
    tag: 'Chuyen gia',
    duration: '60 phut',
    img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Tu van duong sinh',
    desc: 'Tu van cach song khoe manh, che do an uong va luyen tap phu hop theo the trang',
    price: '250.000d',
    tag: 'Tu van',
    duration: '45 phut',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop'
  }
]

export const doctorsData = [
  {
    id: 1,
    name: 'BS. Tran Van Hung',
    spec: 'Chuyen khoa Cham cuu',
    exp: '15 nam kinh nghiem',
    level: 'Bang cap II',
    email: 'hung@dxgroup.vn',
    color1: '#0d9669',
    color2: '#0d9488'
  },
  {
    id: 2,
    name: 'BS. Nguyen Thi Lan',
    spec: 'Chuyen khoa Noi tiet',
    exp: '12 nam kinh nghiem',
    level: 'Bang cap I',
    email: 'lan@dxgroup.vn',
    color1: '#d4724a',
    color2: '#ea580c'
  },
  {
    id: 3,
    name: 'BS. Pham Minh Tuan',
    spec: 'Chuyen khoa Cot song',
    exp: '20 nam kinh nghiem',
    level: 'Giao su',
    email: 'tuan@dxgroup.vn',
    color1: '#7c3aed',
    color2: '#ba3b5b'
  }
]

export const coursesData = [
  {
    id: 1,
    name: 'Khoa hoc cuu thuong co ban',
    subtitle: '30 Huyet Cuu Song',
    teacher: 'BS. Tran Van Hung',
    students: 128,
    price: '1.500.000d',
    duration: '8 tuan',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=350&fit=crop',
    video: true,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    desc: 'Khoa hoc huong dan cac ky thuat cuu thuong co ban, nhan biet 30 huyet vi quan trong co the tu thuc hien'
  },
  {
    id: 2,
    name: 'Ky thuat cham cuu chuyen sau',
    subtitle: 'Cham Cuu Nang Cao',
    teacher: 'BS. Nguyen Thi Lan',
    students: 86,
    price: '2.800.000d',
    duration: '12 tuan',
    img: 'https://images.unsplash.com/photo-1610484266808-0a6220d161a6?w=600&h=350&fit=crop',
    video: false,
    videoUrl: '',
    desc: 'Khoa hoc nang cao ve ky thuat cham cuu, ap dung cho cac benh ly phuc tap, danh cho nguoi co co so'
  }
]

export const featuresData = [
  { icon: '🏥', title: 'Y te chat luong', desc: 'Doi ngu bac si chuyen mon, nhieu nam kinh nghiem' },
  { icon: '🌿', title: 'Du lieu tu nhien', desc: 'Thuoc Dong Y nguyen chat, an toan cho nguoi dung' },
  { icon: '📅', title: 'Dat lich de dang', desc: 'He thong dat lich truc tuyen nhanh chong' },
  { icon: '🎓', title: 'Khoa hoc chuyen sau', desc: 'Nhieu khoa hoc chia se kien thuc suc khoe' }
]

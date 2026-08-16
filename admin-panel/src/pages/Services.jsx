import CrudPage from '../components/CrudPage';
export default function Services(){return <CrudPage title="Dịch vụ" endpoint="/services/admin/list"
 columns={[{key:'name',label:'Tên'},{key:'category',label:'Nhóm'},{key:'price',label:'Giá'},{key:'published',label:'Hiển thị'}]}
 fields={[
  {name:'name',label:'Tên',default:''},{name:'category',label:'Nhóm',default:''},{name:'short_desc',label:'Mô tả ngắn',default:''},
  {name:'description',label:'Mô tả',type:'textarea',default:''},{name:'price',label:'Giá',type:'number',default:0},{name:'duration_min',label:'Phút',type:'number',default:30},
  {name:'image',label:'Ảnh URL',default:''},{name:'published',label:'Published (1/0)',type:'number',default:1},{name:'allow_booking',label:'Cho đặt lịch (1/0)',type:'number',default:1},{name:'featured',label:'Nổi bật (1/0)',type:'number',default:0}
 ]}/>;}

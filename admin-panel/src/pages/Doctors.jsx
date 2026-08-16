import CrudPage from '../components/CrudPage';
export default function Doctors(){return <CrudPage title="Bác sĩ" endpoint="/doctors/admin/list"
 columns={[{key:'full_name',label:'Họ tên'},{key:'title',label:'Chức danh'},{key:'specialty',label:'Chuyên khoa'},{key:'years_exp',label:'Kinh nghiệm'}]}
 fields={[
  {name:'full_name',label:'Họ tên',default:''},{name:'title',label:'Chức danh',default:''},{name:'specialty',label:'Chuyên khoa',default:''},{name:'years_exp',label:'Năm KN',type:'number',default:0},
  {name:'bio',label:'Tiểu sử',type:'textarea',default:''},{name:'education',label:'Học vấn',type:'textarea',default:''},{name:'schedule',label:'Lịch làm việc',default:''},{name:'avatar',label:'Avatar URL',default:''},
  {name:'published',label:'Hiển thị (1/0)',type:'number',default:1},{name:'featured',label:'Nổi bật (1/0)',type:'number',default:0}
 ]}/>;}

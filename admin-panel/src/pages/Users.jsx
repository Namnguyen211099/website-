import CrudPage from '../components/CrudPage';
export default function Users(){return <CrudPage title="Người dùng" endpoint="/users" createEndpoint="/users" updateEndpoint="/users" deleteEndpoint="/users"
 columns={[{key:'full_name',label:'Họ tên'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'status',label:'Status'}]}
 fields={[
  {name:'email',label:'Email',default:''},{name:'full_name',label:'Họ tên',default:''},{name:'phone',label:'Điện thoại',default:''},{name:'password',label:'Mật khẩu (bắt buộc khi tạo)',type:'password',default:''},
  {name:'role',label:'Role',type:'select',options:[{value:'member',label:'Member'},{value:'reception',label:'Reception'},{value:'doctor',label:'Doctor'},{value:'pharmacist',label:'Pharmacist'},{value:'admin',label:'Admin'}],default:'member'},
  {name:'status',label:'Status',type:'select',options:[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'},{value:'banned',label:'Banned'}],default:'active'}
 ]}/>;}

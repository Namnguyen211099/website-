import CrudPage from '../components/CrudPage';
export default function Blogs(){return <CrudPage title="Bài viết" endpoint="/blogs/admin/list"
 columns={[{key:'title',label:'Tiêu đề'},{key:'category',label:'Nhóm'},{key:'status',label:'Trạng thái'},{key:'views',label:'Views'}]}
 fields={[
  {name:'title',label:'Tiêu đề',default:''},{name:'category',label:'Nhóm',default:''},{name:'excerpt',label:'Tóm tắt',default:''},{name:'content',label:'Nội dung',type:'textarea',default:''},
  {name:'cover_image',label:'Ảnh cover URL',default:''},{name:'status',label:'Trạng thái',type:'select',options:[{value:'published',label:'Published'},{value:'draft',label:'Draft'}],default:'published'},
  {name:'featured',label:'Nổi bật (1/0)',type:'number',default:0},{name:'meta_title',label:'Meta title',default:''},{name:'meta_desc',label:'Meta description',default:''}
 ]}/>;}

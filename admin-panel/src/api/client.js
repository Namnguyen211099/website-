import axios from 'axios';
import { toast } from 'react-toastify';

const api=axios.create({
  baseURL:'/api',
  timeout:15000,
  withCredentials:true,
  headers:{'Content-Type':'application/json'}
});

api.interceptors.response.use(
  res=>res,
  err=>{
    const msg=err.response?.data?.error || err.response?.data?.message || err.message || 'Lỗi kết nối server';
    if(err.response?.status===401){
      if(!window.location.pathname.includes('/login')){
        toast.error('Phiên đăng nhập hết hạn · Vui lòng đăng nhập lại');
        window.location.href='/api/admin/login';
      }
    } else if(err.response?.status===403) toast.error('Bạn không có quyền thực hiện hành động này');
    else toast.error(msg);
    return Promise.reject(err);
  }
);
export default api;

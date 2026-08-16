import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const Ctx = createContext();
export const ROLE_LEVEL = { super_admin:1, admin:2, pharmacist:3, doctor:4, reception:5, member:6 };
export const roleAtLeast = (me,r) => !!me && ROLE_LEVEL[me.role] <= ROLE_LEVEL[r];
export const hasAnyRole = (me,roles) => !!me && roles.includes(me.role);

axios.defaults.withCredentials = true;

export function AuthProvider({children}) {
  const [user,setUser]=useState(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    axios.get('/api/auth/me',{withCredentials:true})
      .then(r=>setUser(r.data.user))
      .catch(()=>setUser(null))
      .finally(()=>setReady(true));
  },[]);
  const login=async(email,password)=>{
    const r=await axios.post('/api/auth/login',{email,password},{withCredentials:true});
    setUser(r.data.user);
    return r.data;
  };
  const logout=async()=>{
    try{await axios.post('/api/auth/logout',{}, {withCredentials:true});}catch(_){}
    setUser(null);
  };
  return <Ctx.Provider value={{user,ready,token:user?'session-cookie':null,login,logout,roleAtLeast:r=>roleAtLeast(user,r),hasAnyRole:rs=>hasAnyRole(user,rs)}}>{children}</Ctx.Provider>;
}
export const useAuth=()=>useContext(Ctx);

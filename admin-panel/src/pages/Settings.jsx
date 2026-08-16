import {useEffect,useState} from 'react';
import api from '../api/client';
export default function Settings(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{api.get('/settings?group=all').then(r=>{const d=r.data.data||{};setItems(Object.entries(d).flatMap(([g,vals])=>Object.entries(vals).map(([k,v])=>({group:g,key:k,value:v}))))}).finally(()=>setLoading(false))},[]);
 const save=async i=>{await api.post('/settings',i);};
 return <div><h1 className="text-2xl font-bold mb-4">Cài đặt</h1><div className="bg-white rounded-xl shadow p-4">{loading?'Đang tải...':items.map((i,n)=><div key={n} className="grid md:grid-cols-[160px_220px_1fr_auto] gap-2 items-center border-b py-3"><span>{i.group}</span><span>{i.key}</span><input className="border rounded px-3 py-2" value={i.value||''} onChange={e=>setItems(items.map((x,j)=>j===n?{...x,value:e.target.value}:x))}/><button onClick={()=>save(i)} className="bg-emerald-600 text-white px-3 py-2 rounded">Lưu</button></div>)}</div></div>;
}

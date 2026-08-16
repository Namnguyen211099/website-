import {useEffect,useState} from 'react';
import api from '../api/client';
export default function Appointments(){
 const [rows,setRows]=useState([]),[loading,setLoading]=useState(true);
 const load=async()=>{setLoading(true);try{setRows((await api.get('/appointments')).data.data||[])}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const status=async(id,value)=>{await api.patch(`/appointments/${id}/status`,{status:value});load()};
 return <div><h1 className="text-2xl font-bold mb-4">Lịch hẹn</h1><div className="bg-white rounded-xl shadow overflow-auto">{loading?<div className="p-6">Đang tải...</div>:
 <table className="min-w-full text-sm"><thead><tr className="bg-gray-50 border-b">{['Mã','Khách','SĐT','Ngày','Giờ','Tiền','Trạng thái'].map(x=><th className="p-3 text-left" key={x}>{x}</th>)}</tr></thead>
 <tbody>{rows.map(r=><tr className="border-b" key={r.id}><td className="p-3">{r.code}</td><td className="p-3">{r.full_name}</td><td className="p-3">{r.phone}</td><td className="p-3">{String(r.appt_date).slice(0,10)}</td><td className="p-3">{r.appt_time}</td><td className="p-3">{Number(r.amount||0).toLocaleString()}đ</td><td className="p-3"><select value={r.status} onChange={e=>status(r.id,e.target.value)} className="border rounded px-2 py-1">{['pending','confirmed','done','cancelled','no_show'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>}</div></div>;
}

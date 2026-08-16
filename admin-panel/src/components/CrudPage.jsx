import { useEffect, useState } from 'react';
import api from '../api/client';

export default function CrudPage({title, endpoint, createEndpoint, updateEndpoint, deleteEndpoint, columns, fields, canDelete=true}) {
  const [rows,setRows]=useState([]), [editing,setEditing]=useState(null), [form,setForm]=useState({}), [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);try{const r=await api.get(endpoint);setRows(r.data.data||[]);}finally{setLoading(false);}};
  useEffect(()=>{load();},[endpoint]);
  const open=(row=null)=>{setEditing(row);setForm(row?{...row}:Object.fromEntries(fields.map(f=>[f.name,f.default??''])));};
  const save=async e=>{
    e.preventDefault();
    const body={...form};
    for(const f of fields) if(f.type==='number' && body[f.name]!=='') body[f.name]=Number(body[f.name]);
    if(editing) await api.put(`${updateEndpoint || endpoint.replace('/admin/list','/admin')}/${editing.id}`,body);
    else await api.post(createEndpoint || endpoint.replace('/admin/list','/admin'),body);
    setEditing(null); await load();
  };
  const del=async id=>{if(!confirm('Xóa bản ghi này?'))return;await api.delete(`${deleteEndpoint || endpoint.replace('/admin/list','/admin')}/${id}`);await load();};
  return <div>
    <div className="flex items-center justify-between mb-4"><h1 className="text-2xl font-bold">{title}</h1><button onClick={()=>open()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">+ Thêm</button></div>
    <div className="bg-white rounded-xl shadow overflow-auto">
      {loading?<div className="p-6">Đang tải...</div>:<table className="min-w-full text-sm"><thead><tr className="border-b bg-gray-50">{columns.map(c=><th key={c.key} className="text-left p-3">{c.label}</th>)}<th className="p-3">Thao tác</th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.id} className="border-b">{columns.map(c=><td key={c.key} className="p-3">{c.render?c.render(r):String(r[c.key]??'')}</td>)}<td className="p-3 whitespace-nowrap"><button onClick={()=>open(r)} className="text-blue-600 mr-3">Sửa</button>{canDelete&&<button onClick={()=>del(r.id)} className="text-red-600">Xóa</button>}</td></tr>)}</tbody></table>}
    </div>
    {editing!==null&&<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><form onSubmit={save} className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">{editing?.id?'Sửa':'Thêm'} {title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{fields.map(f=><label key={f.name} className={f.type==='textarea'?'md:col-span-2':''}><span className="block text-sm mb-1">{f.label}</span>
        {f.type==='textarea'?<textarea rows="4" className="w-full border rounded px-3 py-2" value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>:f.type==='select'?<select className="w-full border rounded px-3 py-2" value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<input type={f.type||'text'} className="w-full border rounded px-3 py-2" value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:f.type==='checkbox'?e.target.checked:e.target.value})}/>}
      </label>)}</div>
      <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={()=>setEditing(null)} className="px-4 py-2 border rounded">Hủy</button><button className="px-4 py-2 bg-emerald-600 text-white rounded">Lưu</button></div>
    </form></div>}
  </div>;
}

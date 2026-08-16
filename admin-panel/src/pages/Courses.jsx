import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const LEVEL = { "co-ban": "Co ban", "trung-cap": "Trung cap", "nang-cao": "Nang cao" };
const STATUS = { draft: "Nhap", open: "Dang mo", opening_soon: "Sap khai giang", closed: "Da dong" };
const STATUS_CLS = { draft: "bg-gray-200", open: "bg-emerald-100 text-emerald-700", opening_soon: "bg-amber-100 text-amber-700", closed: "bg-gray-300" };
const empty = { title: "", category: "cham-cuu", level: "co-ban", short_desc: "", description: "", teacher_id: "", price_original: 0, price_sale: 0, total_videos: 0, total_hours: 0, max_students: 0, status: "draft", featured_home: 0, best_seller: 0, has_certificate: 1, thumbnail: "", video_url: "", has_video: 0, tags: [] };
export default function Courses() {
  const [list, setList] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ ...empty });
  const load = () => {
    axios.get("/api/courses/admin/list").then(r => setList(r.data.data));
    axios.get("/api/doctors").then(r => setDoctors(r.data.data));
  };
  useEffect(load, []);
  const save = async () => {
    try {
      if (editing) await axios.put("/api/courses/admin/" + editing, f);
      else await axios.post("/api/courses/admin", f);
      toast.success(editing ? "Da cap nhat" : "Da tao"); setShow(false); load();
    } catch (e) { toast.error(e.response?.data?.error || "Loi"); }
  };
  const del = async (id) => { if (!confirm("Xoa?")) return; await axios.delete("/api/courses/admin/" + id); toast.success("Da xoa"); load(); };
  const toggle = async (id, field) => {
    const c = list.find(x => x.id === id);
    await axios.put("/api/courses/admin/" + id, { ...c, [field]: c[field] ? 0 : 1 });
    load();
  };
  const fmt = n => new Intl.NumberFormat("vi-VN").format(n || 0);
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Quan ly Khoa hoc <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded ml-2">V3.5 MOI</span></h1>
        <button onClick={() => { setEditing(null); setF({ ...empty }); setShow(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">+ Them khoa hoc</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="p-3 text-left">Anh</th><th className="text-left p-3">Ma · Ten</th><th>Giang vien</th><th>Level</th><th>Gia</th><th>HV</th><th>Trang thai</th><th>Noi bat</th><th>Best</th><th className="p-3">Thao tac</th>
          </tr></thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} className="border-t hover:bg-emerald-50/40">
                <td className="p-2"><div className="w-14 h-10 bg-gray-100 rounded">{c.thumbnail && <img src={c.thumbnail} className="w-full h-full object-cover" />}</div></td>
                <td className="p-3"><div className="text-xs text-gray-400">{c.course_code}</div><div className="font-semibold">{c.title}</div></td>
                <td className="text-center">{c.teacher_name || "-"}</td>
                <td className="text-center"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{LEVEL[c.level]}</span></td>
                <td className="text-right"><div className="font-semibold">{fmt(c.price_sale)}d</div><div className="text-xs text-gray-400 line-through">{fmt(c.price_original)}d</div></td>
                <td className="text-center">{c.enrolled_count}{c.max_students > 0 ? "/" + c.max_students : ""}</td>
                <td className="text-center"><span className={"text-xs px-2 py-0.5 rounded " + STATUS_CLS[c.status]}>{STATUS[c.status]}</span></td>
                <td className="text-center"><input type="checkbox" checked={c.featured_home} onChange={() => toggle(c.id, "featured_home")} /></td>
                <td className="text-center"><input type="checkbox" checked={c.best_seller} onChange={() => toggle(c.id, "best_seller")} /></td>
                <td className="p-3 text-center whitespace-nowrap">
                  <button onClick={() => { setEditing(c.id); setF(c); setShow(true); }} className="text-emerald-600 mr-2">Sua</button>
                  <button onClick={() => del(c.id)} className="text-rose-600">Xoa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editing ? "Sua khoa hoc" : "Them khoa hoc"}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input placeholder="Ten khoa hoc *" className="col-span-2 border rounded px-3 py-2" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
              <select className="border rounded px-3 py-2" value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>
                {["cham-cuu","thao-duoc","cot-song","chan-doan","duong-sinh","noi-tiet"].map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="border rounded px-3 py-2" value={f.level} onChange={e => setF({ ...f, level: e.target.value })}>
                {Object.entries(LEVEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select className="border rounded px-3 py-2" value={f.teacher_id || ""} onChange={e => setF({ ...f, teacher_id: e.target.value ? parseInt(e.target.value) : null })}>
                <option value="">-- Chon giang vien --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.title} {d.full_name}</option>)}
              </select>
              <select className="border rounded px-3 py-2" value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>
                {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input type="number" className="border rounded px-3 py-2" value={f.price_original} onChange={e => setF({ ...f, price_original: +e.target.value })} placeholder="Gia goc" />
              <input type="number" className="border rounded px-3 py-2" value={f.price_sale} onChange={e => setF({ ...f, price_sale: +e.target.value })} placeholder="Gia ban" />
              <input type="number" className="border rounded px-3 py-2" value={f.total_videos} onChange={e => setF({ ...f, total_videos: +e.target.value })} placeholder="So video" />
              <input type="number" className="border rounded px-3 py-2" value={f.total_hours} onChange={e => setF({ ...f, total_hours: +e.target.value })} placeholder="Tong gio" />
              <input placeholder="URL anh bia" className="col-span-2 border rounded px-3 py-2" value={f.thumbnail} onChange={e => setF({ ...f, thumbnail: e.target.value })} />
              <input placeholder="URL Video gioi thieu (YouTube)" className="col-span-2 border rounded px-3 py-2" value={f.video_url || ""} onChange={e => setF({ ...f, video_url: e.target.value, has_video: e.target.value ? 1 : 0 })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={f.has_video} onChange={e => setF({ ...f, has_video: e.target.checked ? 1 : 0 })} /> Co video gioi thieu</label>
              <textarea placeholder="Mo ta" rows={3} className="col-span-2 border rounded px-3 py-2" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured_home} onChange={e => setF({ ...f, featured_home: e.target.checked ? 1 : 0 })} /> Hien o Home</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={f.best_seller} onChange={e => setF({ ...f, best_seller: e.target.checked ? 1 : 0 })} /> Best seller</label>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShow(false)} className="px-4 py-2 border rounded">Huy</button>
              <button onClick={save} className="bg-emerald-600 text-white px-5 py-2 rounded font-semibold">Luu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

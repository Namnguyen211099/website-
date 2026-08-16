import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const S = { pending: "Cho", active: "Dang hoc", completed: "Hoan thanh", cancelled: "Huy" };
const P = { unpaid: "Chua tra", paid: "Da tra", refunded: "Hoan tien" };
export default function Enrollments() {
  const [list, setList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [f, setF] = useState({ course_id: "", status: "", q: "" });
  const load = () => {
    axios.get("/api/courses/admin/list").then(r => setCourses(r.data.data));
    const p = new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([,v]) => v))).toString();
    axios.get("/api/courses/enrollments/admin" + (p ? "?" + p : "")).then(r => setList(r.data.data));
  };
  useEffect(load, [f]);
  const updateStatus = async (id, status) => {
    try { await axios.patch("/api/courses/enrollments/" + id + "/status", { status }); toast.success("Da cap nhat"); load(); }
    catch (e) { toast.error(e.response?.data?.error); }
  };
  const confirm = async (e) => {
    try {
      await axios.patch("/api/courses/enrollments/" + e.id + "/status", { status: "active", payment_status: "paid", amount_paid: e.amount_paid });
      toast.success("Da xac nhan + ghi Ke toan + tang HV"); load();
    } catch (err) { toast.error(err.response?.data?.error); }
  };
  const cert = async (id) => { await updateStatus(id, "completed"); toast.success("Da cap chung chi CERT-DX"); };
  const remind = async (id) => { await axios.post("/api/courses/enrollments/" + id + "/reminder"); toast.success("Da gui nhac"); };
  const fmt = n => new Intl.NumberFormat("vi-VN").format(n || 0);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Danh sach hoc vien <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded ml-2">V3.5 MOI</span></h1>
      <div className="bg-white rounded-xl p-4 mb-4 flex gap-3 flex-wrap">
        <select className="border rounded px-3 py-2 text-sm" value={f.course_id} onChange={e => setF({ ...f, course_id: e.target.value })}>
          <option value="">-- Tat ca khoa --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} · {c.title}</option>)}
        </select>
        <select className="border rounded px-3 py-2 text-sm" value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>
          <option value="">-- Tat ca trang thai --</option>
          {Object.entries(S).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input placeholder="Tim ten / SDT" className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]" value={f.q} onChange={e => setF({ ...f, q: e.target.value })} />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden text-sm">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <th className="p-3 text-left">Khoa</th><th className="text-left p-3">Hoc vien</th><th>Tien</th><th>TT</th><th>Trang thai</th><th>%</th><th>Chung chi</th><th className="p-3">Thao tac</th>
          </tr></thead>
          <tbody>
            {list.map(e => (
              <tr key={e.id} className="border-t hover:bg-emerald-50/40">
                <td className="p-3"><div className="text-xs text-gray-400">{e.course_code}</div><div className="font-semibold">{e.course_title}</div></td>
                <td className="p-3"><div className="font-medium">{e.guest_name}</div><div className="text-xs text-gray-500">{e.guest_phone}</div></td>
                <td className="text-right font-semibold">{fmt(e.amount_paid)}d</td>
                <td className="text-center"><span className={"text-xs px-2 py-0.5 rounded " + (e.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{P[e.payment_status]}</span></td>
                <td className="text-center">{S[e.status]}</td>
                <td className="text-center">{e.progress_pct}%</td>
                <td className="text-center text-xs">{e.certificate_no || "—"}</td>
                <td className="p-3 text-center whitespace-nowrap">
                  {e.payment_status !== "paid" && <button onClick={() => confirm(e)} className="text-emerald-600 mr-2 text-xs">Xac nhan</button>}
                  {e.status === "active" && <button onClick={() => cert(e.id)} className="text-indigo-600 mr-2 text-xs">Chung chi</button>}
                  <button onClick={() => remind(e.id)} className="text-blue-600 mr-2 text-xs">Nhac</button>
                  <select className="text-xs border rounded px-1" value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)}>
                    {Object.entries(S).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

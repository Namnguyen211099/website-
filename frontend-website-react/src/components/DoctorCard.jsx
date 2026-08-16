export default function DoctorCard({ doctor }) {
  const initials = doctor.name
    .split(' ')
    .slice(-2)
    .map(n => n[0])
    .join('')

  return (
    <div className="card p-7.5 text-center group hover:-translate-y-1.5">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4"
        style={{ background: `linear-gradient(135deg, ${doctor.color1}, ${doctor.color2})` }}
      >
        {initials}
      </div>
      <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
      <div className="text-primary font-semibold text-[13px] mb-2">{doctor.spec}</div>
      <div className="text-[13px] text-muted mb-1">{doctor.exp}</div>
      <div className="text-[13px] text-muted mb-1">{doctor.level}</div>
      <div className="text-[13px] text-primary">{doctor.email}</div>
    </div>
  )
}

export default function ServiceCard({ service }) {
  return (
    <div className="card group">
      <div className="h-52 overflow-hidden bg-primary-light">
        <img
          src={service.img}
          alt={service.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5.5">
        <h3 className="font-bold text-lg mb-2">{service.name}</h3>
        <p className="text-[14px] text-muted mb-3.5 leading-relaxed">{service.desc}</p>
        <div className="flex justify-between items-center pt-3.5 border-t border-gray-100">
          <span className="font-extrabold text-xl text-primary">{service.price}</span>
          <span className="status-pill bg-primary-light text-primary">{service.tag}</span>
        </div>
      </div>
    </div>
  )
}

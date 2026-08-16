import { featuresData } from '../data/content'

export default function Features() {
  return (
    <div className="container-custom -mt-10 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresData.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl mx-auto mb-3.5">
              {item.icon}
            </div>
            <h4 className="font-bold text-[15px] mb-1.5">{item.title}</h4>
            <p className="text-[13px] text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

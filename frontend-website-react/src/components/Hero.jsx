import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-dark to-primary text-white py-[90px]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-[44px] font-extrabold leading-tight mb-4.5">
              Phong Kham Dong Y
              <br />
              <span className="text-teal-300">DXGroup</span>
            </h1>
            <p className="text-base text-white/90 mb-7 leading-relaxed">
              Chung toi mang den nhung phuong phap dieu tri Dong Y truyen thong ket hop cong nghe hien dai,
              giup ban dat lai can bang nang luong va suc khoe toan dien.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link to="/booking" className="btn-primary bg-white text-primary hover:bg-gray-100">
                Dat lich hen
              </Link>
              <Link to="/services" className="btn-outline">
                Xem dich vu
              </Link>
            </div>
          </div>
          <div className="bg-white/10 rounded-3xl aspect-[4/3] flex items-center justify-center text-[80px] backdrop-blur-sm">
            🌿
          </div>
        </div>
      </div>
    </section>
  )
}

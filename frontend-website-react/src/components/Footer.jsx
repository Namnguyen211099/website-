import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-5">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          {/* Column 1 - About */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white font-extrabold">
                DX
              </div>
              <span className="font-extrabold text-xl text-white">DXGroup</span>
            </Link>
            <p className="text-[13px] text-white/70 leading-relaxed">
              Phong Kham Dong Y DXGroup - Cham soc suc khoe ban va gia dinh voi phuong phap Dong Y truyen thong ket hop hien dai.
            </p>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="font-bold text-[15px] mb-4">Dich vu</h4>
            <div className="flex flex-col gap-2">
              <Link to="/services" className="text-[13px] text-white/70 hover:text-white transition-colors">Cham cuu</Link>
              <Link to="/services" className="text-[13px] text-white/70 hover:text-white transition-colors">Xoa bop</Link>
              <Link to="/services" className="text-[13px] text-white/70 hover:text-white transition-colors">Kham tong quat</Link>
              <Link to="/services" className="text-[13px] text-white/70 hover:text-white transition-colors">Dieu tri noi tiet</Link>
            </div>
          </div>

          {/* Column 3 - Info */}
          <div>
            <h4 className="font-bold text-[15px] mb-4">Thong tin</h4>
            <div className="flex flex-col gap-2">
              <Link to="/doctors" className="text-[13px] text-white/70 hover:text-white transition-colors">Doi ngu bac si</Link>
              <Link to="/courses" className="text-[13px] text-white/70 hover:text-white transition-colors">Khoa hoc</Link>
              <Link to="/contact" className="text-[13px] text-white/70 hover:text-white transition-colors">Lien he</Link>
              <Link to="/booking" className="text-[13px] text-white/70 hover:text-white transition-colors">Dat lich</Link>
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-bold text-[15px] mb-4">Lien he</h4>
            <div className="flex flex-col gap-2 text-[13px] text-white/70">
              <p>📍 123 Nguyen Hue, Q1, TP.HCM</p>
              <p>📞 028 1234 5678</p>
              <p>✉️ info@dxgroup.vn</p>
              <p>🕐 8:00 - 20:00 hang ngay</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-5 text-center text-[13px] text-white/50">
          © 2025 DXGroup Dong Y Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

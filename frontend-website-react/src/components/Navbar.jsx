import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const navItems = [
    { to: '/', label: 'Trang chu' },
    { to: '/services', label: 'Dich vu' },
    { to: '/doctors', label: 'Bac si' },
    { to: '/courses', label: 'Khoa hoc' },
    { to: '/booking', label: 'Dat lich' },
    { to: '/contact', label: 'Lien he' }
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white font-extrabold">
              DX
            </div>
            <span className="font-extrabold text-xl text-primary">DXGroup</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `font-semibold text-[14px] transition-colors ${
                    isActive ? 'text-primary' : 'text-dark hover:text-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/booking" className="bg-primary text-white px-5.5 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-[14px]">
              Dat lich ngay
            </Link>
          </div>

          {/* Mobile Menu Button - co the mo rong sau */}
          <div className="lg:hidden">
            <button className="p-2 text-dark">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

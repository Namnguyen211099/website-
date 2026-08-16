import { useState } from 'react'

export default function CourseCard({ course, onRegister }) {
  const [showToast, setShowToast] = useState(false)

  const handleRegister = () => {
    if (onRegister) {
      onRegister(course.name)
    } else {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  return (
    <div className="card group relative">
      <div className="h-56 overflow-hidden bg-primary-light relative">
        <img
          src={course.img}
          alt={course.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {course.video && (
          <>
            <span className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
              🎬 Co video
            </span>
            <a
              href={course.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 rounded-full flex items-center justify-center text-xl text-primary hover:scale-110 transition-transform cursor-pointer"
            >
              ▶
            </a>
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-1.5">{course.name}</h3>
        <div className="text-accent font-semibold text-[13px] mb-2.5">{course.subtitle}</div>
        <div className="text-[13px] text-muted mb-3">Giang vien: {course.teacher}</div>
        <div className="text-[13px] text-muted mb-4 leading-relaxed">{course.desc}</div>

        {/* Stats */}
        <div className="flex gap-6 py-3.5 border-y border-gray-100 mb-4">
          <div className="text-center flex-1">
            <div className="text-xl font-extrabold text-primary">{course.students}</div>
            <div className="text-[11px] text-muted">Hoc vien</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-extrabold text-primary">{course.duration}</div>
            <div className="text-[11px] text-muted">Thoi luong</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-extrabold text-accent">{course.price}</div>
            <div className="text-[11px] text-muted">Hoc phi</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-muted">
            {course.video ? '✅ Co video gioi thieu' : '📖 Tai lieu chi tiet'}
          </span>
          <button
            onClick={handleRegister}
            className="bg-primary text-white px-5.5 py-2.5 rounded-lg font-semibold text-[14px] hover:bg-primary-dark transition-colors"
          >
            Dang ky
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast fixed top-5 right-5 px-6 py-3.5 bg-primary text-white rounded-xl z-50 shadow-lg font-semibold text-[13px]">
          ✅ Dang ky thanh cong! Chung toi se lien he som nhat.
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { submitAppointment } from '../hooks/useApi'

export default function BookingForm({ variant = 'quick', onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Lay du lieu tu form
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    // Gui len API backend
    const result = await submitAppointment(data)

    setSubmitting(false)
    setSubmitted(true)

    if (result.fallback) {
      setMessage('✅ Gui thanh cong! (Dang che do demo - chay backend de luu CSDL)')
    } else {
      setMessage('✅ Dat lich thanh cong! Chung toi se lien he som nhat.')
    }

    if (onSuccess) onSuccess(result)

    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      e.target.reset()
    }, 4000)
  }

  const buttonText = submitting
    ? 'Dang gui...'
    : submitted
    ? message
    : variant === 'quick'
    ? 'Gui yeu cau dat lich'
    : 'Xac nhan dat lich'

  if (variant === 'quick') {
    return (
      <div className="bg-white rounded-2xl p-7.5 text-dark">
        <h3 className="font-bold text-xl mb-5">Dat lich nhanh</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <div>
              <label className="form-label">Ho ten</label>
              <input name="full_name" required placeholder="Nhap ho ten" className="form-input" />
            </div>
            <div>
              <label className="form-label">So dien thoai</label>
              <input name="phone" required placeholder="SDT lien he" className="form-input" />
            </div>
          </div>
          <div className="mb-3.5">
            <label className="form-label">Chon dich vu</label>
            <select name="service_name" required className="form-input">
              <option>Cham cuu tong hop</option>
              <option>Xoa bop bam huyet</option>
              <option>Kham tong quat</option>
              <option>Dieu tri noi tiet</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="form-label">Ngay hen</label>
            <input name="appointment_date" type="date" required className="form-input" />
          </div>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {buttonText}
          </button>
        </form>
      </div>
    )
  }

  // Full booking form
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-md">
      <h2 className="font-extrabold text-2xl mb-6">Thong tin dat lich</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="form-label">Ho ten *</label>
            <input name="full_name" required placeholder="Nhap ho ten day du" className="form-input" />
          </div>
          <div>
            <label className="form-label">So dien thoai *</label>
            <input name="phone" required placeholder="SDT lien he" className="form-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="form-label">Email</label>
            <input name="email" type="email" placeholder="email@example.com" className="form-input" />
          </div>
          <div>
            <label className="form-label">Ngay sinh</label>
            <input name="birth_date" type="date" className="form-input" />
          </div>
        </div>
        <div className="mb-3.5">
          <label className="form-label">Dich vu can kham *</label>
          <select name="service_name" required className="form-input">
            <option>Cham cuu tong hop</option>
            <option>Xoa bop bam huyet</option>
            <option>Kham tong quat</option>
            <option>Dieu tri noi tiet</option>
            <option>Kham chuyen khoa cot song</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="form-label">Ngay hen *</label>
            <input name="appointment_date" type="date" required className="form-input" />
          </div>
          <div>
            <label className="form-label">Gio hen *</label>
            <select name="appointment_time" required className="form-input">
              <option>08:00</option>
              <option>09:00</option>
              <option>10:00</option>
              <option>14:00</option>
              <option>15:00</option>
              <option>16:00</option>
            </select>
          </div>
        </div>
        <div className="mb-3.5">
          <label className="form-label">Bac si uu tien</label>
          <select name="preferred_doctor" className="form-input">
            <option value="">Khong uu tien</option>
            <option>BS. Tran Van Hung - Cham cuu</option>
            <option>BS. Nguyen Thi Lan - Noi tiet</option>
            <option>BS. Pham Minh Tuan - Cot song</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="form-label">Ly do kham / Ghi chu</label>
          <textarea name="notes" rows="3" placeholder="Mo ta ngan gon ve tinh trang suc khoe..." className="form-input" />
        </div>
        <button type="submit" className="btn-submit" disabled={submitting}>
          {buttonText}
        </button>
      </form>
    </div>
  )
}

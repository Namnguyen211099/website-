import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { submitContact } from '../hooks/useApi'

const contactInfo = [
  { icon: '📍', title: 'Dia chi', lines: ['123 Duong Nguyen Hue', 'Phuong Ben Nghe', 'Quan 1, TP.HCM'] },
  { icon: '📞', title: 'So dien thoai', lines: ['028 1234 5678', '0901 234 567 (Hotline)', '8:00 - 20:00 hang ngay'] },
  { icon: '✉️', title: 'Email', lines: ['info@dxgroup.vn', 'booking@dxgroup.vn', 'khoahoc@dxgroup.vn'] }
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    await submitContact(data)

    setSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      e.target.reset()
    }, 3000)
  }

  const buttonText = submitting
    ? 'Dang gui...'
    : submitted
    ? '✅ Gui yeu cau thanh cong!'
    : 'Gui yeu cau'

  return (
    <div className="page-animate">
      <PageHeader
        title="Lien he chung toi"
        subtitle="Chung toi luon san sang ho tro ban"
      />
      <section className="py-[70px]">
        <div className="container-custom">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5 mb-12.5">
            {contactInfo.map((item, idx) => (
              <div key={idx} className="card p-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl mx-auto mb-3.5">
                  {item.icon}
                </div>
                <h4 className="font-bold text-base mb-2">{item.title}</h4>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-[14px] text-muted">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-md">
            <h2 className="font-extrabold text-2xl mb-6">Gui yeu cau lien he</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="form-label">Ho ten *</label>
                  <input name="full_name" required placeholder="Nhap ho ten" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input name="email" type="email" required placeholder="email@example.com" className="form-input" />
                </div>
              </div>
              <div className="mb-3.5">
                <label className="form-label">Chu de *</label>
                <input name="subject" required placeholder="Chu de yeu cau" className="form-input" />
              </div>
              <div className="mb-6">
                <label className="form-label">Noi dung *</label>
                <textarea name="message" rows="4" required placeholder="Nhap noi dung muon hoi..." className="form-input" />
              </div>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

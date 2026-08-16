import { useState, useEffect } from 'react'
import { servicesData, doctorsData, coursesData } from '../data/content'

/**
 * Custom hook de goi API backend
 * Neu API khong hoat dong (backend chua chay) -> su dung du lieu mau lam fallback
 * De nguoi dung van xem duoc giao dien
 */

export function useServices() {
  const [data, setData] = useState(servicesData)
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    fetch('/api/services')
      .then(res => {
        if (!res.ok) throw new Error('API chua chay')
        return res.json()
      })
      .then(result => {
        if (result.data && result.data.length > 0) {
          setData(result.data)
          setFromApi(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false) // Su dung du lieu mau
      })
  }, [])

  return { data, loading, fromApi }
}

export function useDoctors() {
  const [data, setData] = useState(doctorsData)
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => {
        if (!res.ok) throw new Error('API chua chay')
        return res.json()
      })
      .then(result => {
        if (result.data && result.data.length > 0) {
          // Chuyen doi du lieu API phu hop giao dien
          const mapped = result.data.map(d => ({
            id: d.id,
            name: `${d.title || ''} ${d.full_name}`.trim(),
            spec: d.specialty || 'Chuyen khoa Dong Y',
            exp: d.experience_years ? `${d.experience_years} nam kinh nghiem` : 'Nhieu nam kinh nghiem',
            level: d.degree || 'Bang cap',
            email: d.email || '',
            color1: d.color1 || '#0d9669',
            color2: d.color2 || '#0d9488',
            avatar: d.avatar
          }))
          setData(mapped)
          setFromApi(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading, fromApi }
}

export function useFeaturedCourses() {
  const [data, setData] = useState(coursesData)
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    fetch('/api/courses/featured')
      .then(res => {
        if (!res.ok) throw new Error('API chua chay')
        return res.json()
      })
      .then(result => {
        if (result.data && result.data.length > 0) {
          const mapped = result.data.map(c => ({
            id: c.id,
            name: c.title,
            subtitle: c.category || 'Khoa hoc Dong Y',
            teacher: c.teacher_name || 'Chuyen gia DXGroup',
            students: c.enrolled_count || 0,
            price: new Intl.NumberFormat('vi-VN').format(c.price_sale || c.price_original || 0) + 'd',
            duration: c.total_hours ? `${c.total_hours} gio` : c.total_videos ? `${c.total_videos} video` : '8 tuan',
            img: c.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=350&fit=crop',
            video: c.has_video || !!c.video_url,
            videoUrl: c.video_url || '',
            desc: c.short_desc || c.description?.slice(0, 100) || 'Khoa hoc chia se kien thuc suc khoe'
          }))
          setData(mapped)
          setFromApi(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading, fromApi }
}

export function useAllCourses() {
  const [data, setData] = useState(coursesData)
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => {
        if (!res.ok) throw new Error('API chua chay')
        return res.json()
      })
      .then(result => {
        if (result.data && result.data.length > 0) {
          const mapped = result.data.map(c => ({
            id: c.id,
            name: c.title,
            subtitle: c.category || 'Khoa hoc Dong Y',
            teacher: c.teacher_name || 'Chuyen gia DXGroup',
            students: c.enrolled_count || 0,
            price: new Intl.NumberFormat('vi-VN').format(c.price_sale || c.price_original || 0) + 'd',
            duration: c.total_hours ? `${c.total_hours} gio` : c.total_videos ? `${c.total_videos} video` : '8 tuan',
            img: c.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=350&fit=crop',
            video: c.has_video || !!c.video_url,
            videoUrl: c.video_url || '',
            desc: c.short_desc || c.description?.slice(0, 100) || 'Khoa hoc chia se kien thuc suc khoe'
          }))
          setData(mapped)
          setFromApi(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading, fromApi }
}

/**
 * Ham gui lich hen len API backend
 */
export async function submitAppointment(formData) {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const result = await res.json()
    return { success: res.ok, data: result }
  } catch (err) {
    // Neu API khong hoat dong, van tra ve thanh cong de test giao dien
    return { success: true, fallback: true, data: { message: 'Gui thanh cong (che do demo)' } }
  }
}

/**
 * Ham gui lien he
 */
export async function submitContact(formData) {
  try {
    // Co the tao API /api/contact trong backend sau
    // Hien tai giu che do demo
    return { success: true, fallback: true }
  } catch (err) {
    return { success: true, fallback: true }
  }
}

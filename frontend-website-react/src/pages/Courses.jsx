import PageHeader from '../components/PageHeader'
import CourseCard from '../components/CourseCard'
import { useAllCourses } from '../hooks/useApi'

export default function Courses() {
  const { data: courses, loading } = useAllCourses()

  if (loading) {
    return (
      <div className="page-animate">
        <PageHeader title="Khoa hoc" subtitle="Dang tai..." />
        <div className="p-16 text-center text-muted">Dang tai du lieu...</div>
      </div>
    )
  }

  return (
    <div className="page-animate">
      <PageHeader
        title="Khoa hoc Dong Y"
        subtitle="Hoc kien thuc tu cac chuyen gia"
      />
      <section className="py-[70px]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import PageHeader from '../components/PageHeader'
import BookingForm from '../components/BookingForm'

export default function Booking() {
  return (
    <div className="page-animate">
      <PageHeader
        title="Dat lich hen truc tuyen"
        subtitle="Chung toi se lien he lai som nhat"
      />
      <section className="py-[70px]">
        <div className="container-custom">
          <BookingForm variant="full" />
        </div>
      </section>
    </div>
  )
}

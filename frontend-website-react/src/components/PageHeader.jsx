export default function PageHeader({ title, subtitle }) {
  return (
    <section className="page-hero">
      <div className="container-custom">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}

import Link from "next/link";
import { getFeaturedHousing, getStats } from "@/lib/data";
import { formatMoney, typeLabel } from "@/lib/format";

export default function HomePage() {
  const stats = getStats();
  const featured = getFeaturedHousing();

  return (
    <main>
      <section className="hero">
        <h1>Find Safe Student Housing Near Your University</h1>
        <p>
          SSHE is a national housing ecosystem connecting students, universities, hostels, and private
          landlords through a single verified workflow: verification, search, application, queue, residency,
          payments, and reviews.
        </p>
        <div className="cta-row">
          <Link href="/catalog" className="btn btn-primary">
            Search Housing
          </Link>
          <Link href="/dashboard/admin" className="btn btn-secondary">
            Register Housing
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">National Statistics</h2>
        <div className="grid grid-4">
          <article className="card">
            <div className="metric">{stats.universities}</div>
            <div className="muted">Universities</div>
          </article>
          <article className="card">
            <div className="metric">{stats.housingObjects}</div>
            <div className="muted">Housing Objects</div>
          </article>
          <article className="card">
            <div className="metric">{stats.availableBeds}</div>
            <div className="muted">Available Beds</div>
          </article>
          <article className="card">
            <div className="metric">{stats.registeredStudents}</div>
            <div className="muted">Registered Students</div>
          </article>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Interactive Housing Map</h2>
        <div className="map">
          <strong>Coverage layers</strong>
          <ul className="list">
            <li>Dormitories around university campuses</li>
            <li>Private apartments suitable for students</li>
            <li>Hostels with verified beds and queue support</li>
          </ul>
          <p className="muted">Map provider integration point: Yandex/Google/OpenStreetMap.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Featured Properties</h2>
        <div className="grid grid-3">
          {featured.map((item) => (
            <article className="card" key={item.id}>
              <img src={item.images[0]} alt={item.name} className="property-image" />
              <h3>{item.name}</h3>
              <p className="muted">
                {typeLabel(item.type)} · {item.city} · {item.distanceKm} km from university
              </p>
              <div className="kv">
                <span>Price</span>
                <strong>{formatMoney(item.monthlyPrice)}</strong>
              </div>
              <div className="kv">
                <span>Available beds</span>
                <strong>{item.availableBeds}</strong>
              </div>
              <div className="kv">
                <span>Rating</span>
                <strong>{item.rating}</strong>
              </div>
              {item.verified ? <span className="badge badge-verified">Verified by University</span> : null}
              <div style={{ marginTop: 12 }}>
                <Link href={`/housing/${item.id}`} className="btn btn-primary">
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid grid-2">
        <article className="card">
          <h3>Why students choose SSHE</h3>
          <ul className="list">
            <li>Strict gender-rule enforcement during applications and room assignment</li>
            <li>Transparent queue with priority score and automatic vacancy notifications</li>
            <li>OneID-ready student identity verification profile</li>
          </ul>
        </article>
        <article className="card">
          <h3>Why providers use SSHE</h3>
          <ul className="list">
            <li>Unified dashboards for dormitories, hostels, and private apartments</li>
            <li>Payment visibility with provider channel statistics</li>
            <li>Centralized analytics for occupancy and revenue</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

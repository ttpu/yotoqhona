import Link from "next/link";
import { notFound } from "next/navigation";
import { getHousingById } from "@/lib/data";
import { formatMoney, typeLabel } from "@/lib/format";

export default function HousingDetailsPage({ params }: { params: { id: string } }) {
  const housing = getHousingById(params.id);
  if (!housing) return notFound();

  return (
    <main>
      <Link href="/catalog">← Back to catalog</Link>
      <h1>{housing.name}</h1>
      <p className="muted">
        {typeLabel(housing.type)} · {housing.address} · {housing.distanceKm} km from {housing.university}
      </p>

      <section className="grid grid-2">
        <article className="card">
          <h2>Gallery</h2>
          <div className="grid grid-2">
            {housing.images.map((image) => (
              <img key={image} src={image} alt={housing.name} className="property-image" />
            ))}
          </div>
          <p className="muted">Video tour: {housing.videoUrl}</p>
        </article>

        <article className="card">
          <h2>Overview</h2>
          <p>{housing.description}</p>
          <div className="kv">
            <span>Price</span>
            <strong>{formatMoney(housing.monthlyPrice)}</strong>
          </div>
          <div className="kv">
            <span>Available beds</span>
            <strong>
              {housing.availableBeds}/{housing.totalBeds}
            </strong>
          </div>
          <div className="kv">
            <span>Rating</span>
            <strong>{housing.rating}</strong>
          </div>
          {housing.verified ? <span className="badge badge-verified">Verified by University</span> : null}
        </article>
      </section>

      <section className="section grid grid-2">
        <article className="card">
          <h2>Amenities</h2>
          <ul className="list">
            {housing.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>Rules</h2>
          <ul className="list">
            {housing.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section card">
        <h2>Room List</h2>
        <div className="grid grid-2">
          {housing.rooms.map((room) => (
            <article className="card" key={room.roomNumber}>
              <h3>Room {room.roomNumber}</h3>
              <div className="kv">
                <span>Capacity</span>
                <strong>{room.capacity}</strong>
              </div>
              <div className="kv">
                <span>Occupied beds</span>
                <strong>{room.occupiedBeds}</strong>
              </div>
              <div className="kv">
                <span>Free beds</span>
                <strong>{room.freeBeds}</strong>
              </div>
              <div className="kv">
                <span>Gender restriction</span>
                <strong>{room.genderRestriction ?? "Any"}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Student actions</h2>
        <p className="muted">Use API endpoints for submit application, waiting list, favorites, and issue report.</p>
        <div className="cta-row">
          <a href="/api/applications" className="btn btn-primary">
            Apply
          </a>
          <a href="/api/queue" className="btn btn-secondary">
            Join waiting list
          </a>
          <a href="/dashboard/student" className="btn btn-secondary">
            Add to favorites
          </a>
          <a href="/api/notifications" className="btn btn-secondary">
            Report issue
          </a>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getHousingById } from "@/lib/data";
import { formatMoney, typeLabel } from "@/lib/format";

export default function HousingDetailsPage({ params }: { params: { id: string } }) {
  const housing = getHousingById(params.id);
  if (!housing) return notFound();

  return (
    <main>
      <Link href="/catalog" className="back-link">← Katalogga qaytish</Link>
      <section className="detail-hero">
        <h1>{housing.name}</h1>
        <p className="muted">
          {typeLabel(housing.type)} · {housing.address} · {housing.university}dan {housing.distanceKm} km
        </p>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h2>Galereya</h2>
          <div className="grid grid-2">
            {housing.images.map((image) => (
              <img key={image} src={image} alt={housing.name} className="property-image" />
            ))}
          </div>
          <p className="muted">Video ko&#39;rinish: {housing.videoUrl}</p>
        </article>

        <article className="card">
          <h2>Umumiy ma&#39;lumot</h2>
          <p>{housing.description}</p>
          <div className="kv">
            <span>Narxi</span>
            <strong>{formatMoney(housing.monthlyPrice)}</strong>
          </div>
          <div className="kv">
            <span>Bo&#39;sh o&#39;rinlar</span>
            <strong>
              {housing.availableBeds}/{housing.totalBeds}
            </strong>
          </div>
          <div className="kv">
            <span>Reyting</span>
            <strong>{housing.rating}</strong>
          </div>
          {housing.verified ? <span className="badge badge-verified">Universitet tasdiqlagan</span> : null}
        </article>
      </section>

      <section className="section grid grid-2">
        <article className="card">
          <h2>Qulayliklar</h2>
          <ul className="list">
            {housing.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>Qoidalar</h2>
          <ul className="list">
            {housing.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section card">
        <h2>Xonalar ro&#39;yxati</h2>
        <div className="grid grid-2">
          {housing.rooms.map((room) => (
            <article className="card" key={room.roomNumber}>
              <h3>Xona {room.roomNumber}</h3>
              <div className="kv">
                <span>Sig&#39;imi</span>
                <strong>{room.capacity}</strong>
              </div>
              <div className="kv">
                <span>Band o&#39;rinlar</span>
                <strong>{room.occupiedBeds}</strong>
              </div>
              <div className="kv">
                <span>Bo&#39;sh o&#39;rinlar</span>
                <strong>{room.freeBeds}</strong>
              </div>
              <div className="kv">
                <span>Jins bo&#39;yicha cheklov</span>
                <strong>{room.genderRestriction ?? "Farqi yo&#39;q"}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Talaba amallari</h2>
        <p className="muted">Ariza yuborish, navbatga turish va murojaat qoldirish funksiyalari shu bo&#39;limdan boshlanadi.</p>
        <div className="cta-row">
          <a href="/api/applications" className="btn btn-primary">
            Ariza yuborish
          </a>
          <a href="/api/queue" className="btn btn-secondary">
            Navbatga qo&#39;shilish
          </a>
          <a href="/dashboard/student" className="btn btn-secondary">
            Sevimlilarga qo&#39;shish
          </a>
          <a href="/api/notifications" className="btn btn-secondary">
            Muammo haqida yozish
          </a>
        </div>
      </section>
    </main>
  );
}

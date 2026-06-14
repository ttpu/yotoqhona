import Link from "next/link";
import { getFeaturedHousing, getStats } from "@/lib/data";
import { formatMoney, typeLabel } from "@/lib/format";

export default function HomePage() {
  const stats = getStats();
  const featured = getFeaturedHousing();

  return (
    <main>
      <section className="hero">
        <div className="hero-kicker">TalabaJoy</div>
        <h1>Talabalar uchun ishonchli turar joy topishning eng qulay yo&#39;li</h1>
        <p>
          Yotoqxona, xostel va ijaradagi turar joylarni qidiring, taqqoslang, ariza yuboring va barcha
          jarayonlarni yagona platforma orqali boshqaring.
        </p>
        <div className="cta-row">
          <Link href="/catalog" className="btn btn-primary">
            Turar joy qidirish
          </Link>
          <Link href="/dashboard/admin" className="btn btn-secondary">
            Turar joy joylashtirish
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">TalabaJoy haqida</h2>
        <div className="card about-card">
          <p>
            TalabaJoy - bu talabalarni yotoqxona, xostel va ijaradagi turar joylar bilan bog&#39;lovchi yagona
            raqamli platforma. Platforma talabalarga mos turar joyni qidirish, taqqoslash, ariza yuborish,
            navbatni kuzatish hamda to&#39;lovlarni amalga oshirish imkonini beradi.
          </p>
          <p>
            Bugungi kunda ko&#39;plab talabalar turar joy topishda vaqt yo&#39;qotmoqda, ishonchsiz e&#39;lonlarga duch
            kelmoqda yoki bo&#39;sh o&#39;rinlar haqida o&#39;z vaqtida ma&#39;lumot ololmaydi. TalabaJoy ushbu muammolarni
            zamonaviy texnologiyalar yordamida hal qilish uchun yaratilgan.
          </p>
          <p>
            Platforma universitetlar, yotoqxonalar, xostellar va xususiy uy-joy egalari bilan hamkorlikda
            ishlaydi hamda talabalarga tasdiqlangan va ishonchli turar joylarni taklif etadi.
          </p>
          <p>
            Bizning maqsadimiz - har bir talabaga o&#39;z ehtiyojlariga mos, xavfsiz va qulay turar joyni topishni
            osonlashtirish.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Nima uchun TalabaJoy?</h2>
        <div className="card">
          <ul className="list checklist">
            <li>Tasdiqlangan va ishonchli turar joylar</li>
            <li>Universitetlar bilan integratsiya</li>
            <li>Real vaqt rejimida bo&#39;sh o&#39;rinlar</li>
            <li>Onlayn ariza va navbat tizimi</li>
            <li>Payme, Click va boshqa to&#39;lov tizimlari orqali to&#39;lov</li>
            <li>Talabalar va turar joy egalari uchun yagona boshqaruv tizimi</li>
            <li>Xarita orqali qulay qidiruv</li>
            <li>Xavfsiz va shaffof xizmat</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Talabalar uchun turar joy variantlari</h2>
        <p className="muted">Tanlangan kartalar: qulay o&#39;lchamda, muhim ma&#39;lumotlar bilan.</p>
        <div className="grid grid-3">
          {featured.map((item) => (
            <article className="card property-card" key={item.id}>
              <img src={item.images[0]} alt={item.name} className="property-image" />
              <h3>{item.name}</h3>
              <p className="muted">
                {typeLabel(item.type)} · {item.city} · {item.distanceKm} km
              </p>
              <div className="kv">
                <span>Narxi</span>
                <strong>{formatMoney(item.monthlyPrice)}</strong>
              </div>
              <div className="kv">
                <span>Bo&#39;sh o&#39;rinlar</span>
                <strong>{item.availableBeds}</strong>
              </div>
              <div className="kv">
                <span>Reyting</span>
                <strong>{item.rating}</strong>
              </div>
              {item.verified ? <span className="badge badge-verified">Universitet tasdiqlagan</span> : null}
              <div style={{ marginTop: 12 }}>
                <Link href={`/housing/${item.id}`} className="btn btn-primary">
                  Batafsil
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Toshkent xaritasi va joylashuvlar</h2>
        <div className="map-card">
          <div className="map-title">Google Maps orqali real xarita</div>
          <div className="map-embed-wrapper">
            <iframe
              title="Toshkent turar joy xaritasi"
              className="map-embed"
              src="https://www.google.com/maps?q=Tashkent%20student%20dormitory&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="muted">
            Xaritada TATU TTJ, O&#39;zMU hududi, xostel va ijaradagi kvartiralar joylashuvlarini ko&#39;rish mumkin.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Ishonchli hamkor universitetlar</h2>
        <div className="partners-grid">
          <article className="partner-card">
            <img src="/universities/tuit.svg" alt="TATU logotipi" className="partner-logo" />
          </article>
          <article className="partner-card">
            <img src="/universities/wiut.svg" alt="WIUT logotipi" className="partner-logo" />
          </article>
          <article className="partner-card">
            <img src="/universities/samsu.svg" alt="SamDU logotipi" className="partner-logo" />
          </article>
          <article className="partner-card">
            <img src="/universities/nuu.svg" alt="O&#39;zMU logotipi" className="partner-logo" />
          </article>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Platforma statistikasi</h2>
        <div className="grid grid-4">
          <article className="card">
            <div className="metric">{stats.universities}</div>
            <div className="muted">Universitetlar</div>
          </article>
          <article className="card">
            <div className="metric">{stats.housingObjects}</div>
            <div className="muted">Uy-joy obyektlari</div>
          </article>
          <article className="card">
            <div className="metric">{stats.availableBeds}</div>
            <div className="muted">Bo&#39;sh o&#39;rinlar</div>
          </article>
          <article className="card">
            <div className="metric">{stats.registeredStudents}</div>
            <div className="muted">Ro&#39;yxatdan o&#39;tgan talabalar</div>
          </article>
        </div>
      </section>
    </main>
  );
}

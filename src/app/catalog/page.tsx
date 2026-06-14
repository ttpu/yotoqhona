import Link from "next/link";
import { getHousing } from "@/lib/data";
import { formatMoney, typeLabel } from "@/lib/format";

type SearchParams = {
  city?: string;
  type?: string;
  gender?: string;
  university?: string;
  minPrice?: string;
  maxPrice?: string;
  verified?: string;
};

export default function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const items = getHousing({
    city: searchParams.city,
    type: searchParams.type,
    gender: searchParams.gender,
    university: searchParams.university,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    verified: searchParams.verified ? searchParams.verified === "true" : undefined
  });

  return (
    <main>
      <section className="page-heading">
        <h1>Turar joy katalogi</h1>
        <p className="muted">Shahar, uy-joy turi, narx oralig&#39;i va tasdiqlangan status bo&#39;yicha mos variantlarni toping.</p>
      </section>

      <form className="card filter-panel grid grid-4" action="/catalog" method="GET" style={{ marginBottom: 16 }}>
        <div>
          <label htmlFor="city">Shahar</label>
          <input id="city" name="city" placeholder="Toshkent" defaultValue={searchParams.city} />
        </div>
        <div>
          <label htmlFor="type">Uy-joy turi</label>
          <select id="type" name="type" defaultValue={searchParams.type ?? ""}>
            <option value="">Barchasi</option>
            <option value="DORMITORY">Yotoqxona</option>
            <option value="HOSTEL">Xostel</option>
            <option value="APARTMENT">Kvartira</option>
          </select>
        </div>
        <div>
          <label htmlFor="gender">Jins</label>
          <select id="gender" name="gender" defaultValue={searchParams.gender ?? ""}>
            <option value="">Farqi yo&#39;q</option>
            <option value="MALE">Erkak</option>
            <option value="FEMALE">Ayol</option>
          </select>
        </div>
        <div>
          <label htmlFor="university">Universitet</label>
          <input id="university" name="university" placeholder="TUIT" defaultValue={searchParams.university} />
        </div>
        <div>
          <label htmlFor="minPrice">Minimal narx</label>
          <input id="minPrice" name="minPrice" type="number" defaultValue={searchParams.minPrice} />
        </div>
        <div>
          <label htmlFor="maxPrice">Maksimal narx</label>
          <input id="maxPrice" name="maxPrice" type="number" defaultValue={searchParams.maxPrice} />
        </div>
        <div>
          <label htmlFor="verified">Tasdiqlangan</label>
          <select id="verified" name="verified" defaultValue={searchParams.verified ?? ""}>
            <option value="">Barchasi</option>
            <option value="true">Faqat tasdiqlangan</option>
            <option value="false">Tasdiqlanmagan</option>
          </select>
        </div>
        <div style={{ alignSelf: "end" }}>
          <button className="btn btn-primary" type="submit">
            Filtrlarni qo&#39;llash
          </button>
        </div>
      </form>

      <section className="grid grid-3">
        {items.map((item) => {
          const availability =
            item.availableBeds > 0 ? "Bo&#39;sh joy bor" : item.type === "HOSTEL" ? "Navbat mavjud" : "To&#39;lgan";

          return (
            <article key={item.id} className="card property-card">
              <img src={item.images[0]} alt={item.name} className="property-image" />
              <h3>{item.name}</h3>
              <p className="muted">
                {typeLabel(item.type)} · {item.city} · {item.distanceKm} km
              </p>
              <div className="kv">
                <span>Oylik narx</span>
                <strong>{formatMoney(item.monthlyPrice)}</strong>
              </div>
              <div className="kv">
                <span>Bo&#39;sh o&#39;rinlar</span>
                <strong>{item.availableBeds}</strong>
              </div>
              <div className="kv">
                <span>Holati</span>
                <strong>{availability}</strong>
              </div>
              <div className="kv">
                <span>Reyting</span>
                <strong>{item.rating}</strong>
              </div>
              <p>
                {item.verified ? (
                  <span className="badge badge-verified">Tasdiqlangan</span>
                ) : (
                  <span className="badge badge-warning">Tekshiruvda</span>
                )}
              </p>
              <Link href={`/housing/${item.id}`} className="btn btn-primary">
                Batafsil ko&#39;rish
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}

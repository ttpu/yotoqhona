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
      <h1>Housing Catalog</h1>
      <p className="muted">Filter by location, housing type, gender policy, price range, and verified status.</p>

      <form className="card grid grid-4" action="/catalog" method="GET" style={{ marginBottom: 16 }}>
        <div>
          <label htmlFor="city">City</label>
          <input id="city" name="city" placeholder="Tashkent" defaultValue={searchParams.city} />
        </div>
        <div>
          <label htmlFor="type">Housing Type</label>
          <select id="type" name="type" defaultValue={searchParams.type ?? ""}>
            <option value="">All</option>
            <option value="DORMITORY">Dormitory</option>
            <option value="HOSTEL">Hostel</option>
            <option value="APARTMENT">Apartment</option>
          </select>
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" defaultValue={searchParams.gender ?? ""}>
            <option value="">Any</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="university">University</label>
          <input id="university" name="university" placeholder="TUIT" defaultValue={searchParams.university} />
        </div>
        <div>
          <label htmlFor="minPrice">Min Price</label>
          <input id="minPrice" name="minPrice" type="number" defaultValue={searchParams.minPrice} />
        </div>
        <div>
          <label htmlFor="maxPrice">Max Price</label>
          <input id="maxPrice" name="maxPrice" type="number" defaultValue={searchParams.maxPrice} />
        </div>
        <div>
          <label htmlFor="verified">Verified</label>
          <select id="verified" name="verified" defaultValue={searchParams.verified ?? ""}>
            <option value="">Any</option>
            <option value="true">Verified only</option>
            <option value="false">Non-verified</option>
          </select>
        </div>
        <div style={{ alignSelf: "end" }}>
          <button className="btn btn-primary" type="submit">
            Apply filters
          </button>
        </div>
      </form>

      <section className="grid grid-3">
        {items.map((item) => {
          const availability =
            item.availableBeds > 0 ? "Available" : item.type === "HOSTEL" ? "Queue Available" : "Full";

          return (
            <article key={item.id} className="card">
              <img src={item.images[0]} alt={item.name} className="property-image" />
              <h3>{item.name}</h3>
              <p className="muted">
                {typeLabel(item.type)} · {item.city} · {item.distanceKm} km
              </p>
              <div className="kv">
                <span>Monthly price</span>
                <strong>{formatMoney(item.monthlyPrice)}</strong>
              </div>
              <div className="kv">
                <span>Available beds</span>
                <strong>{item.availableBeds}</strong>
              </div>
              <div className="kv">
                <span>Status</span>
                <strong>{availability}</strong>
              </div>
              <div className="kv">
                <span>Rating</span>
                <strong>{item.rating}</strong>
              </div>
              <p>
                {item.verified ? (
                  <span className="badge badge-verified">Verified</span>
                ) : (
                  <span className="badge badge-warning">Pending verification</span>
                )}
              </p>
              <Link href={`/housing/${item.id}`} className="btn btn-primary">
                Housing details
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}

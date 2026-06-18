import { cookies } from 'next/headers';
import { SearchX } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getFavoriteIds, listListings, ListingSort } from '@/lib/listings-store';
import { AMENITY_LABELS, LISTING_TYPE_LABELS } from '@/lib/listing-labels';
import ListingCard from '@/components/listing-card';
import type { ListingAmenity, ListingType } from '@/lib/listing-types';
import styles from './catalog.module.css';

type SearchParams = {
  search?: string;
  type?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  minRooms?: string;
  amenities?: string | string[];
  sort?: string;
  page?: string;
};

const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: 'newest', label: 'Avval yangi' },
  { value: 'price_asc', label: 'Avval arzon' },
  { value: 'price_desc', label: 'Avval qimmat' },
  { value: 'rating', label: 'Reyting bo\'yicha' }
];

const TYPE_OPTIONS = Object.keys(LISTING_TYPE_LABELS) as ListingType[];
const AMENITY_OPTIONS = Object.keys(AMENITY_LABELS).filter((k) => k !== 'OTHER') as ListingAmenity[];

function buildQuery(params: Record<string, string | string[] | undefined>, overrides: Record<string, string | number>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
    else sp.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    sp.set(key, String(value));
  }
  return `/catalog?${sp.toString()}`;
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  const amenities = (Array.isArray(searchParams.amenities)
    ? searchParams.amenities
    : searchParams.amenities
      ? [searchParams.amenities]
      : []) as ListingAmenity[];

  const page = searchParams.page ? Number(searchParams.page) : 1;
  const sort = (searchParams.sort as ListingSort) || 'newest';

  const result = await listListings({
    filters: {
      search: searchParams.search,
      type: (searchParams.type as ListingType) || undefined,
      city: searchParams.city,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      minRooms: searchParams.minRooms ? Number(searchParams.minRooms) : undefined,
      amenities: amenities.length ? amenities : undefined,
      status: 'ACTIVE'
    },
    sort,
    page,
    pageSize: 9
  });

  const favoriteIds = sessionUser ? await getFavoriteIds(sessionUser.id) : [];
  const items = result.items.map((item) => ({ ...item, isFavorited: favoriteIds.includes(item.id) }));

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Turar joy katalogi</h1>
        <p className={styles.subtitle}>Talabalar uchun tasdiqlangan yotoqxona, xostel va kvartiralarni qidiring.</p>
      </div>

      <form id="catalog-filters" className={styles.filterCard} action="/catalog" method="GET">
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            name="search"
            placeholder="Nomi yoki manzil bo'yicha qidirish..."
            defaultValue={searchParams.search}
          />
        </div>

        <div className={styles.filterGrid}>
          <select className={styles.select} name="type" defaultValue={searchParams.type ?? ''}>
            <option value="">Barcha turlar</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {LISTING_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <input className={styles.numInput} type="text" name="city" placeholder="Shahar" defaultValue={searchParams.city} />
          <input
            className={styles.numInput}
            type="number"
            name="minPrice"
            placeholder="Min narx"
            defaultValue={searchParams.minPrice}
          />
          <input
            className={styles.numInput}
            type="number"
            name="maxPrice"
            placeholder="Max narx"
            defaultValue={searchParams.maxPrice}
          />
          <select className={styles.select} name="minRooms" defaultValue={searchParams.minRooms ?? ''}>
            <option value="">Xonalar soni</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+ xona
              </option>
            ))}
          </select>
        </div>

        <div className={styles.amenityRow}>
          {AMENITY_OPTIONS.map((a) => {
            const AmenityIcon = AMENITY_LABELS[a].icon;
            return (
              <label key={a} className={styles.amenityChip}>
                <input
                  type="checkbox"
                  name="amenities"
                  value={a}
                  defaultChecked={amenities.includes(a)}
                />
                <AmenityIcon size={14} /> {AMENITY_LABELS[a].label}
              </label>
            );
          })}
        </div>

        <div className={styles.filterBtnRow}>
          <a href="/catalog" className={styles.btnReset}>
            Tozalash
          </a>
          <button type="submit" className={styles.btnApply}>
            Filtrlarni qo&#39;llash
          </button>
        </div>
      </form>

      <div className={styles.resultBar}>
        <p className={styles.resultCount}>
          <strong>{result.total}</strong> ta e&#39;lon topildi
        </p>
        <div className={styles.sortRow}>
          <select className={styles.sortSelect} name="sort" form="catalog-filters" defaultValue={sort}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" form="catalog-filters" className={styles.btnSort}>
            Saralash
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><SearchX size={36} /></div>
          <p>Hech qanday e&#39;lon topilmadi. Filtrlarni o&#39;zgartirib ko&#39;ring.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} loggedIn={Boolean(sessionUser)} />
          ))}
        </div>
      )}

      {result.totalPages > 1 && (
        <div className={styles.pagination}>
          <a
            href={buildQuery(searchParams, { page: Math.max(1, result.page - 1) })}
            className={`${styles.pageLink} ${result.page === 1 ? styles.pageLinkDisabled : ''}`}
          >
            ←
          </a>
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={buildQuery(searchParams, { page: p })}
              className={`${styles.pageLink} ${p === result.page ? styles.pageLinkActive : ''}`}
            >
              {p}
            </a>
          ))}
          <a
            href={buildQuery(searchParams, { page: Math.min(result.totalPages, result.page + 1) })}
            className={`${styles.pageLink} ${result.page === result.totalPages ? styles.pageLinkDisabled : ''}`}
          >
            →
          </a>
        </div>
      )}
    </div>
  );
}

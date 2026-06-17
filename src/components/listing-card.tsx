import Link from 'next/link';
import type { Route } from 'next';
import { LISTING_TYPE_LABELS, formatListingPrice } from '@/lib/listing-labels';
import type { ListingStatus, ListingWithStats } from '@/lib/listing-types';
import FavoriteButton from '@/components/favorite-button';
import styles from '@/app/catalog/catalog.module.css';

const STATUS_CLASS: Record<ListingStatus, string> = {
  ACTIVE: 'statusActive',
  BOOKED: 'statusBooked',
  UNAVAILABLE: 'statusUnavailable'
};

const STATUS_TEXT: Record<ListingStatus, string> = {
  ACTIVE: 'Faol',
  BOOKED: 'Band',
  UNAVAILABLE: 'Mavjud emas'
};

type ListingCardProps = {
  listing: ListingWithStats;
  loggedIn: boolean;
};

export default function ListingCard({ listing, loggedIn }: ListingCardProps) {
  return (
    <div className={styles.card}>
      <Link
        href={`/housing/${listing.id}` as Route}
        className={styles.cardLinkOverlay}
        aria-label={listing.title}
      />
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.images[0]} alt={listing.title} />
        <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[listing.status]]}`}>
          {STATUS_TEXT[listing.status]}
        </span>
        <FavoriteButton listingId={listing.id} initialFavorited={Boolean(listing.isFavorited)} loggedIn={loggedIn} />
      </div>

      <div className={styles.body}>
        <p className={styles.cardTitle}>{listing.title}</p>
        <p className={styles.cardExcerpt}>{listing.description}</p>
        <p className={styles.cardAddress}>
          {LISTING_TYPE_LABELS[listing.type]} · {listing.address}
        </p>
        <div className={styles.statsRow}>
          <span>⭐ {listing.rating || '—'}</span>
          <span>👁 {listing.viewCount}</span>
          <span>🛏 {listing.roomsCount} xona</span>
        </div>
        <div className={styles.cardFooter}>
          <p className={styles.cardPrice}>
            {formatListingPrice(listing.price, listing.currency)} <span>/ oy</span>
          </p>
          <span className={styles.btnDetail}>Batafsil</span>
        </div>
      </div>
    </div>
  );
}

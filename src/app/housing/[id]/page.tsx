import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { BadgeCheck, Check, Eye, Mail, Phone, SquarePen, Send, Star } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import {
  getListingWithStats,
  getReviewsForListing,
  isFavorited
} from '@/lib/listings-store';
import {
  AMENITY_LABELS,
  LISTING_TYPE_LABELS,
  REQUIREMENT_LABELS,
  formatListingPrice
} from '@/lib/listing-labels';
import type { ListingStatus } from '@/lib/listing-types';
import Gallery from './gallery';
import ViewTracker from './view-tracker';
import DetailFavoriteButton from './detail-favorite-button';
import AddReviewForm from './add-review-form';
import MapView from '@/components/map-view-loader';
import styles from './housing-detail.module.css';

const STATUS_CLASS: Record<ListingStatus, string> = {
  ACTIVE: 'statusActive',
  BOOKED: 'statusBooked',
  UNAVAILABLE: 'statusUnavailable'
};

const STATUS_TEXT: Record<ListingStatus, string> = {
  ACTIVE: 'Faol',
  BOOKED: 'Band qilingan',
  UNAVAILABLE: 'Mavjud emas'
};

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} fill={i < rounded ? '#f5c518' : 'none'} color="#f5c518" />
      ))}
    </span>
  );
}

export default async function HousingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListingWithStats(params.id);
  if (!listing) return notFound();

  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  const [reviews, favorited] = await Promise.all([
    getReviewsForListing(params.id),
    sessionUser ? isFavorited(sessionUser.id, params.id) : Promise.resolve(false)
  ]);

  const canManage =
    Boolean(sessionUser) &&
    (sessionUser!.role === 'UNIVERSITY_PROVIDER' || sessionUser!.id === listing.ownerId);

  const telegramHandle = listing.contactTelegram?.replace(/^@/, '');

  return (
    <div className={styles.wrap}>
      <ViewTracker listingId={listing.id} />

      <Link href={'/catalog' as Route} className={styles.backLink}>
        ← Katalogga qaytish
      </Link>

      <div className={styles.headRow}>
        <div className={styles.titleBlock}>
          <h1>{listing.title}</h1>
          <div className={styles.metaLine}>
            <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[listing.status]]}`}>
              {STATUS_TEXT[listing.status]}
            </span>
            {listing.verified && (
              <span className={styles.verifiedBadge}>
                <BadgeCheck size={13} /> Rasmiy
              </span>
            )}
            <span>{LISTING_TYPE_LABELS[listing.type]}</span>
            <span>·</span>
            <span>{listing.address}, {listing.city}</span>
          </div>
        </div>
        {canManage && (
          <div className={styles.headActions}>
            <Link href={`/dashboard/listings/${listing.id}/edit` as Route} className={styles.btnEdit}>
              <SquarePen size={15} /> Tahrirlash
            </Link>
          </div>
        )}
      </div>

      <Gallery images={listing.images} title={listing.title} />

      <div className={styles.layout}>
        <div>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Tafsilot</p>
            <p className={styles.description}>{listing.description}</p>

            <div className={styles.factsGrid}>
              <div className={styles.factItem}>
                <div className={styles.factValue}>{listing.roomsCount}</div>
                <div className={styles.factLabel}>Xonalar soni</div>
              </div>
              <div className={styles.factItem}>
                <div className={styles.factValue}>{listing.capacity}</div>
                <div className={styles.factLabel}>Yashash o&#39;rinlari</div>
              </div>
              <div className={styles.factItem}>
                <div className={styles.factValue}>{listing.viewCount}</div>
                <div className={styles.factLabel}>Ko&#39;rishlar soni</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Qulayliklar</p>
            <div className={styles.chipRow}>
              {listing.amenities.map((a) => {
                const AmenityIcon = AMENITY_LABELS[a].icon;
                return (
                  <span key={a} className={styles.chip}>
                    <AmenityIcon size={14} /> {AMENITY_LABELS[a].label}
                  </span>
                );
              })}
              {listing.customAmenity && <span className={styles.chip}><Check size={14} /> {listing.customAmenity}</span>}
              {listing.amenities.length === 0 && !listing.customAmenity && (
                <span className={styles.emptyReviews}>Qulayliklar ko&#39;rsatilmagan</span>
              )}
            </div>
          </div>

          {(listing.requirements.length > 0 || listing.customRequirement) && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Talablar</p>
              <div className={styles.chipRow}>
                {listing.requirements.map((r) => (
                  <span key={r} className={`${styles.chip} ${styles.chipNeutral}`}>
                    {REQUIREMENT_LABELS[r]}
                  </span>
                ))}
                {listing.customRequirement && (
                  <span className={`${styles.chip} ${styles.chipNeutral}`}>{listing.customRequirement}</span>
                )}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Joylashuv</p>
            <MapView lat={listing.lat} lng={listing.lng} label={listing.title} />
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Sharhlar va baholar</p>
            <div className={styles.ratingSummary}>
              <span className={styles.ratingValue}>{listing.rating || '—'}</span>
              <div>
                <div className={styles.ratingStars}>
                  <Stars value={listing.rating} />
                </div>
                <div className={styles.ratingCount}>{listing.reviewCount} ta sharh</div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className={styles.emptyReviews}>Hozircha sharhlar yo&#39;q. Birinchi bo&#39;lib fikr bildiring!</p>
            ) : (
              <div style={{ marginBottom: 18 }}>
                {reviews.map((review) => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHead}>
                      <span className={styles.reviewName}>{review.userName}</span>
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <div className={styles.reviewStars}>
                      <Stars value={review.score} />
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <AddReviewForm listingId={listing.id} loggedIn={Boolean(sessionUser)} />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.priceCard}>
            <p className={styles.priceValue}>
              {formatListingPrice(listing.price, listing.currency)} <span className={styles.priceUnit}>/ oy</span>
            </p>
            <div className={styles.statRow}>
              <span><Star size={14} fill="#f5c518" color="#f5c518" /> {listing.rating || '—'}</span>
              <span><Eye size={14} /> {listing.viewCount} ko&#39;rishlar</span>
            </div>

            <div className={styles.contactList}>
              <a href={`tel:${listing.contactPhone}`} className={styles.contactBtn}>
                <Phone size={15} /> {listing.contactPhone}
              </a>
              {telegramHandle && (
                <a
                  href={`https://t.me/${telegramHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.contactBtn} ${styles.contactBtnOutline}`}
                >
                  <Send size={15} /> Telegram
                </a>
              )}
              {listing.contactEmail && (
                <a href={`mailto:${listing.contactEmail}`} className={`${styles.contactBtn} ${styles.contactBtnOutline}`}>
                  <Mail size={15} /> Email
                </a>
              )}
            </div>

            <div className={styles.favoriteRow}>
              <DetailFavoriteButton listingId={listing.id} initialFavorited={favorited} loggedIn={Boolean(sessionUser)} />
            </div>
          </div>

          <div className={styles.ownerCard}>
            <strong>{listing.ownerName}</strong>
            E&#39;lon egasi · {listing.ownerRole === 'UNIVERSITY_PROVIDER' ? 'Universitet' : 'Xususiy egasi'}
          </div>
        </div>
      </div>
    </div>
  );
}

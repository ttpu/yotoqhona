'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { LISTING_TYPE_LABELS, STATUS_LABELS, formatListingPrice } from '@/lib/listing-labels';
import type { ListingStatus, ListingWithStats } from '@/lib/listing-types';
import styles from './manage-card.module.css';

const STATUS_CLASS: Record<ListingStatus, string> = {
  ACTIVE: 'statusActive',
  BOOKED: 'statusBooked',
  UNAVAILABLE: 'statusUnavailable'
};

type ManageCardProps = {
  listing: ListingWithStats;
  showOwner?: boolean;
};

export default function ManageCard({ listing, showOwner }: ManageCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ListingStatus>(listing.status);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onStatusChange(next: ListingStatus) {
    setStatus(next);
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set('status', next);
      await fetch(`/api/listings/${listing.id}`, { method: 'PATCH', body: formData });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmDelete() {
    setBusy(true);
    try {
      await fetch(`/api/listings/${listing.id}`, { method: 'DELETE' });
      setConfirmOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.images[0]} alt={listing.title} />
        <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[listing.status]]}`}>
          {STATUS_LABELS[listing.status].label}
        </span>
        {showOwner && <span className={styles.ownerBadge}>{listing.ownerName}</span>}
      </div>

      <div className={styles.body}>
        <p className={styles.title}>{listing.title}</p>
        <p className={styles.address}>
          {LISTING_TYPE_LABELS[listing.type]} · {listing.address}
        </p>
        <div className={styles.metaRow}>
          <span>⭐ {listing.rating || '—'}</span>
          <span>👁 {listing.viewCount}</span>
          <span>💬 {listing.reviewCount}</span>
        </div>
        <p className={styles.price}>{formatListingPrice(listing.price, listing.currency)} / oy</p>

        <select
          className={styles.statusSelect}
          value={status}
          disabled={busy}
          onChange={(e) => onStatusChange(e.target.value as ListingStatus)}
        >
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <div className={styles.actions}>
          <Link href={`/housing/${listing.id}` as Route} className={styles.btnView}>
            Ko&#39;rish
          </Link>
          <Link href={`/dashboard/listings/${listing.id}/edit` as Route} className={styles.btnEdit}>
            Tahrirlash
          </Link>
          <button type="button" className={styles.btnDelete} onClick={() => setConfirmOpen(true)}>
            O&#39;chirish
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className={styles.modalOverlay} onClick={() => setConfirmOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3 className={styles.modalTitle}>E&#39;lonni o&#39;chirmoqchimisiz?</h3>
            <p className={styles.modalText}>
              &#34;{listing.title}&#34; butunlay o&#39;chiriladi. Bu amalni qaytarib bo&#39;lmaydi.
            </p>
            <div className={styles.modalBtns}>
              <button type="button" className={styles.modalBtnCancel} onClick={() => setConfirmOpen(false)}>
                Bekor qilish
              </button>
              <button type="button" className={styles.modalBtnConfirm} onClick={onConfirmDelete} disabled={busy}>
                {busy ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

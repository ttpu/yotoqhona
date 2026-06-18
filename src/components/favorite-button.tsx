'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import styles from '@/app/catalog/catalog.module.css';

type FavoriteButtonProps = {
  listingId: string;
  initialFavorited: boolean;
  loggedIn: boolean;
};

export default function FavoriteButton({ listingId, initialFavorited, loggedIn }: FavoriteButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      router.push('/auth/login');
      return;
    }

    setBusy(true);
    setFavorited((prev) => !prev);
    try {
      const res = await fetch(`/api/listings/${listingId}/favorite`, { method: 'POST' });
      const data = await res.json();
      if (typeof data.favorited === 'boolean') setFavorited(data.favorited);
      router.refresh();
    } catch {
      setFavorited((prev) => !prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.favoriteBtn}
      onClick={onClick}
      disabled={busy}
      aria-label={favorited ? "Sevimlilardan o'chirish" : 'Sevimlilarga qo\'shish'}
    >
      <Heart size={15} fill={favorited ? '#e74c3c' : 'none'} color={favorited ? '#e74c3c' : '#999'} />
    </button>
  );
}

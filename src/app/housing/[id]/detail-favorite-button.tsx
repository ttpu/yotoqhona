'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './housing-detail.module.css';

export default function DetailFavoriteButton({
  listingId,
  initialFavorited,
  loggedIn
}: {
  listingId: string;
  initialFavorited: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!loggedIn) {
      router.push('/auth/login');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/favorite`, { method: 'POST' });
      const data = await res.json();
      if (typeof data.favorited === 'boolean') setFavorited(data.favorited);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className={styles.btnFavorite} onClick={onClick} disabled={busy}>
      {favorited ? '❤️ Sevimlilarda' : "🤍 Sevimlilarga qo'shish"}
    </button>
  );
}

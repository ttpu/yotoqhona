'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './housing-detail.module.css';

export default function AddReviewForm({ listingId, loggedIn }: { listingId: string; loggedIn: boolean }) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!loggedIn) {
    return (
      <p className={styles.loginPrompt}>
        Sharh qoldirish uchun <Link href="/auth/login">tizimga kiring</Link>.
      </p>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (score === 0) {
      setError("Iltimos, baho tanlang");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, comment })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Xatolik yuz berdi');
        return;
      }
      setComment('');
      setScore(0);
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <p className={styles.loginPrompt} style={{ color: '#e74c3c', marginBottom: 10 }}>{error}</p>}
      <div className={styles.reviewFormStars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.starBtn} ${n <= (hoverScore || score) ? styles.starBtnActive : ''}`}
            onMouseEnter={() => setHoverScore(n)}
            onMouseLeave={() => setHoverScore(0)}
            onClick={() => setScore(n)}
            aria-label={`${n} yulduz`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className={styles.reviewTextarea}
        placeholder="Fikringizni yozing..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={3}
      />
      <button type="submit" className={styles.btnSubmitReview} disabled={loading}>
        {loading ? 'Yuborilmoqda...' : 'Sharh qoldirish'}
      </button>
    </form>
  );
}

import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { parseSessionCookie } from '@/lib/session';
import { listListings } from '@/lib/listings-store';
import ManageCard from './manage-card';
import styles from './listings.module.css';

export default async function MyListingsPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);

  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role === 'STUDENT') redirect('/');

  const isUniversityAdmin = sessionUser.role === 'UNIVERSITY_PROVIDER';
  const { items } = await listListings({
    filters: isUniversityAdmin ? undefined : { ownerId: sessionUser.id },
    sort: 'newest',
    pageSize: 100
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{isUniversityAdmin ? "Barcha e'lonlar" : "Mening e'lonlarim"}</h1>
          <p className={styles.subtitle}>
            {isUniversityAdmin
              ? "Platformadagi barcha e'lonlarni boshqarish va moderatsiya qilish"
              : "E'lonlaringizni boshqaring, holatini o'zgartiring yoki tahrirlang"}
          </p>
        </div>
        <Link href={'/dashboard/listings/new' as Route} className={styles.btnNew}>
          + Yangi e&#39;lon
        </Link>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏠</div>
          <p>Hozircha e&#39;lonlar yo&#39;q. Birinchi e&#39;loningizni qo&#39;shing!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((listing) => (
            <ManageCard key={listing.id} listing={listing} showOwner={isUniversityAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}

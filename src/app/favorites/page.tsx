import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getFavoriteListings } from '@/lib/listings-store';
import ListingCard from '@/components/listing-card';
import catalogStyles from '@/app/catalog/catalog.module.css';
import styles from './favorites.module.css';

export default async function FavoritesPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');

  const listings = await getFavoriteListings(sessionUser.id);
  const items = listings.map((item) => ({ ...item, isFavorited: true }));

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Saqlangan joylar</h1>
        <p className={styles.subtitle}>Siz sevimlilarga qo&#39;shgan turar joylar ro&#39;yxati.</p>
      </div>

      {items.length === 0 ? (
        <div className={catalogStyles.empty}>
          <div className={catalogStyles.emptyIcon}><Heart size={36} /></div>
          <p>Hozircha sevimlilar bo&#39;sh. Katalogdan yoqtirgan joylaringizni belgilang.</p>
        </div>
      ) : (
        <div className={catalogStyles.grid}>
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} loggedIn />
          ))}
        </div>
      )}
    </div>
  );
}

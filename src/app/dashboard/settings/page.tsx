import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseSessionCookie } from '@/lib/session';
import SettingsForm from './settings-form';
import styles from './settings.module.css';

export default function SettingsPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Sozlamalar</h1>
        <p className={styles.subtitle}>Profil ma&#39;lumotlari, parol va til sozlamalarini boshqaring.</p>
      </div>
      <SettingsForm user={sessionUser} />
    </div>
  );
}

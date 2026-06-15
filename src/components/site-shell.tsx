'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import styles from '@/components/site-shell.module.css';

type SiteShellProps = {
  children: React.ReactNode;
  userName: string | null;
};

export function SiteShell({ children, userName }: SiteShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <div className={styles.page}>
      <SiteHeader userName={userName} />
      <main className={styles.main}>{children}</main>
      {!isAuthPage && (
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <p className={styles.footerTitle}>TalabaJoy</p>
              <p className={styles.footerText}>
                Talabalar uchun yotoqxona va turar joylarni topish, ariza berish va kuzatish platformasi.
              </p>
              <p className={styles.footerCopy}>© {new Date().getFullYear()} TalabaJoy. Barcha huquqlar himoyalangan.</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/">Bosh sahifa</Link>
              <Link href="/catalog">Katalog</Link>
              <Link href="/dashboard">Boshqaruv paneli</Link>
              <Link href="/dashboard/student">Talaba bo&#39;limi</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
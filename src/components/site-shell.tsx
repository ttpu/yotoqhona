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
  const isHome = pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.topPanel}>
          <SiteHeader userName={userName} />
        </div>
        <div className={styles.contentPanel}>
          <main className={styles.main}>{children}</main>
          {!isHome && (
            <footer className={styles.footer}>
              <p>© {new Date().getFullYear()} TalabaJoy. Barcha huquqlar himoyalangan.</p>
              <div className={styles.footerLinks}>
                <Link href="/">Bosh sahifa</Link>
                <Link href="/catalog">Katalog</Link>
                <Link href="/dashboard">Panel</Link>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

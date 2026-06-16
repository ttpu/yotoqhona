'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/site-header.module.css';

type SiteHeaderProps = {
  userName: string | null;
};

const notifications = [
  "Arizangiz bo'yicha yangi yangilanish mavjud",
  'Navbat holati yangilandi',
  "To'lov muddati bo'yicha eslatma",
  "Yangi bo'sh o'rinlar qo'shildi",
];

const navItems = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/catalog', label: 'Katalog' },
  { href: '/dashboard', label: 'Universitetlar' },
  { href: '/', label: 'Yordam' },
];

export function SiteHeader({ userName }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!userName) return 'TJ';
    return userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }, [userName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
        setIsMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(t)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setIsProfileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    setIsNotifOpen(false);
    setIsProfileOpen(false);
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>TJ</div>
          TalabaJoy
        </Link>

        {/* Search */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Shahar, universitet yoki turar joy qidiring..."
            />
          </div>
          <button className={styles.searchBtn}>Qidirish</button>
        </div>

        {/* Desktop nav */}
        <nav className={styles.desktopNav} aria-label="Asosiy navigatsiya">
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: guest OR logged-in */}
        <div className={styles.right}>
          {!userName ? (
            <>
              <Link href="/auth/login" className={styles.btnLogin}>Kirish</Link>
              <Link href="/auth/register" className={styles.btnRegister}>Ro&#39;yxatdan o&#39;tish</Link>
            </>
          ) : (
            <>
              {/* Bell */}
              <div className={styles.bellWrap} ref={notifRef}>
                <button
                  type="button"
                  className={styles.bellWrap}
                  onClick={() => setIsNotifOpen((v) => !v)}
                  aria-label="Bildirishnomalar"
                >
                  <svg className={styles.bellIcon} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className={styles.bellBadge}>1</span>
                </button>
                {isNotifOpen && (
                  <div className={styles.notifDropdown}>
                    <p className={styles.notifTitle}>Bildirishnomalar</p>
                    <ul className={styles.notifList}>
                      {notifications.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className={styles.userWrap} ref={profileRef}>
                <button
                  type="button"
                  className={styles.userBtn}
                  onClick={() => setIsProfileOpen((v) => !v)}
                  aria-label="Profil menyusi"
                >
                  <div className={styles.avatar}>{initials}</div>
                  <span className={styles.username}>
                    {userName.split(' ')[0]}
                    {userName.split(' ')[1] ? `\n${userName.split(' ')[1]}` : ''}
                  </span>
                  <span className={styles.caret}>▾</span>
                </button>
                {isProfileOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/dashboard" className={styles.dropItem}>👤 &nbsp;Mening profilim</Link>
                    <Link href="/dashboard/student" className={styles.dropItem}>🏠 &nbsp;Mening arizalarim</Link>
                    <Link href="/dashboard/student" className={styles.dropItem}>❤️ &nbsp;Saralangan joylar</Link>
                    <Link href="/dashboard" className={styles.dropItem}>⚙️ &nbsp;Sozlamalar</Link>
                    <hr className={styles.dropDivider} />
                    <form action="/api/auth/logout" method="POST">
                      <button type="submit" className={`${styles.dropItem} ${styles.dropLogout}`}>
                        🚪 &nbsp;Chiqish
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Hamburger */}
          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Menyu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`${styles.mobilePanel} ${isMobileOpen ? styles.mobilePanelOpen : ''}`}>
        <div className={styles.mobileSearch}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#999" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Qidiruv..." />
        </div>
        {navItems.map((item) => (
          <Link key={`m-${item.label}`} href={item.href} className={styles.mobileNavLink}>
            {item.label}
          </Link>
        ))}
        {!userName && (
          <>
            <Link href="/auth/login" className={styles.mobileNavLink}>Kirish</Link>
            <Link href="/auth/register" className={styles.mobileNavLink}>Ro&#39;yxatdan o&#39;tish</Link>
          </>
        )}
      </div>
    </header>
  );
}

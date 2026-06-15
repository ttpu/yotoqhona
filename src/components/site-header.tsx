'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/site-header.module.css';

type SiteHeaderProps = {
  userName: string | null;
};

const notifications = [
  'Arizangiz bo\'yicha yangi yangilanish mavjud',
  'Navbat holati yangilandi',
  'To\'lov muddati bo\'yicha eslatma',
  'Yangi bo\'sh o\'rinlar qo\'shildi',
];

export function SiteHeader({ userName }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = 3;

  const initials = useMemo(() => {
    if (!userName) return 'TJ';
    return userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [userName]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
        setIsMobileOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    setIsNotifOpen(false);
    setIsProfileOpen(false);
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems: Array<{ href: Route; label: string }> = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/catalog', label: 'Katalog' },
    { href: '/dashboard', label: 'Boshqaruv paneli' },
  ];

  const profileMenu: Array<{ href: Route; label: string }> = [
    { href: '/dashboard', label: 'Profil' },
    { href: '/dashboard/student', label: 'Mening arizalarim' },
    { href: '/dashboard/student', label: 'Mening yashash joyim' },
    { href: '/dashboard/student', label: 'To\'lovlar' },
    { href: '/dashboard/student', label: 'Bildirishnomalar' },
    { href: '/dashboard', label: 'Sozlamalar' },
    { href: '/', label: 'Yordam markazi' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand} aria-label="TalabaJoy bosh sahifaga o'tish">
            <span className={styles.brandIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 13.8L14 6L23.5 13.8V22.5C23.5 23.3 22.8 24 22 24H6C5.2 24 4.5 23.3 4.5 22.5V13.8Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M11.2 24V17.2H16.8V24" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M8.5 9.4L14 6L19.5 9.4" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M9.2 5.1L14 3L18.8 5.1L14 7.2L9.2 5.1Z" fill="currentColor"/>
                <path d="M13.25 10.7H14.75V16.2H16.5V17.5H11.5V16.2H13.25V10.7Z" fill="currentColor"/>
              </svg>
            </span>
            <span className={styles.brandText}>TalabaJoy</span>
          </Link>
        </div>

        <div className={styles.center}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Universitet, tuman yoki turar joy qidiring"
              aria-label="Qidiruv"
            />
          </div>
          <nav className={styles.desktopNav} aria-label="Asosiy navigatsiya">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.right}>
          <Link href="/dashboard/student" className={styles.quickAccess}>
            Talabaga tezkor kirish
          </Link>

          <div className={styles.dropdownWrap} ref={notifRef}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setIsNotifOpen((value) => !value)}
              aria-expanded={isNotifOpen}
              aria-controls="notif-panel"
              aria-label="Bildirishnomalar"
            >
              <span aria-hidden="true">🔔</span>
              <span className={styles.badge}>{unreadCount}</span>
            </button>
            {isNotifOpen && (
              <div id="notif-panel" className={styles.dropdownPanel} role="dialog" aria-label="Bildirishnomalar paneli">
                <p className={styles.dropdownTitle}>Bildirishnomalar markazi</p>
                <ul className={styles.notifList}>
                  {notifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.dropdownWrap} ref={profileRef}>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => setIsProfileOpen((value) => !value)}
              aria-expanded={isProfileOpen}
              aria-controls="profile-panel"
              aria-label="Profil menyusi"
            >
              <span className={styles.avatar}>{initials}</span>
              <span className={styles.profileName}>{userName ?? 'Foydalanuvchi'}</span>
              <span className={styles.chevron} aria-hidden="true">▾</span>
            </button>
            {isProfileOpen && (
              <div id="profile-panel" className={styles.dropdownPanel} role="menu" aria-label="Profil menyusi">
                {profileMenu.map((item) => (
                  <Link key={`${item.href}-${item.label}`} href={item.href} className={styles.menuItem} role="menuitem">
                    {item.label}
                  </Link>
                ))}
                <hr className={styles.divider} />
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className={styles.logoutButton}>
                    Chiqish
                  </button>
                </form>
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setIsMobileOpen((value) => !value)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-panel"
            aria-label="Menyu"
          >
            ☰
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div id="mobile-panel" className={styles.mobilePanel}>
          <div className={styles.mobileSearch}>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Qidiruv" aria-label="Mobil qidiruv" />
          </div>
          <nav className={styles.mobileNav} aria-label="Mobil navigatsiya">
            {navItems.map((item) => (
              <Link key={`mobile-${item.href}`} href={item.href} className={styles.mobileNavLink}>
                {item.label}
              </Link>
            ))}
            <Link href="/dashboard/student" className={styles.mobileNavLink}>
              Talabaga tezkor kirish
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
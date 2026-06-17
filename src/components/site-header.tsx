'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Route } from 'next';
import type { SessionUser } from '@/lib/session';
import styles from '@/components/site-header.module.css';

type SiteHeaderProps = {
  user: SessionUser | null;
};

const navItems = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/catalog', label: 'Katalog' },
  { href: '/dashboard', label: 'Universitetlar' },
  { href: '/', label: 'Yordam' },
];

const roleLabels: Record<SessionUser['role'], string> = {
  STUDENT: 'Talaba',
  UNIVERSITY_PROVIDER: 'Universitet boshqarmasi',
  PRIVATE_PROVIDER: 'Xususiy egasi',
};

type MenuItem = {
  href: Route;
  icon: string;
  title: string;
  desc: string;
};

const studentMenu: MenuItem[] = [
  { href: '/dashboard/student' as Route, icon: '🏠', title: 'Mening yashash joyim', desc: "Joriy turar joyingiz, xona va yashash holatini ko'rish." },
  { href: '/dashboard/student' as Route, icon: '📄', title: 'Mening arizalarim', desc: 'Yotoqxona, kvartira yoki xostelga barcha arizalar.' },
  { href: '/dashboard/student' as Route, icon: '💳', title: "To'lovlar", desc: "To'lovlar tarixi, Payme/Click cheklari, qarzdorliklar." },
  { href: '/favorites' as Route, icon: '❤️', title: 'Saqlangan joylar', desc: 'Sevimli yotoqxona va kvartiralar.' },
  { href: '/dashboard/student' as Route, icon: '⚙️', title: 'Sozlamalar', desc: "Telefon, parol, til va sozlamalarni o'zgartirish." },
  { href: '/' as Route, icon: '❓', title: 'Yordam markazi', desc: "Tez-tez so'raladigan savollar va qo'llab-quvvatlash bilan bog'lanish." },
];

const universityMenu: MenuItem[] = [
  { href: '/dashboard/listings/new' as Route, icon: '➕', title: "Yangi e'lon qo'shish", desc: "Yangi turar joy e'lonini platformaga joylashtirish." },
  { href: '/dashboard/admin' as Route, icon: '🏢', title: 'Boshqaruv paneli', desc: 'Bino, xona va joylar holatining umumiy ko\'rinishi.' },
  { href: '/dashboard/listings' as Route, icon: '🛏️', title: "E'lonlarni boshqarish", desc: "Barcha e'lonlarni ko'rish va moderatsiya qilish." },
  { href: '/dashboard/admin' as Route, icon: '📥', title: 'Arizalar va navbat', desc: 'Talabalar arizalarini ko\'rib chiqish va navbatni boshqarish.' },
  { href: '/dashboard/admin' as Route, icon: '💳', title: "To'lovlar va hisobotlar", desc: 'Tushumlar, qarzdorliklar va moliyaviy hisobotlar.' },
  { href: '/dashboard/admin' as Route, icon: '⚙️', title: 'Sozlamalar', desc: 'Tashkilot va akkaunt sozlamalari.' },
  { href: '/' as Route, icon: '❓', title: 'Yordam markazi', desc: "Tez-tez so'raladigan savollar va qo'llab-quvvatlash bilan bog'lanish." },
];

const privateMenu: MenuItem[] = [
  { href: '/dashboard/listings/new' as Route, icon: '➕', title: "Yangi e'lon qo'shish", desc: "Yangi turar joy e'lonini platformaga joylashtirish." },
  { href: '/dashboard/listings' as Route, icon: '🏠', title: "E'lonlarim", desc: "Joylashtirilgan kvartira, xona va xostel e'lonlari." },
  { href: '/dashboard/provider' as Route, icon: '📥', title: 'Arizalar', desc: "Ijaraga olish bo'yicha kelib tushgan so'rovlar." },
  { href: '/dashboard/provider' as Route, icon: '💳', title: "To'lovlar", desc: "Ijaraga oluvchilar to'lovlari va tushumlar." },
  { href: '/dashboard/provider' as Route, icon: '🛡️', title: 'Tekshiruv holati', desc: 'OneID va davlat tekshiruvi holatini ko\'rish.' },
  { href: '/dashboard/provider' as Route, icon: '⚙️', title: 'Sozlamalar', desc: 'Telefon, parol va akkaunt sozlamalari.' },
  { href: '/' as Route, icon: '❓', title: 'Yordam markazi', desc: "Tez-tez so'raladigan savollar va qo'llab-quvvatlash bilan bog'lanish." },
];

const notificationsByRole: Record<SessionUser['role'], string[]> = {
  STUDENT: [
    "Arizangiz bo'yicha yangi yangilanish mavjud",
    'Navbat holati yangilandi',
    "To'lov muddati bo'yicha eslatma",
  ],
  UNIVERSITY_PROVIDER: [
    "Yangi ariza tushdi — ko'rib chiqish kerak",
    "Bo'sh joylar soni kam qolyapti",
    'Oylik hisobot tayyor',
  ],
  PRIVATE_PROVIDER: [
    "Yangi ijaraga olish so'rovi keldi",
    "To'lov qabul qilindi",
    'OneID tekshiruvi holati yangilandi',
  ],
};

function getMenuForRole(role: SessionUser['role']): MenuItem[] {
  if (role === 'UNIVERSITY_PROVIDER') return universityMenu;
  if (role === 'PRIVATE_PROVIDER') return privateMenu;
  return studentMenu;
}

function getSubtitle(user: SessionUser): string {
  if (user.role === 'STUDENT') {
    return [roleLabels.STUDENT, user.university, user.course ? `${user.course}-kurs` : null]
      .filter(Boolean)
      .join(' • ');
  }
  if (user.role === 'UNIVERSITY_PROVIDER') {
    return [roleLabels.UNIVERSITY_PROVIDER, user.organizationName].filter(Boolean).join(' • ');
  }
  return roleLabels.PRIVATE_PROVIDER;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  const initials = useMemo(() => {
    if (!user?.displayName) return 'TJ';
    return user.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }, [user]);

  const notifications = user ? notificationsByRole[user.role] : [];
  const menu = user ? getMenuForRole(user.role) : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
        setIsMobileOpen(false);
        setIsLogoutConfirmOpen(false);
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
          {!user ? (
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
                  className={styles.bellBtn}
                  onClick={() => setIsNotifOpen((v) => !v)}
                  aria-label="Bildirishnomalar"
                >
                  <svg className={styles.bellIcon} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className={styles.bellBadge}>{notifications.length}</span>
                  )}
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
                    {user.displayName.split(' ')[0]}
                  </span>
                  <span className={styles.caret}>▾</span>
                </button>
                {isProfileOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{initials}</div>
                      <div>
                        <p className={styles.dropdownName}>{user.displayName}</p>
                        <p className={styles.dropdownSubtitle}>{getSubtitle(user)}</p>
                      </div>
                    </div>
                    <div className={styles.dropItems}>
                      {menu.map((item) => (
                        <Link key={item.title} href={item.href} className={styles.dropItem}>
                          <span className={styles.dropItemIcon}>{item.icon}</span>
                          <span className={styles.dropItemBody}>
                            <span className={styles.dropItemTitle}>{item.title}</span>
                            <span className={styles.dropItemDesc}>{item.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <hr className={styles.dropDivider} />
                    <button
                      type="button"
                      className={`${styles.dropItem} ${styles.dropLogout}`}
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsLogoutConfirmOpen(true);
                      }}
                    >
                      <span className={styles.dropItemIcon}>🚪</span>
                      <span className={styles.dropItemTitle}>Chiqish</span>
                    </button>
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
        {!user && (
          <>
            <Link href="/auth/login" className={styles.mobileNavLink}>Kirish</Link>
            <Link href="/auth/register" className={styles.mobileNavLink}>Ro&#39;yxatdan o&#39;tish</Link>
          </>
        )}
      </div>

      {/* Logout confirmation modal */}
      {isLogoutConfirmOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsLogoutConfirmOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🚪</div>
            <h3 className={styles.modalTitle}>Profildan chiqmoqchimisiz?</h3>
            <p className={styles.modalText}>
              Tizimdan chiqsangiz, qaytadan kirish uchun email va parolingiz kerak bo&#39;ladi.
            </p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className={styles.modalBtnCancel}
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className={styles.modalBtnConfirm}
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Chiqilmoqda...' : 'Ha, chiqish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

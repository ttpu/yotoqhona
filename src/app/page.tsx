import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { cookies } from 'next/headers';
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Camera,
  CreditCard,
  FileText,
  GraduationCap,
  Handshake,
  Home as HomeIcon,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Play,
  Search,
  Send,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getAllListingLocations, getFavoriteIds, listListings } from '@/lib/listings-store';
import ListingCard from '@/components/listing-card';
import ListingsMap from '@/components/listings-map-loader';
import styles from '@/app/page.module.css';

// =====================================================================
// IKONKALAR — rasmlarni public/icons/ papkasiga joylang va
// iconSrc: '' o'rniga yo'lni yozing, masalan: '/icons/shield.png'
// =====================================================================

const aboutCards: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Tasdiqlangan turar joylar',
    text: "Barcha joylar tekshiruvidan o'tkazilgan va tasdiqlangan.",
  },
  {
    icon: GraduationCap,
    title: 'Universitetlar bilan integratsiya',
    text: 'Rasmiy hamkorlik orqali ishonchli xizmat.',
  },
  {
    icon: Search,
    title: 'Qulay qidiruv va xaritalar',
    text: 'Xarita orqali joyashuvni oson toping.',
  },
  {
    icon: Wallet,
    title: "Onlayn to'lov va boshqaruv",
    text: "Xavfsiz to'lov qiling va arizalaringizni boshqaring.",
  },
];

const missionPillars: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Xavfsizlik',
    text: 'Faqat tasdiqlangan va ishonchli obyektlar.',
  },
  {
    icon: Zap,
    title: 'Tezkorlik',
    text: 'Bir necha daqiqada ariza yuborish va javob olish.',
  },
  {
    icon: Handshake,
    title: 'Ishonchlilik',
    text: 'Universitetlar va rasmiy hamkorlar bilan ishlaymiz.',
  },
];

const whyCards: { icon: LucideIcon; color: string; title: string; text: string }[] = [
  { icon: BadgeCheck, color: 'green', title: 'Tasdiqlangan turar joylar', text: 'Barcha obyektlar tekshirilgan va tasdiqlangan.' },
  { icon: GraduationCap, color: 'blue', title: 'Universitet integratsiyasi', text: "Rasmiy universitetlar bilan to'g'ridan-to'g'ri integratsiya." },
  { icon: BarChart3, color: 'orange', title: 'Real vaqt statistikasi', text: "Joy soni, bandlik va navbat haqida real vaqt ma'lumot." },
  { icon: FileText, color: 'purple', title: 'Onlayn arizalar', text: "Ariza yuborish jarayoni to'liq onlayn va juda oson." },
  { icon: CreditCard, color: 'green', title: "Payme va Click to'lovlari", text: "Xavfsiz onlayn to'lov tizimi orqali to'lov qiling." },
  { icon: LayoutDashboard, color: 'blue', title: 'Yagona boshqaruv tizimi', text: 'Talabalar va turar joy egalari uchun qulay boshqaruv.' },
  { icon: MapPin, color: 'orange', title: 'Xarita orqali qidiruv', text: 'Joyashuvni xarita orqali oson toping.' },
  { icon: Lock, color: 'purple', title: 'Xavfsiz va shaffof xizmat', text: "Ma'lumotlaringiz himoyalangan, xizmatlarimiz shaffof." },
];

export default async function HomePage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  const { items: demoListings } = await listListings({
    filters: { status: 'ACTIVE' },
    sort: 'newest',
    pageSize: 4
  });
  const favoriteIds = sessionUser ? await getFavoriteIds(sessionUser.id) : [];
  const featuredListings = demoListings.map((item) => ({
    ...item,
    isFavorited: favoriteIds.includes(item.id)
  }));

  const isProvider =
    sessionUser?.role === 'UNIVERSITY_PROVIDER' || sessionUser?.role === 'PRIVATE_PROVIDER';
  const listingCta = (isProvider ? '/dashboard/listings/new' : '/auth/register') as Route;

  const mapLocations = await getAllListingLocations();

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        {/* Background image */}
        <div className={styles.heroBgWrap}>
          <Image
            src="/image_student_globall4.png"
            alt="Talaba yotoqxonada"
            fill
            className={styles.heroBgImg}
            priority
          />
          <div className={styles.heroBgGradient} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Talabalar uchun</div>
          <h1 className={styles.heroTitle}>
            Talabalar uchun ishonchli turar joy topishning eng qulay yo`li
          </h1>
          <p className={styles.heroDesc}>
            Yotoqxona, hostel va ijaradagi turar joylarni qidiring, taqqoslang, ariza yuboring va
            barcha jarayonlarni yagona platforma orqali boshqaring.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/catalog" className={styles.btnPrimary}>Turar joy qidirish</Link>
            <Link href={listingCta} className={styles.btnOutline}>Turar joy joylashtirish</Link>
          </div>
          <div className={styles.heroTrust}>
            <span className={styles.trustItem}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#4caf82" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Tasdiqlangan joylar
            </span>
            <span className={styles.trustItem}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#4caf82" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Xavfsiz to`lov
            </span>
            <span className={styles.trustItem}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#4caf82" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Ishonchli hamkorlar
            </span>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about}>
        <div className={styles.aboutLeft}>
          <h2>TalabaJoy haqida</h2>
          <p className={styles.aboutSubtitle}>Talabalar uchun yagona raqamli turar joy ekotizimi</p>
          <p className={styles.aboutText}>
            TalabaJoy — bu talabalarni yotoqxona, hostel va ijaradagi turar joylar bilan
            bog`lovchi ishonchli va qulay platforma. Bizning maqsadimiz — har bir talaba uchun
            xavfsiz, qulay va arzon turar joy topishini osonlashtirish.
          </p>
          <Link href="/catalog" className={styles.btnSecondary}>Batafsil ma`lumot →</Link>
        </div>
        <div className={styles.aboutGrid}>
          {aboutCards.map((card) => (
            <article className={styles.featureCard} key={card.title}>
              <div className={styles.featureIcon}>
                <card.icon size={22} />
              </div>
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <>
          <section className={styles.featured}>
            <div className={styles.featuredHead}>
              <div>
                <p className={styles.featuredEyebrow}>Mashhur e&#39;lonlar</p>
                <h2>Talabalar orasida sevimli turar joylar</h2>
              </div>
              <Link href="/catalog" className={styles.btnSecondary}>Barchasini ko&#39;rish →</Link>
            </div>
            <div className={styles.featuredGrid}>
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} loggedIn={Boolean(sessionUser)} />
              ))}
            </div>
          </section>

          <hr className={styles.divider} />
        </>
      )}

      {/* MISSION */}
      <section className={styles.mission}>
        <p className={styles.missionEyebrow}>Bizning maqsadimiz</p>
        <h2>Har bir talaba uchun xavfsiz va qulay turar joy topishni osonlashtirish.</h2>
        <div className={styles.pillars}>
          {missionPillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.title}>
              <div className={styles.pillarIcon}>
                <pillar.icon size={20} />
              </div>
              <div>
                <h4>{pillar.title}</h4>
                <p>{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* WHY */}
      <section className={styles.why}>
        <h2>Nima uchun TalabaJoy?</h2>
        <div className={styles.whyGrid}>
          {whyCards.map((card) => (
            <div className={styles.whyCard} key={card.title}>
              <div className={`${styles.whyIcon} ${styles[card.color as keyof typeof styles]}`}>
                <card.icon size={20} />
              </div>
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* MAP */}
      <section className={styles.mapSection}>
        <h2>Toshkentdagi turar joylar xaritada</h2>
        <p className={styles.mapSub}>
          Saytda joylashtirilgan barcha e&#39;lonlar xaritada — yaqin yotoqxona, xona yoki kvartirani toping.
        </p>
        <div className={styles.mapWrap}>
          <ListingsMap locations={mapLocations} />
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.green}`} /> Yotoqxonalar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.blue}`} /> Xonalar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.orange}`} /> Kvartiralar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.purple}`} /> Hovli / Uylar
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <div className={styles.statsBanner}>
        <div className={styles.statsBannerTitle}>TalabaJoy<br />raqamlarda</div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}><Building2 size={20} /></div>
            <div>
              <div className={styles.statNum}>20+</div>
              <div className={styles.statLabel}>Hamkor universitetlar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}><Users size={20} /></div>
            <div>
              <div className={styles.statNum}>5000+</div>
              <div className={styles.statLabel}>Talabalar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}><HomeIcon size={20} /></div>
            <div>
              <div className={styles.statNum}>2000+</div>
              <div className={styles.statLabel}>Mavjud joylar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}><BadgeCheck size={20} /></div>
            <div>
              <div className={styles.statNum}>500+</div>
              <div className={styles.statLabel}>Tasdiqlangan obyektlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaText}>
          <h2>Turar joy topishga hozirroq boshlang!</h2>
          <p>TalabaJoy sizning ishonchli hamkoringiz.</p>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="/catalog" className={styles.btnCtaPrimary}>Turar joy qidirish</Link>
          <Link href={listingCta} className={styles.btnCtaOutline}>Turar joy joylashtirish</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <Link href="/" className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>TJ</div>
              TalabaJoy
            </Link>
            <p className={styles.footerDesc}>
              Talabalar uchun ishonchli turar joy ekotizimi. Qidiring, taqqoslang, ariza yuborying
              va boshqaring.
            </p>
            <div className={styles.footerSocial}>
              <a href="#" className={styles.socialIcon} aria-label="Telegram"><Send size={15} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">f</a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram"><Camera size={15} /></a>
              <a href="#" className={styles.socialIcon} aria-label="YouTube"><Play size={15} /></a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <h4>Platforma</h4>
            <Link href="/">Bosh sahifa</Link>
            <Link href="/catalog">Katalog</Link>
            <Link href="/dashboard">Universitetlar</Link>
            <Link href="/">Yordam</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Foydali</h4>
            <Link href="/">Savol-javoblar</Link>
            <Link href="/">Foydalanuvchi shartnoma</Link>
            <Link href="/">Qoidalar va shartlar</Link>
            <Link href="/">Maxfiylik siyosati</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Aloqa</h4>
            <div className={styles.contactItem}><Phone size={15} /> +998 90 123 45 67</div>
            <div className={styles.contactItem}><Mail size={15} /> info@talabajoy.uz</div>
            <div className={styles.contactItem}><MapPin size={15} /> Toshkent, O`zbekiston</div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © 2024 TalabaJoy. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </>
  );
}

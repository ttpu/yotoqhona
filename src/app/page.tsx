import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/page.module.css';

// =====================================================================
// IKONKALAR — rasmlarni public/icons/ papkasiga joylang va
// iconSrc: '' o'rniga yo'lni yozing, masalan: '/icons/shield.png'
// =====================================================================

const aboutCards = [
  {
    iconSrc: '/icons/301177_shield-checkmark-icon.png',
    title: 'Tasdiqlangan turar joylar',
    text: "Barcha joylar tekshiruvidan o'tkazilgan va tasdiqlangan.",
  },
  {
    iconSrc: '/icons/301168_people-icon.png',
    title: 'Universitetlar bilan integratsiya',
    text: 'Rasmiy hamkorlik orqali ishonchli xizmat.',
  },
  {
    iconSrc: '/icons/301175_search-icon.png',
    title: 'Qulay qidiruv va xaritalar',
    text: 'Xarita orqali joyashuvni oson toping.',
  },
  {
    iconSrc: '/icons/301185_wallet-icon.png',
    title: "Onlayn to'lov va boshqaruv",
    text: "Xavfsiz to'lov qiling va arizalaringizni boshqaring.",
  },
];

const missionPillars = [
  {
    iconSrc: '', // '/icons/shield.png'
    title: 'Xavfsizlik',
    text: 'Faqat tasdiqlangan va ishonchli obyektlar.',
  },
  {
    iconSrc: '', // '/icons/lightning.png'
    title: 'Tezkorlik',
    text: 'Bir necha daqiqada ariza yuborish va javob olish.',
  },
  {
    iconSrc: '', // '/icons/handshake.png'
    title: 'Ishonchlilik',
    text: 'Universitetlar va rasmiy hamkorlar bilan ishlaymiz.',
  },
];

const whyCards = [
  { iconSrc: '', color: 'green',  title: 'Tasdiqlangan turar joylar',  text: 'Barcha obyektlar tekshirilgan va tasdiqlangan.' },        // '/icons/verified.png'
  { iconSrc: '', color: 'blue',   title: 'Universitet integratsiyasi', text: "Rasmiy universitetlar bilan to'g'ridan-to'g'ri integratsiya." }, // '/icons/graduation.png'
  { iconSrc: '', color: 'orange', title: 'Real vaqt statistikasi',     text: "Joy soni, bandlik va navbat haqida real vaqt ma'lumot." }, // '/icons/stats.png'
  { iconSrc: '', color: 'purple', title: 'Onlayn arizalar',            text: "Ariza yuborish jarayoni to'liq onlayn va juda oson." },    // '/icons/application.png'
  { iconSrc: '', color: 'green',  title: "Payme va Click to'lovlari",  text: "Xavfsiz onlayn to'lov tizimi orqali to'lov qiling." },    // '/icons/payment.png'
  { iconSrc: '', color: 'blue',   title: 'Yagona boshqaruv tizimi',   text: 'Talabalar va turar joy egalari uchun qulay boshqaruv.' }, // '/icons/dashboard.png'
  { iconSrc: '', color: 'orange', title: 'Xarita orqali qidiruv',     text: 'Joyashuvni xarita orqali oson toping.' },                 // '/icons/map.png'
  { iconSrc: '', color: 'purple', title: 'Xavfsiz va shaffof xizmat', text: "Ma'lumotlaringiz himoyalangan, xizmatlarimiz shaffof." }, // '/icons/security.png'
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        {/* Background image */}
        <div className={styles.heroBgWrap}>
          <Image
            src="/image_student_globall3.png"
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
            <Link href="/auth/register" className={styles.btnOutline}>Turar joy joylashtirish</Link>
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
                {card.iconSrc
                  ? <Image src={card.iconSrc} alt={card.title} width={44} height={44} />
                  : <div className={styles.iconSlot} />
                }
              </div>
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* MISSION */}
      <section className={styles.mission}>
        <p className={styles.missionEyebrow}>Bizning maqsadimiz</p>
        <h2>Har bir talaba uchun xavfsiz va qulay turar joy topishni osonlashtirish.</h2>
        <div className={styles.pillars}>
          {missionPillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.title}>
              <div className={styles.pillarIcon}>
                {pillar.iconSrc
                  ? <Image src={pillar.iconSrc} alt={pillar.title} width={36} height={36} />
                  : <div className={styles.iconSlot} />
                }
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
                {card.iconSrc
                  ? <Image src={card.iconSrc} alt={card.title} width={24} height={24} />
                  : <div className={styles.iconSlot} />
                }
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
          Xarita orqali sizga yaqin yotoqxona, hostel va kvartiralarni toping.
        </p>
        <div className={styles.mapWrap}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d95883.84196894897!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suz!2suz!4v1699000000000!5m2!1suz!2suz"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Toshkent xaritasi"
          />
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.green}`} /> Yotoqxonalar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.blue}`} /> Hostellar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.orange}`} /> Kvartiralar
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.purple}`} /> Ijaraga uylar
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <div className={styles.statsBanner}>
        <div className={styles.statsBannerTitle}>TalabaJoy<br />raqamlarda</div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}> </div>
            <div>
              <div className={styles.statNum}>20+</div>
              <div className={styles.statLabel}>Hamkor universitetlar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}> </div>
            <div>
              <div className={styles.statNum}>5000+</div>
              <div className={styles.statLabel}>Talabalar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}> </div>
            <div>
              <div className={styles.statNum}>2000+</div>
              <div className={styles.statLabel}>Mavjud joylar</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconBox}> </div>
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
          <Link href="/auth/register" className={styles.btnCtaOutline}>Turar joy joylashtirish</Link>
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
              <a href="#" className={styles.socialIcon}>📱</a>
              <a href="#" className={styles.socialIcon}>f</a>
              <a href="#" className={styles.socialIcon}>📷</a>
              <a href="#" className={styles.socialIcon}>▶</a>
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
            <div className={styles.contactItem}><span>📞</span> +998 90 123 45 67</div>
            <div className={styles.contactItem}><span>✉️</span> info@talabajoy.uz</div>
            <div className={styles.contactItem}><span>📍</span> Toshkent, O`zbekiston</div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © 2024 TalabaJoy. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </>
  );
}

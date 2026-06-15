import Link from 'next/link';
import { StatCounter } from '@/components/stat-counter';
import styles from '@/app/page.module.css';

const aboutCards = [
  {
    icon: '🏫',
    title: 'Universitetlar',
    text: 'Tasdiqlangan universitetlar bilan hamkorlik',
  },
  {
    icon: '🏠',
    title: 'Turar joylar',
    text: 'Yotoqxona, xostel va ijara uylar',
  },
  {
    icon: '📍',
    title: 'Qulay qidiruv',
    text: 'Xarita va filtrlar orqali qidirish',
  },
  {
    icon: '🔔',
    title: 'Bildirishnomalar',
    text: 'Bo‘sh o‘rinlar haqida tezkor xabarlar',
  },
];

const whyCards = [
  {
    icon: '✅',
    title: 'Tasdiqlangan turar joylar',
    text: 'Faqat tekshirilgan va ishonchli obyektlar.',
  },
  {
    icon: '🎓',
    title: 'Universitet integratsiyasi',
    text: 'Universitetlar bilan bog‘langan tizim.',
  },
  {
    icon: '⚡',
    title: 'Real vaqt ma\'lumotlari',
    text: 'Bo‘sh o‘rinlar va navbatlarni kuzatish.',
  },
  {
    icon: '📋',
    title: 'Onlayn arizalar',
    text: 'Bir necha daqiqada ariza yuborish.',
  },
  {
    icon: '💳',
    title: 'Onlayn to‘lovlar',
    text: 'Payme, Click va boshqa tizimlar.',
  },
  {
    icon: '📍',
    title: 'Interaktiv xarita',
    text: 'Turar joylarni xaritada ko‘rish.',
  },
  {
    icon: '🔒',
    title: 'Xavfsizlik',
    text: 'Talabalar uchun xavfsiz muhit.',
  },
  {
    icon: '📊',
    title: 'Yagona boshqaruv',
    text: 'Talaba va turar joy egalari uchun.',
  },
];

const stats = [
  { value: 25, label: 'Universitet' },
  { value: 500, label: 'Turar joy' },
  { value: 5000, label: 'Talaba' },
  { value: 2000, label: 'Bo‘sh o‘rin' },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroBadge}>Talabalar uchun milliy raqamli platforma</p>
          <h1 className={styles.heroTitle}>Talabalar uchun ishonchli turar joy topishning eng qulay yo‘li</h1>
          <p className={styles.heroText}>
            TalabaJoy orqali siz yotoqxona, xostel va ijara turar joylarini bir joyda topasiz,
            taqqoslaysiz va ariza topshirasiz.
          </p>
          <div className={styles.heroActions}>
            <Link href="/catalog" className={styles.primaryBtn}>
              Turar joylarni ko‘rish
            </Link>
            <Link href="/dashboard/student" className={styles.secondaryBtn}>
              Talaba paneliga o‘tish
            </Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroInfoCard}>
            <h3>Tezkor imkoniyatlar</h3>
            <ul>
              <li>Real vaqt bo‘yicha bo‘sh o‘rinlar</li>
              <li>Onlayn ariza va navbat kuzatuvi</li>
              <li>Avtomatik to‘lov eslatmalari</li>
              <li>Universitet bilan integratsiya</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutLeft}>
          <h2>TalabaJoy haqida</h2>
          <p>
            TalabaJoy — talabalar uchun yotoqxona, xostel va ijara turar joylarini topish,
            taqqoslash va boshqarish imkonini beruvchi yagona platforma.
          </p>
          <Link href="/dashboard" className={styles.secondaryBtn}>
            Batafsil
          </Link>
        </div>
        <div className={styles.aboutGrid}>
          {aboutCards.map((card) => (
            <article className={styles.featureCard} key={card.title}>
              <span className={styles.cardIcon} aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map((item) => (
          <article className={styles.statCard} key={item.label}>
            <p className={styles.statValue}>
              <StatCounter value={item.value} />
            </p>
            <p className={styles.statLabel}>{item.label}</p>
          </article>
        ))}
      </section>

      <section className={styles.why}>
        <div className={styles.sectionHead}>
          <h2>Nima uchun TalabaJoy?</h2>
          <p>Talabalar uchun yaratilgan zamonaviy va ishonchli turar joy ekotizimi.</p>
        </div>
        <div className={styles.whyGrid}>
          {whyCards.map((card) => (
            <article className={styles.whyCard} key={card.title}>
              <span className={styles.cardIcon} aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.sectionHead}>
          <h2>Toshkent bo‘yicha interaktiv xarita</h2>
          <p>Hududlar kesimida turar joylarni tez va qulay toping.</p>
        </div>
        <div className={styles.mapCard}>
          <iframe
            title="TalabaJoy xaritasi"
            src="https://www.google.com/maps?q=Tashkent&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className={styles.partners}>
        <div className={styles.sectionHead}>
          <h2>Hamkor universitetlar</h2>
          <p>TalabaJoy ishonchli hamkor tarmog‘i bilan ishlaydi.</p>
        </div>
        <div className={styles.partnerGrid}>
          <article className={styles.partnerCard}>
            <img src="/universities/tuit.svg" alt="TUIT" loading="lazy" />
          </article>
          <article className={styles.partnerCard}>
            <img src="/universities/wiut.svg" alt="WIUT" loading="lazy" />
          </article>
          <article className={styles.partnerCard}>
            <img src="/universities/nuu.svg" alt="NUU" loading="lazy" />
          </article>
          <article className={styles.partnerCard}>
            <img src="/universities/samsu.svg" alt="SamSU" loading="lazy" />
          </article>
        </div>
      </section>
    </div>
  );
}
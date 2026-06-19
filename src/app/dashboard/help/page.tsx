import { cookies } from 'next/headers';
import { HelpCircle, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import FaqAccordion from './faq-accordion';
import ContactForm from './contact-form';
import styles from './help.module.css';

export default function HelpPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Yordam markazi</h1>
        <p className={styles.subtitle}>Tez-tez so&#39;raladigan savollar va qo&#39;llab-quvvatlash xizmati.</p>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          <HelpCircle size={16} /> Ko&#39;p so&#39;raladigan savollar
        </p>
        <FaqAccordion />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          <Phone size={16} /> Biz bilan bog&#39;lanish
        </p>
        <div className={styles.contactGrid}>
          <a href="tel:+998901234567" className={styles.contactCard}>
            <span className={styles.contactIcon}>
              <Phone size={16} />
            </span>
            <span>
              <div className={styles.contactLabel}>Telefon</div>
              <div className={styles.contactValue}>+998 90 123 45 67</div>
            </span>
          </a>
          <a href="mailto:info@talabajoy.uz" className={styles.contactCard}>
            <span className={styles.contactIcon}>
              <Mail size={16} />
            </span>
            <span>
              <div className={styles.contactLabel}>Email</div>
              <div className={styles.contactValue}>info@talabajoy.uz</div>
            </span>
          </a>
          <a href="#" className={styles.contactCard}>
            <span className={styles.contactIcon}>
              <Send size={16} />
            </span>
            <span>
              <div className={styles.contactLabel}>Telegram</div>
              <div className={styles.contactValue}>@talabajoy_support</div>
            </span>
          </a>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          <MessageSquare size={16} /> Xabar yuborish
        </p>
        <ContactForm defaultName={sessionUser?.displayName} defaultEmail={sessionUser?.email} />
      </div>
    </div>
  );
}

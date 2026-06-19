'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './help.module.css';

const FAQS: { q: string; a: string }[] = [
  {
    q: "Saytda qanday ro'yxatdan o'tish mumkin?",
    a: "Bosh sahifadagi \"Ro'yxatdan o'tish\" tugmasi orqali talaba, universitet boshqarmasi yoki xususiy turar joy egasi sifatida ro'yxatdan o'tishingiz mumkin. Har bir rol uchun alohida forma mavjud."
  },
  {
    q: "Yotoqxonaga qanday joylashish mumkin?",
    a: "Talaba akkauntingiz bilan kirib, \"Mening yashash joyim\" bo'limidan qavat va xonani tanlang. So'rovingiz universitet ma'muriyati tomonidan ko'rib chiqiladi va tasdiqlangach joylashish mumkin."
  },
  {
    q: "To'lovni qanday amalga oshirsam bo'ladi?",
    a: "\"To'lovlar\" bo'limida hisob-fakturalaringiz ko'rsatiladi. Har bir to'lanmagan hisob yonida Payme yoki Click orqali to'lash tugmasi mavjud."
  },
  {
    q: "Agar to'lov muddati o'tib ketsa nima bo'ladi?",
    a: "Muddati o'tgan to'lovlar \"Muddati o'tgan\" statusi bilan belgilanadi va universitet ma'muriyatiga ham ko'rinadi. Iloji boricha tezroq to'lashni tavsiya qilamiz."
  },
  {
    q: "E'lon qanday joylashtiriladi?",
    a: "Universitet boshqarmasi va xususiy turar joy egalari \"Yangi e'lon qo'shish\" orqali turar joy e'lonini joylashtirishi mumkin. E'lon manzil, narx, qulayliklar va fotosuratlar bilan to'ldiriladi."
  },
  {
    q: "\"Rasmiy\" belgisi nimani anglatadi?",
    a: "Bu belgi e'lon rasman universitet tomonidan tasdiqlangan va boshqarilayotganini bildiradi — masalan, universitet yotoqxonalari."
  },
  {
    q: "Shaxsni tasdiqlash (OneID) nima uchun kerak?",
    a: "OneID orqali shaxsingizni tasdiqlash hisobingizga ishonch darajasini oshiradi va \"Verified\" nishonini olish imkonini beradi."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((item, idx) => {
        const open = openIndex === idx;
        return (
          <div key={item.q} className={styles.faqItem}>
            <button
              type="button"
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(open ? null : idx)}
            >
              {item.q}
              <ChevronDown size={16} className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`} />
            </button>
            {open && <p className={styles.faqAnswer}>{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

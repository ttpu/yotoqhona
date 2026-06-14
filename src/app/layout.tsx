import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalabaJoy | Talabalar uchun turar joy platformasi",
  description: "Talabalar uchun ishonchli turar joy topish va boshqarish platformasi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <div className="container">
          <header className="topbar">
            <div className="brand-wrap">
              <Link href="/" className="brand-mark" aria-label="Bosh sahifa">
                T
              </Link>
              <Link href="/" className="brand">
                TalabaJoy
              </Link>
            </div>
            <form action="/catalog" method="GET" className="top-search">
              <input name="city" placeholder="Shahar yoki universitet qidiring..." aria-label="Qidiruv" />
              <button type="submit" className="btn top-search-btn">
                Qidirish
              </button>
            </form>
            <nav className="nav">
              <Link href="/catalog">Katalog</Link>
              <Link href="/dashboard">Kabinetlar</Link>
              <Link href="/auth/register" className="btn btn-ghost">
                Ro&#39;yxatdan o&#39;tish
              </Link>
              <Link href="/auth/login" className="btn btn-primary">
                Kirish
              </Link>
            </nav>
          </header>
          {children}
          <footer className="footer footer-rich">
            <div className="footer-grid">
              <article>
                <h3>TalabaJoy</h3>
                <p>
                  Talabalar uchun yotoqxona, xostel va ijaradagi turar joylarni topish, taqqoslash va ariza
                  yuborishni osonlashtiruvchi yagona platforma.
                </p>
              </article>
              <article>
                <h3>Aloqa</h3>
                <ul className="footer-list">
                  <li>Email: support@talabajoy.uz</li>
                  <li>Telefon: +998 71 200 20 20</li>
                  <li>Manzil: Toshkent shahri, Yangi shahar ko&#39;chasi 12</li>
                </ul>
              </article>
              <article>
                <h3>Hamkorlar</h3>
                <ul className="footer-list">
                  <li>TATU</li>
                  <li>WIUT</li>
                  <li>SamDU</li>
                  <li>O&#39;zMU</li>
                </ul>
              </article>
              <article>
                <h3>Huquqiy</h3>
                <ul className="footer-list">
                  <li>Foydalanish shartlari</li>
                  <li>Maxfiylik siyosati</li>
                  <li>Qo&#39;llab-quvvatlash markazi</li>
                </ul>
              </article>
            </div>
            <div className="footer-bottom">© {new Date().getFullYear()} TalabaJoy. Barcha huquqlar himoyalangan.</div>
          </footer>
        </div>
      </body>
    </html>
  );
}

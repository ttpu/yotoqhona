import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "TalabaJoy | Talabalar uchun turar joy platformasi",
  description: "Talabalar uchun ishonchli turar joy topish va boshqarish platformasi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("talabajoy_session")?.value;
  const currentUser = session
    ? (JSON.parse(session) as { displayName: string; role: string; status?: string; verified?: boolean })
    : null;
  const profileHref =
    currentUser?.role === "STUDENT"
      ? "/dashboard/student?status=ACTIVE&verified=false"
      : currentUser
        ? "/dashboard/provider?status=PENDING_VERIFICATION"
        : "/dashboard";

  return (
    <html lang="uz">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
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
              {currentUser ? (
                <>
                  <span className="user-chip">{currentUser.displayName}</span>
                  <Link href={profileHref} className="btn btn-ghost">
                    Profilim
                  </Link>
                  <Link href="/api/auth/logout" className="btn btn-primary">
                    Chiqish
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="btn btn-ghost">
                    Ro&#39;yxatdan o&#39;tish
                  </Link>
                  <Link href="/auth/login" className="btn btn-primary">
                    Kirish
                  </Link>
                </>
              )}
            </nav>
          </header>
          <div className="page-frame">{children}</div>
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

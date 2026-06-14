import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSHE | Smart Student Housing Ecosystem",
  description: "Student housing lifecycle management platform for Uzbekistan"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="topbar">
            <Link href="/" className="brand">
              SSHE Uzbekistan
            </Link>
            <nav className="nav">
              <Link href="/catalog">Housing Catalog</Link>
              <Link href="/dashboard">Dashboards</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div>Smart Student Housing Ecosystem · Contact: support@sshe.uz · +998 71 200 20 20</div>
            <div>Partner Universities: TUIT, SamSU, WIUT, NUUz · Legal: Terms, Privacy, Compliance</div>
          </footer>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/site-shell';
import { parseSessionCookie } from '@/lib/session';

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const displayFont = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'TalabaJoy',
  description: 'Talabalar uchun zamonaviy turar joy platformasi',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionCookie = cookies().get('talabajoy_session')?.value;
  const user = parseSessionCookie(sessionCookie);

  return (
    <html lang="uz">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <SiteShell user={user}>{children}</SiteShell>
      </body>
    </html>
  );
}

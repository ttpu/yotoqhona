import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

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

async function resolveUserNameFromSession() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const sessionCookie =
    allCookies.find((item) => item.name === 'talabajoy_session') ??
    allCookies.find((item) => /session|token|auth/i.test(item.name));

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const authStore = (await import('@/lib/auth-store')) as Record<string, unknown>;
    const finder =
      authStore.findUserBySession ??
      authStore.getUserBySession ??
      authStore.findBySession ??
      authStore.findUserByToken;

    if (typeof finder !== 'function') {
      return null;
    }

    const maybeUser = await Promise.resolve(
      (finder as (token: string) => unknown)(sessionCookie.value),
    );

    if (!maybeUser || typeof maybeUser !== 'object') {
      return null;
    }

    const user = maybeUser as Record<string, unknown>;
    const fullName = user.fullName ?? user.name;

    return typeof fullName === 'string' && fullName.trim().length > 0
      ? fullName.trim()
      : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userName = await resolveUserNameFromSession();

  return (
    <html lang="uz">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <SiteShell userName={userName}>{children}</SiteShell>
      </body>
    </html>
  );
}

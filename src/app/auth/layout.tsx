import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TalabaJoy — Kirish',
  description: 'TalabaJoy platformasiga kirish va ro\'yxatdan o\'tish',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

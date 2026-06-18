'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { message?: string; redirectTo?: string };

      if (!res.ok || !data.redirectTo) {
        setError(data.message ?? "Kirish amalga oshmadi");
        return;
      }

      router.push(data.redirectTo as Route);
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Keyinroq qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>TJ</div>
          TalabaJoy
        </Link>

        <h1 className={styles.title}>Tizimga kirish</h1>
        <p className={styles.subtitle}>
          Email va parol orqali profilingizga kiring
        </p>

        {error && (
          <div className={styles.error}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email manzil</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="talaba@example.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Parol</label>
            <div className={styles.inputWrap}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.withIcon}`}
                placeholder="Parolingizni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <a href="#" className={styles.forgotLink}>Parolni unutdingizmi?</a>
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className={styles.divider}>yoki</div>

        <p className={styles.bottomLink}>
          Hisobingiz yo&#39;qmi?{' '}
          <Link href="/auth/register">Ro&#39;yxatdan o&#39;ting</Link>
        </p>
      </div>
    </div>
  );
}

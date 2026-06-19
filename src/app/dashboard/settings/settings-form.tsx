'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Check, Globe, Lock, User } from 'lucide-react';
import type { SessionUser } from '@/lib/session';
import styles from './settings.module.css';

export default function SettingsForm({ user }: { user: SessionUser }) {
  const router = useRouter();

  const [phone, setPhone] = useState(user.phone ?? '');
  const [organizationName, setOrganizationName] = useState(user.organizationName ?? '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    setProfileError('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          ...(user.role === 'UNIVERSITY_PROVIDER' ? { organizationName } : {})
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.message ?? 'Xatolik yuz berdi');
        return;
      }
      setProfileMsg("Saqlandi!");
      router.refresh();
    } catch {
      setProfileError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Yangi parollar mos kelmadi');
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.message ?? 'Xatolik yuz berdi');
        return;
      }
      setPasswordMsg('Parol muvaffaqiyatli o\'zgartirildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <>
      <section className={styles.section}>
        <p className={styles.sectionTitle}>
          <User size={16} /> Profil ma&#39;lumotlari
        </p>
        <form onSubmit={onSaveProfile}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Ism</label>
              <input className={`${styles.input} ${styles.inputDisabled}`} value={user.displayName} disabled />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={`${styles.input} ${styles.inputDisabled}`} value={user.email} disabled />
            </div>
          </div>

          {user.role === 'UNIVERSITY_PROVIDER' && (
            <div className={styles.field}>
              <label className={styles.label}>
                <Building2 size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Tashkilot nomi
              </label>
              <input
                className={styles.input}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Telefon raqami</label>
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 000 00 00"
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={profileSaving}>
            {profileSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          {profileMsg && <p className={styles.successMsg}>{profileMsg}</p>}
          {profileError && <p className={styles.errorMsg}>{profileError}</p>}
        </form>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>
          <Lock size={16} /> Parolni o&#39;zgartirish
        </p>
        <form onSubmit={onChangePassword}>
          <div className={styles.field}>
            <label className={styles.label}>Joriy parol</label>
            <input
              className={styles.input}
              type="password"
              required
              minLength={8}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Yangi parol</label>
              <input
                className={styles.input}
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Yangi parolni tasdiqlash</label>
              <input
                className={styles.input}
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={passwordSaving}>
            {passwordSaving ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
          </button>
          {passwordMsg && <p className={styles.successMsg}>{passwordMsg}</p>}
          {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
        </form>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>
          <Globe size={16} /> Til
        </p>
        <div className={`${styles.langOption} ${styles.langOptionActive}`}>
          <span className={styles.langName}>O&#39;zbekcha</span>
          <Check size={16} color="#1a3c34" />
        </div>
        <div className={styles.langOption}>
          <span className={styles.langName}>Русский</span>
          <span className={styles.comingSoon}>Tez kunda</span>
        </div>
        <div className={styles.langOption}>
          <span className={styles.langName}>English</span>
          <span className={styles.comingSoon}>Tez kunda</span>
        </div>
      </section>
    </>
  );
}

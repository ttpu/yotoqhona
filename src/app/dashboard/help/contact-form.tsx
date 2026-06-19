'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import styles from './help.module.css';

type ContactFormProps = {
  defaultName?: string;
  defaultEmail?: string;
};

export default function ContactForm({ defaultName, defaultEmail }: ContactFormProps) {
  const [name, setName] = useState(defaultName ?? '');
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Xatolik yuz berdi');
        return;
      }
      setSuccess("Xabaringiz qabul qilindi! Tez orada javob beramiz.");
      setMessage('');
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Ismingiz</label>
        <input className={styles.input} required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Xabar</label>
        <textarea
          className={styles.textarea}
          required
          minLength={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Savolingizni shu yerga yozing..."
        />
      </div>
      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        <Send size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
        {loading ? 'Yuborilmoqda...' : 'Yuborish'}
      </button>
      {success && <p className={styles.successMsg}>{success}</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </form>
  );
}

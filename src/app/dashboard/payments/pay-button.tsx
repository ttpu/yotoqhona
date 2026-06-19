'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import type { PaymentProvider } from '@/lib/payment-types';
import styles from './payments.module.css';

export default function PayButtons({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [pendingProvider, setPendingProvider] = useState<PaymentProvider | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirmPay() {
    if (!pendingProvider) return;
    setLoading(true);
    try {
      await fetch(`/api/payments/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: pendingProvider })
      });
      router.refresh();
    } finally {
      setLoading(false);
      setPendingProvider(null);
    }
  }

  return (
    <>
      <div className={styles.payRow}>
        <button type="button" className={styles.btnPayme} onClick={() => setPendingProvider('PAYME')}>
          <CreditCard size={13} /> Payme
        </button>
        <button type="button" className={styles.btnClick} onClick={() => setPendingProvider('CLICK')}>
          <CreditCard size={13} /> Click
        </button>
      </div>

      {pendingProvider && (
        <div className={styles.modalOverlay} onClick={() => !loading && setPendingProvider(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{pendingProvider} orqali to&#39;lash</h3>
            <p className={styles.modalText}>
              To&#39;lov demo rejimida amalga oshiriladi — haqiqiy mablag&#39; yechilmaydi.
            </p>
            <div className={styles.modalBtns}>
              <button type="button" className={styles.modalBtnCancel} onClick={() => setPendingProvider(null)} disabled={loading}>
                Bekor qilish
              </button>
              <button
                type="button"
                className={pendingProvider === 'PAYME' ? styles.btnPayme : styles.btnClick}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={confirmPay}
                disabled={loading}
              >
                {loading ? "To'lanmoqda..." : "Tasdiqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

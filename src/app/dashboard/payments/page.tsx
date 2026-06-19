import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getInvoicesForStudent } from '@/lib/payments-store';
import { formatDate } from '@/lib/dormitory-labels';
import PayButtons from './pay-button';
import styles from './payments.module.css';

const STATUS_ICON = { UNPAID: Clock, OVERDUE: AlertTriangle, PAID: Check };
const STATUS_TEXT = { UNPAID: "To'lanmagan", OVERDUE: "Muddati o'tgan", PAID: "To'langan" };

export default async function PaymentsPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'STUDENT') redirect('/');

  const invoices = await getInvoicesForStudent(sessionUser.id);
  const unpaid = invoices.filter((i) => i.status !== 'PAID');
  const paid = invoices.filter((i) => i.status === 'PAID');
  const totalDebt = unpaid.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = paid.reduce((sum, i) => sum + i.amount, 0);

  function formatSum(n: number) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " so'm";
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>To&#39;lovlar</h1>
        <p className={styles.subtitle}>Hisob-fakturalaringiz va to&#39;lovlar tarixi.</p>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{formatSum(totalDebt)}</div>
          <div className={styles.summaryLabel}>Jami qarzdorlik</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{formatSum(totalPaid)}</div>
          <div className={styles.summaryLabel}>Jami to&#39;langan</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{unpaid.filter((i) => i.status === 'OVERDUE').length}</div>
          <div className={styles.summaryLabel}>Muddati o&#39;tgan</div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className={styles.empty}>Hozircha hisob-fakturalar yo&#39;q.</div>
      ) : (
        <>
          {unpaid.length > 0 && (
            <>
              <p className={styles.sectionTitle}>To&#39;lanishi kerak</p>
              {unpaid.map((invoice) => {
                const Icon = STATUS_ICON[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    className={`${styles.invoiceCard} ${invoice.status === 'OVERDUE' ? styles.invoiceCardOverdue : ''}`}
                  >
                    <div className={styles.invoiceInfo}>
                      <p className={styles.invoiceTitle}>{invoice.title}</p>
                      <p className={styles.invoiceMeta}>
                        Muddati: {formatDate(invoice.dueDate)} {invoice.roomLabel ? `· ${invoice.roomLabel}` : ''}
                      </p>
                      <span className={`${styles.statusBadge} ${styles[`status${invoice.status}`]}`}>
                        <Icon size={11} /> {STATUS_TEXT[invoice.status]}
                      </span>
                    </div>
                    <div>
                      <p className={styles.invoiceAmount}>{formatSum(invoice.amount)}</p>
                      <PayButtons invoiceId={invoice.id} />
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {paid.length > 0 && (
            <>
              <p className={styles.sectionTitle}>To&#39;lovlar tarixi</p>
              {paid.map((invoice) => {
                const Icon = STATUS_ICON[invoice.status];
                return (
                  <div key={invoice.id} className={styles.invoiceCard}>
                    <div className={styles.invoiceInfo}>
                      <p className={styles.invoiceTitle}>{invoice.title}</p>
                      <p className={styles.invoiceMeta}>
                        To&#39;landi: {invoice.paidAt ? formatDate(invoice.paidAt) : '—'} · {invoice.paymentProvider}
                      </p>
                      <span className={`${styles.statusBadge} ${styles[`status${invoice.status}`]}`}>
                        <Icon size={11} /> {STATUS_TEXT[invoice.status]}
                      </span>
                    </div>
                    <p className={styles.invoiceAmount}>{formatSum(invoice.amount)}</p>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}

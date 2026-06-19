import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Check, Clock, Wallet } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getInvoicesForUniversity, getUniversitySummary } from '@/lib/payments-store';
import { formatDate } from '@/lib/dormitory-labels';
import type { InvoiceStatus } from '@/lib/payment-types';
import dormStyles from '../dormitory.module.css';
import styles from './payments.module.css';

const STATUS_ICON = { UNPAID: Clock, OVERDUE: AlertTriangle, PAID: Check };
const STATUS_TEXT = { UNPAID: "To'lanmagan", OVERDUE: "Muddati o'tgan", PAID: "To'langan" };

type SearchParams = { search?: string; status?: string };

function formatSum(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " so'm";
}

export default async function DormitoryPaymentsPage({ searchParams }: { searchParams: SearchParams }) {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'UNIVERSITY_PROVIDER') redirect('/');

  const summary = await getUniversitySummary(sessionUser.id);
  const invoices = await getInvoicesForUniversity(sessionUser.id, {
    search: searchParams.search,
    status: (searchParams.status as InvoiceStatus) || undefined
  });

  return (
    <div className={dormStyles.wrap}>
      <Link href={'/dashboard/dormitory' as Route} className={dormStyles.backLink}>
        <ArrowLeft size={14} /> Yotoqxonaga qaytish
      </Link>

      <div className={styles.heading}>
        <h1 className={styles.title}>To&#39;lovlar va hisobotlar</h1>
        <p className={styles.subtitle}>Talabalar to&#39;lovlari, qarzdorliklar va tushumlar bo&#39;yicha umumiy hisobot.</p>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} green`}><Wallet size={18} /></div>
          <div>
            <div className={styles.summaryValue}>{formatSum(summary.collected)}</div>
            <div className={styles.summaryLabel}>Jami yig&#39;ilgan</div>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} orange`}><Clock size={18} /></div>
          <div>
            <div className={styles.summaryValue}>{formatSum(summary.outstanding)}</div>
            <div className={styles.summaryLabel}>Jami qarzdorlik</div>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} red`}><AlertTriangle size={18} /></div>
          <div>
            <div className={styles.summaryValue}>{summary.overdueCount}</div>
            <div className={styles.summaryLabel}>Muddati o&#39;tgan</div>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} blue`}><Check size={18} /></div>
          <div>
            <div className={styles.summaryValue}>{summary.paidCount}</div>
            <div className={styles.summaryLabel}>To&#39;langan hisoblar</div>
          </div>
        </div>
      </div>

      <form className={styles.filterBar} action="/dashboard/dormitory/payments" method="GET">
        <input
          className={styles.searchInput}
          type="text"
          name="search"
          placeholder="Talaba ismi yoki xona bo'yicha qidirish..."
          defaultValue={searchParams.search}
        />
        <select className={styles.select} name="status" defaultValue={searchParams.status ?? ''}>
          <option value="">Barcha holatlar</option>
          <option value="UNPAID">To&#39;lanmagan</option>
          <option value="OVERDUE">Muddati o&#39;tgan</option>
          <option value="PAID">To&#39;langan</option>
        </select>
        <button type="submit" className={styles.btnApply}>
          Qo&#39;llash
        </button>
      </form>

      {invoices.length === 0 ? (
        <div className={styles.empty}>Hisob-fakturalar topilmadi.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Talaba</th>
                <th>Joylashuv</th>
                <th>Tavsif</th>
                <th>Summa</th>
                <th>Muddati</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const Icon = STATUS_ICON[invoice.status];
                return (
                  <tr key={invoice.id}>
                    <td className={styles.studentName}>{invoice.studentName}</td>
                    <td>{invoice.roomLabel || <span className={styles.muted}>—</span>}</td>
                    <td>{invoice.title}</td>
                    <td className={styles.amount}>{formatSum(invoice.amount)}</td>
                    <td className={styles.muted}>{formatDate(invoice.dueDate)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status${invoice.status}`]}`}>
                        <Icon size={11} /> {STATUS_TEXT[invoice.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

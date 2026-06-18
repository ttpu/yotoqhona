'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, DoorOpen, LogOut, X } from 'lucide-react';
import StatusBadge from '@/components/dormitory/status-badge';
import { formatDate } from '@/lib/dormitory-labels';
import type { AdminBookingRow } from '@/lib/dormitory-store';
import type { BookingStatus } from '@/lib/dormitory-types';
import styles from './students.module.css';

export default function StudentsTable({ rows }: { rows: AdminBookingRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(bookingId: string, status: BookingStatus) {
    setBusyId(bookingId);
    try {
      await fetch(`/api/dormitory/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return <div className={styles.empty}>Hech kim topilmadi.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Talaba</th>
            <th>Fakultet / Kurs</th>
            <th>Joylashuv</th>
            <th>Holat</th>
            <th>So&#39;rov sanasi</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const busy = busyId === row.id;
            return (
              <tr key={row.id}>
                <td className={styles.studentName}>{row.studentName}</td>
                <td>
                  {row.studentFaculty || <span className={styles.muted}>—</span>}
                  {row.studentCourse ? `, ${row.studentCourse}-kurs` : ''}
                </td>
                <td className={styles.roomCell}>
                  {row.floorNumber}-qavat · {row.roomNumber}-xona · {row.bedSlot}-o&#39;rin
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className={styles.muted}>{formatDate(row.requestedAt)}</td>
                <td>
                  <div className={styles.actionsCell}>
                    {row.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          className={`${styles.btnSm} ${styles.btnApproveSm}`}
                          disabled={busy}
                          onClick={() => setStatus(row.id, 'APPROVED')}
                        >
                          <Check size={12} /> Tasdiqlash
                        </button>
                        <button
                          type="button"
                          className={`${styles.btnSm} ${styles.btnRejectSm}`}
                          disabled={busy}
                          onClick={() => setStatus(row.id, 'REJECTED')}
                        >
                          <X size={12} /> Rad etish
                        </button>
                      </>
                    )}
                    {row.status === 'APPROVED' && (
                      <button
                        type="button"
                        className={`${styles.btnSm} ${styles.btnCheckinSm}`}
                        disabled={busy}
                        onClick={() => setStatus(row.id, 'CHECKED_IN')}
                      >
                        <DoorOpen size={12} /> Joylashtirish
                      </button>
                    )}
                    {row.status === 'CHECKED_IN' && (
                      <button
                        type="button"
                        className={`${styles.btnSm} ${styles.btnCheckoutSm}`}
                        disabled={busy}
                        onClick={() => setStatus(row.id, 'CHECKED_OUT')}
                      >
                        <LogOut size={12} /> Chiqarish
                      </button>
                    )}
                    {(row.status === 'REJECTED' || row.status === 'CHECKED_OUT') && (
                      <span className={styles.muted}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

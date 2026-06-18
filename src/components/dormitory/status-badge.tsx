import { Check, Clock, DoorOpen, LogOut, X } from 'lucide-react';
import { BOOKING_STATUS_LABELS } from '@/lib/dormitory-labels';
import type { BookingStatus } from '@/lib/dormitory-types';
import styles from './status-badge.module.css';

const STATUS_ICON: Record<BookingStatus, typeof Check> = {
  PENDING: Clock,
  APPROVED: Check,
  CHECKED_IN: DoorOpen,
  REJECTED: X,
  CHECKED_OUT: LogOut
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, tone } = BOOKING_STATUS_LABELS[status];
  const Icon = STATUS_ICON[status];

  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CheckCircle2, Clock, DoorOpen, XCircle } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import {
  getAnyBuilding,
  getFloors,
  getRoomsWithBookings,
  getStudentActiveBooking
} from '@/lib/dormitory-store';
import { BOOKING_STATUS_LABELS, formatDate } from '@/lib/dormitory-labels';
import BookingFlow from './booking-flow';
import styles from './book.module.css';

const STATUS_ICON = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  CHECKED_IN: DoorOpen,
  REJECTED: XCircle,
  CHECKED_OUT: XCircle
};

export default async function BookDormitoryPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'STUDENT') redirect('/');

  const activeBooking = await getStudentActiveBooking(sessionUser.id);

  if (activeBooking) {
    const Icon = STATUS_ICON[activeBooking.status];
    return (
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Mening yashash joyim</h1>
          <p className={styles.subtitle}>Yotoqxonaga joylashish so&#39;rovingiz holati.</p>
        </div>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <Icon size={28} />
          </div>
          <p className={styles.statusTitle}>{BOOKING_STATUS_LABELS[activeBooking.status].label}</p>
          <p className={styles.statusMeta}>
            So&#39;rov sanasi: {formatDate(activeBooking.requestedAt)}
          </p>
          <div className={styles.statusDetails}>
            <div className={styles.statusDetailItem}>
              <div className={styles.statusDetailValue}>{activeBooking.floorNumber}</div>
              <div className={styles.statusDetailLabel}>Qavat</div>
            </div>
            <div className={styles.statusDetailItem}>
              <div className={styles.statusDetailValue}>{activeBooking.roomNumber}</div>
              <div className={styles.statusDetailLabel}>Xona</div>
            </div>
            <div className={styles.statusDetailItem}>
              <div className={styles.statusDetailValue}>{activeBooking.bedSlot}</div>
              <div className={styles.statusDetailLabel}>O&#39;rin</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const building = await getAnyBuilding();
  if (!building) {
    return (
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Mening yashash joyim</h1>
        </div>
        <p className={styles.subtitle}>Hozircha yotoqxona ma&#39;lumotlari kiritilmagan.</p>
      </div>
    );
  }

  const allFloors = await getFloors(building.id);
  const matchingFloors = sessionUser.gender
    ? allFloors.filter((f) => f.genderPolicy === sessionUser.gender)
    : allFloors;

  const floorsWithRooms = await Promise.all(
    matchingFloors.map(async (floor) => {
      const rooms = await getRoomsWithBookings(building.id, floor.floorNumber);
      return {
        floorNumber: floor.floorNumber,
        genderPolicy: floor.genderPolicy,
        rooms: rooms.map((r) => ({
          id: r.id,
          roomNumber: r.roomNumber,
          capacity: r.capacity,
          occupiedCount: r.occupiedCount,
          freeCount: r.freeCount
        }))
      };
    })
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Yotoqxonaga joylashish</h1>
        <p className={styles.subtitle}>{building.name} — qavat va xonani tanlang.</p>
      </div>
      <BookingFlow floors={floorsWithRooms} />
    </div>
  );
}

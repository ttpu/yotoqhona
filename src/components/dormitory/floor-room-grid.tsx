'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, LogOut, User, X } from 'lucide-react';
import type { BedGender, BookingStatus, RoomWithBookings } from '@/lib/dormitory-types';
import StatusBadge from '@/components/dormitory/status-badge';
import styles from './floor-room-grid.module.css';

type FloorRoomGridProps = {
  rooms: RoomWithBookings[];
  genderPolicy: BedGender;
};

export default function FloorRoomGrid({ rooms }: FloorRoomGridProps) {
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedRoomId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function setStatus(bookingId: string, status: BookingStatus) {
    setBusyBookingId(bookingId);
    try {
      await fetch(`/api/dormitory/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      router.refresh();
    } finally {
      setBusyBookingId(null);
    }
  }

  return (
    <>
      <div className={styles.roomGrid}>
        {rooms.map((room) => {
          const hasPending = room.bookings.some((b) => b.status === 'PENDING');
          return (
            <button
              key={room.id}
              type="button"
              className={`${styles.roomCard} ${room.freeCount === 0 ? styles.roomCardFull : ''} ${room.occupiedCount === 0 ? styles.roomCardEmpty : ''}`}
              onClick={() => setSelectedRoomId(room.id)}
            >
              {hasPending && <span className={styles.pendingDot} />}
              <div className={styles.roomNumber}>{room.roomNumber}</div>
              <div className={styles.bedDots}>
                {Array.from({ length: room.capacity }, (_, i) => {
                  const slot = i + 1;
                  const booking = room.bookings.find((b) => b.bedSlot === slot);
                  const cls = booking?.status === 'PENDING' ? styles.bedDotPending : booking ? styles.bedDotFilled : '';
                  return <span key={slot} className={`${styles.bedDot} ${cls}`} />;
                })}
              </div>
              <div className={styles.occupancyText}>{room.occupiedCount}/{room.capacity} band</div>
            </button>
          );
        })}
      </div>

      {selectedRoom && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedRoomId(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <div>
                <p className={styles.drawerTitle}>{selectedRoom.roomNumber}-xona</p>
              </div>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedRoomId(null)}>
                <X size={16} />
              </button>
            </div>
            <p className={styles.drawerSubtitle}>
              {selectedRoom.bedsCount} krovat · {selectedRoom.nightstandsCount} tumbochka · {selectedRoom.wardrobesCount} shkaf
            </p>

            {Array.from({ length: selectedRoom.capacity }, (_, i) => {
              const slot = i + 1;
              const booking = selectedRoom.bookings.find((b) => b.bedSlot === slot);
              const busy = booking ? busyBookingId === booking.id : false;

              return (
                <div key={slot} className={styles.bedCard}>
                  <div className={styles.bedCardHead}>
                    <span className={styles.bedLabel}>
                      <span className={styles.bedNum}>{slot}</span>
                      {slot}-o&#39;rin
                    </span>
                    {booking && <StatusBadge status={booking.status} />}
                  </div>

                  {!booking ? (
                    <div className={styles.emptyBed}>
                      <User size={14} /> Bo&#39;sh joy
                    </div>
                  ) : (
                    <>
                      <p className={styles.studentName}>{booking.studentName}</p>
                      <p className={styles.studentMeta}>
                        {[booking.studentFaculty, booking.studentCourse ? `${booking.studentCourse}-kurs` : null]
                          .filter(Boolean)
                          .join(' · ') || 'Maʻlumot kiritilmagan'}
                      </p>

                      {booking.status === 'PENDING' && (
                        <div className={styles.actionRow}>
                          <button
                            type="button"
                            className={styles.btnApprove}
                            disabled={busy}
                            onClick={() => setStatus(booking.id, 'APPROVED')}
                          >
                            <Check size={13} /> Tasdiqlash
                          </button>
                          <button
                            type="button"
                            className={styles.btnReject}
                            disabled={busy}
                            onClick={() => setStatus(booking.id, 'REJECTED')}
                          >
                            <X size={13} /> Rad etish
                          </button>
                        </div>
                      )}

                      {booking.status === 'APPROVED' && (
                        <div className={styles.actionRow}>
                          <button
                            type="button"
                            className={styles.btnCheckin}
                            disabled={busy}
                            onClick={() => setStatus(booking.id, 'CHECKED_IN')}
                          >
                            <Check size={13} /> Joylashtirish
                          </button>
                        </div>
                      )}

                      {booking.status === 'CHECKED_IN' && (
                        <div className={styles.actionRow}>
                          <button
                            type="button"
                            className={styles.btnCheckout}
                            disabled={busy}
                            onClick={() => setStatus(booking.id, 'CHECKED_OUT')}
                          >
                            <LogOut size={13} /> Chiqarish
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

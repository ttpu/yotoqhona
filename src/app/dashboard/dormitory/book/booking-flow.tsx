'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bed, CheckCircle2 } from 'lucide-react';
import { GENDER_LABELS } from '@/lib/dormitory-labels';
import type { BedGender } from '@/lib/dormitory-types';
import styles from './book.module.css';

type RoomOption = {
  id: string;
  roomNumber: string;
  capacity: number;
  occupiedCount: number;
  freeCount: number;
};

type FloorOption = {
  floorNumber: number;
  genderPolicy: BedGender;
  rooms: RoomOption[];
};

export default function BookingFlow({ floors }: { floors: FloorOption[] }) {
  const router = useRouter();
  const [floorNumber, setFloorNumber] = useState<number | null>(null);
  const [confirmRoom, setConfirmRoom] = useState<RoomOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedFloor = floors.find((f) => f.floorNumber === floorNumber) ?? null;

  async function confirmBooking() {
    if (!confirmRoom) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dormitory/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: confirmRoom.id })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Xatolik yuz berdi');
        setConfirmRoom(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  if (floors.length === 0) {
    return <div className={styles.errorBanner}>Sizning jinsingiz uchun mos qavat topilmadi.</div>;
  }

  return (
    <div>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.steps}>
        <span className={`${styles.stepChip} ${!selectedFloor ? styles.stepChipActive : styles.stepChipDone}`}>
          1. Qavat
        </span>
        <span className={styles.stepArrow}>→</span>
        <span className={`${styles.stepChip} ${selectedFloor ? styles.stepChipActive : ''}`}>2. Xona</span>
      </div>

      {!selectedFloor ? (
        <div className={styles.floorGrid}>
          {floors.map((floor) => {
            const totalFree = floor.rooms.reduce((sum, r) => sum + r.freeCount, 0);
            return (
              <button
                key={floor.floorNumber}
                type="button"
                className={styles.floorOption}
                onClick={() => setFloorNumber(floor.floorNumber)}
              >
                <div className={styles.floorOptionNum}>{floor.floorNumber}-qavat</div>
                <div className={styles.floorOptionMeta}>
                  {GENDER_LABELS[floor.genderPolicy]} · {totalFree} bo&#39;sh joy
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button type="button" className={styles.backBtn} onClick={() => setFloorNumber(null)}>
            <ArrowLeft size={14} /> Qavatni o&#39;zgartirish
          </button>
          <div className={styles.roomGrid}>
            {selectedFloor.rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={styles.roomOption}
                disabled={room.freeCount === 0}
                onClick={() => setConfirmRoom(room)}
              >
                <div className={styles.roomOptionNum}>{room.roomNumber}</div>
                {room.freeCount > 0 ? (
                  <div className={styles.roomOptionFree}>{room.freeCount} bo&#39;sh</div>
                ) : (
                  <div className={styles.roomOptionFull}>To&#39;la</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {confirmRoom && (
        <div className={styles.modalOverlay} onClick={() => !loading && setConfirmRoom(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <Bed size={24} />
            </div>
            <h3 className={styles.modalTitle}>
              {selectedFloor?.floorNumber}-qavat, {confirmRoom.roomNumber}-xona
            </h3>
            <p className={styles.modalText}>
              Bu xonaga joylashish uchun so&#39;rov yuborilsin. Universitet ma&#39;muriyati so&#39;rovingizni
              ko&#39;rib chiqib tasdiqlaydi.
            </p>
            <div className={styles.modalBtns}>
              <button type="button" className={styles.modalBtnCancel} onClick={() => setConfirmRoom(null)} disabled={loading}>
                Bekor qilish
              </button>
              <button type="button" className={styles.modalBtnConfirm} onClick={confirmBooking} disabled={loading}>
                {loading ? (
                  'Yuborilmoqda...'
                ) : (
                  <>
                    <CheckCircle2 size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    So&#39;rov yuborish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

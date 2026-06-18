import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { Building2, Clock, DoorOpen, Home, Users, Wifi } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getBuildingByUniversityId, getOccupancySummary } from '@/lib/dormitory-store';
import { GENDER_LABELS } from '@/lib/dormitory-labels';
import styles from './dormitory.module.css';

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  "Sport maydonchasi": Users,
  "Coworking zona": Building2,
  "Bepul Wi-Fi": Wifi
};

export default async function DormitoryOverviewPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'UNIVERSITY_PROVIDER') redirect('/');

  const building = await getBuildingByUniversityId(sessionUser.id);

  if (!building) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><Home size={40} /></div>
          <p>Hozircha yotoqxona ma&#39;lumotlari kiritilmagan.</p>
        </div>
      </div>
    );
  }

  const summary = await getOccupancySummary(building.id);
  const occupancyPct = summary.totalBeds ? Math.round((summary.occupiedBeds / summary.totalBeds) * 100) : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.headerCard}>
        <div>
          <h1>{building.name}</h1>
          <p className={styles.headerAddress}>{building.address}</p>
          <div className={styles.amenityRow}>
            {building.amenities.map((a) => {
              const Icon = AMENITY_ICONS[a] ?? Wifi;
              return (
                <span key={a} className={styles.amenityChip}>
                  <Icon size={13} /> {a}
                </span>
              );
            })}
          </div>
        </div>
        <Link href={'/dashboard/dormitory/students' as Route} className={styles.headerLink}>
          <Users size={15} /> Talabalar ro&#39;yxati
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} blue`}><Building2 size={18} /></div>
          <div>
            <div className={styles.statValue}>{summary.totalRooms}</div>
            <div className={styles.statLabel}>Jami xonalar</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} purple`}><Home size={18} /></div>
          <div>
            <div className={styles.statValue}>{summary.totalBeds}</div>
            <div className={styles.statLabel}>Jami o&#39;rinlar</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} green`}><DoorOpen size={18} /></div>
          <div>
            <div className={styles.statValue}>{summary.occupiedBeds} <span style={{ fontSize: 12, color: '#999' }}>({occupancyPct}%)</span></div>
            <div className={styles.statLabel}>Band o&#39;rinlar</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} gray`}><Users size={18} /></div>
          <div>
            <div className={styles.statValue}>{summary.freeBeds}</div>
            <div className={styles.statLabel}>Bo&#39;sh o&#39;rinlar</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} yellow`}><Clock size={18} /></div>
          <div>
            <div className={styles.statValue}>{summary.pendingRequests}</div>
            <div className={styles.statLabel}>Kutilayotgan so&#39;rovlar</div>
          </div>
        </div>
      </div>

      <div className={styles.sectionHead}>
        <h2>Qavatlar</h2>
      </div>
      <div className={styles.floorGrid}>
        {summary.byFloor.map((floor) => {
          const pct = floor.totalBeds ? Math.round((floor.occupiedBeds / floor.totalBeds) * 100) : 0;
          return (
            <Link
              key={floor.floorNumber}
              href={`/dashboard/dormitory/floor/${floor.floorNumber}` as Route}
              className={styles.floorCard}
            >
              <div className={styles.floorCardHead}>
                <span className={styles.floorNum}>{floor.floorNumber}-qavat</span>
                <span className={`${styles.genderBadge} ${styles[floor.genderPolicy]}`}>
                  {GENDER_LABELS[floor.genderPolicy]}
                </span>
              </div>
              <div className={styles.occupancyBarTrack}>
                <div className={styles.occupancyBarFill} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.floorMeta}>
                <span>{floor.roomCount} xona</span>
                <span>{floor.occupiedBeds}/{floor.totalBeds} band</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

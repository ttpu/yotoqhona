import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Refrigerator, ShowerHead, Sparkles, Toilet, Utensils, WashingMachine } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getBuildingByUniversityId, getFloor, getRoomsWithBookings } from '@/lib/dormitory-store';
import { GENDER_LABELS } from '@/lib/dormitory-labels';
import FloorRoomGrid from '@/components/dormitory/floor-room-grid';
import styles from '../../dormitory.module.css';
import floorStyles from './floor.module.css';

export default async function DormitoryFloorPage({ params }: { params: { floor: string } }) {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'UNIVERSITY_PROVIDER') redirect('/');

  const building = await getBuildingByUniversityId(sessionUser.id);
  if (!building) redirect('/dashboard/dormitory');

  const floorNumber = Number(params.floor);
  const floor = await getFloor(building.id, floorNumber);
  if (!floor) return notFound();

  const rooms = await getRoomsWithBookings(building.id, floorNumber);

  return (
    <div className={styles.wrap}>
      <Link href={'/dashboard/dormitory' as Route} className={styles.backLink}>
        <ArrowLeft size={14} /> Yotoqxonaga qaytish
      </Link>

      <div className={floorStyles.floorHead}>
        <div>
          <h1 className={floorStyles.title}>{floorNumber}-qavat</h1>
          <span className={`${styles.genderBadge} ${styles[floor.genderPolicy]}`}>
            {GENDER_LABELS[floor.genderPolicy]} uchun
          </span>
        </div>
      </div>

      <div className={floorStyles.facilitiesRow}>
        <div className={floorStyles.facilityItem}>
          <Utensils size={15} /> {floor.facilities.diningHalls} oshxona
        </div>
        <div className={floorStyles.facilityItem}>
          <Refrigerator size={15} /> {floor.facilities.fridges} muzlatgich
        </div>
        <div className={floorStyles.facilityItem}>
          <Sparkles size={15} /> {floor.facilities.microwaves} mikroto&#39;lqinli pech
        </div>
        <div className={floorStyles.facilityItem}>
          <ShowerHead size={15} /> {floor.facilities.showerStalls} dush kabinasi
        </div>
        <div className={floorStyles.facilityItem}>
          <Toilet size={15} /> {floor.facilities.toiletStalls} hojatxona kabinasi
        </div>
        <div className={floorStyles.facilityItem}>
          <WashingMachine size={15} /> {floor.facilities.washingMachines} kir yuvish mashinasi
        </div>
      </div>

      <FloorRoomGrid rooms={rooms} genderPolicy={floor.genderPolicy} />
    </div>
  );
}

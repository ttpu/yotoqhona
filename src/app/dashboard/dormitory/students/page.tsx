import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { parseSessionCookie } from '@/lib/session';
import { getAllBookingsForAdmin, getBuildingByUniversityId, getFloors } from '@/lib/dormitory-store';
import { BOOKING_STATUS_LABELS } from '@/lib/dormitory-labels';
import type { BookingStatus } from '@/lib/dormitory-types';
import StudentsTable from './students-table';
import dormStyles from '../dormitory.module.css';
import styles from './students.module.css';

type SearchParams = {
  search?: string;
  status?: string;
  floor?: string;
};

export default async function DormitoryStudentsPage({ searchParams }: { searchParams: SearchParams }) {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'UNIVERSITY_PROVIDER') redirect('/');

  const building = await getBuildingByUniversityId(sessionUser.id);
  if (!building) redirect('/dashboard/dormitory');

  const floors = await getFloors(building.id);
  const rows = await getAllBookingsForAdmin(building.id, {
    search: searchParams.search,
    status: (searchParams.status as BookingStatus) || undefined,
    floorNumber: searchParams.floor ? Number(searchParams.floor) : undefined
  });

  return (
    <div className={dormStyles.wrap}>
      <Link href={'/dashboard/dormitory' as Route} className={dormStyles.backLink}>
        <ArrowLeft size={14} /> Yotoqxonaga qaytish
      </Link>

      <div className={styles.heading}>
        <h1 className={styles.title}>Talabalar ro&#39;yxati</h1>
        <p className={styles.subtitle}>Barcha bron va yashash holatlarini shu yerdan boshqaring.</p>
      </div>

      <form className={styles.filterBar} action="/dashboard/dormitory/students" method="GET">
        <input
          className={styles.searchInput}
          type="text"
          name="search"
          placeholder="Ism, xona yoki fakultet bo'yicha qidirish..."
          defaultValue={searchParams.search}
        />
        <select className={styles.select} name="floor" defaultValue={searchParams.floor ?? ''}>
          <option value="">Barcha qavatlar</option>
          {floors.map((f) => (
            <option key={f.floorNumber} value={f.floorNumber}>
              {f.floorNumber}-qavat
            </option>
          ))}
        </select>
        <select className={styles.select} name="status" defaultValue={searchParams.status ?? ''}>
          <option value="">Barcha holatlar</option>
          {Object.entries(BOOKING_STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.btnApply}>
          Qo&#39;llash
        </button>
      </form>

      <StudentsTable rows={rows} />
    </div>
  );
}

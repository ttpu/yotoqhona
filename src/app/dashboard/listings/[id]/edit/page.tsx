import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { parseSessionCookie } from '@/lib/session';
import { getListingById } from '@/lib/listings-store';
import ListingForm from '@/components/listing-form';

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);
  if (!sessionUser) redirect('/auth/login');

  const listing = await getListingById(params.id);
  if (!listing) return notFound();

  const canManage = sessionUser.role === 'UNIVERSITY_PROVIDER' || sessionUser.id === listing.ownerId;
  if (!canManage) redirect('/dashboard/listings');

  return <ListingForm mode="edit" listingId={listing.id} initialValues={listing} />;
}

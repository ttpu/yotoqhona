import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseSessionCookie } from '@/lib/session';
import ListingForm from '@/components/listing-form';

export default function NewListingPage() {
  const sessionUser = parseSessionCookie(cookies().get('talabajoy_session')?.value);

  if (!sessionUser) redirect('/auth/login');
  if (sessionUser.role !== 'UNIVERSITY_PROVIDER' && sessionUser.role !== 'PRIVATE_PROVIDER') {
    redirect('/');
  }

  return <ListingForm mode="create" />;
}

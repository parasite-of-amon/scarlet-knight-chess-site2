import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEvents } from '@/lib/supabase/queries';
import { AdminDashboardClient } from './client';

export const metadata = {
  title: 'Admin Dashboard | Rutgers Chess Club',
  description: 'Manage chess events and tournaments',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const events = await getEvents();

  return <AdminDashboardClient initialEvents={events} user={user} />;
}

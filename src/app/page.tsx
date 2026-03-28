import { DashboardClient } from '@/components/DashboardClient';
import { getFullSchedule } from '@/lib/scheduleProcessor';
import { fetchOwnedTracks } from '@/lib/iracing-api';

export default async function DashboardPage() {
  const schedule = getFullSchedule();
  const ownedTracks = await fetchOwnedTracks();

  return (
    <DashboardClient 
      schedule={schedule}
      ownedTracks={ownedTracks}
    />
  );
}

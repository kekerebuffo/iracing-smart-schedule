import { DashboardClient } from '@/components/DashboardClient';
import { getFullSchedule } from '@/lib/scheduleProcessor';
import { fetchOwnedTracks } from '@/lib/iracing-api';
import { getFreeContent } from '@/lib/dataService';

export default async function DashboardPage() {
  const schedule = getFullSchedule();
  const ownedTracks = await fetchOwnedTracks();
  const { freeCars, freeTracks } = await getFreeContent();

  return (
    <DashboardClient 
      schedule={schedule}
      ownedTracks={ownedTracks}
      freeCars={freeCars}
      freeTracks={freeTracks}
    />
  );
}

import { DashboardClient } from '@/components/DashboardClient';
import { getFullSchedule } from '@/lib/scheduleProcessor';
import { fetchOwnedTracks } from '@/lib/iracing-api';
import { getFreeContent } from '@/lib/dataService';

export default async function PlannerPage() {
  const schedule = getFullSchedule();
  const ownedTracks = await fetchOwnedTracks();
  const { freeCars, freeTracks } = await getFreeContent();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">Planificador de Temporada</h1>
      </div>
      
      <DashboardClient 
        schedule={schedule}
        ownedTracks={ownedTracks}
        freeCars={freeCars}
        freeTracks={freeTracks}
        initialView="matrix"
        hideHeader={true}
      />
    </div>
  );
}

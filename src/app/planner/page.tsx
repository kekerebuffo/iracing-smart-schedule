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
        <p className="text-zinc-400 font-medium max-w-2xl">
          Marca tus **Series Favoritas** con la estrella para poder hacer un seguimiento detallado en el resto de las funciones de la app.
        </p>
      </div>
      
      <DashboardClient 
        schedule={schedule}
        ownedTracks={ownedTracks}
        freeCars={freeCars}
        freeTracks={freeTracks}
        initialView="matrix"
      />
    </div>
  );
}

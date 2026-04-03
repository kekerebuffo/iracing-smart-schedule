import { DashboardClient } from '@/components/DashboardClient';
import { getFullSchedule } from '@/lib/scheduleProcessor';
import { fetchOwnedTracks } from '@/lib/iracing-api';
import { getFreeContent } from '@/lib/dataService';
import { getIRacingWeek, getSeasonInfo } from '@/lib/dateUtils';
import { Calendar } from 'lucide-react';

export default async function PlannerPage() {
  const schedule = getFullSchedule();
  const ownedTracks = await fetchOwnedTracks();
  const { freeCars, freeTracks } = await getFreeContent();
  const seasonInfo = getSeasonInfo();
  const currentWeek = getIRacingWeek();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/50 pb-6 mb-2">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Planificador de Temporada</h1>
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl">
          <div className="bg-blue-600/20 p-1.5 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{seasonInfo}</span>
            <span className="text-white font-black text-sm uppercase italic">Semana {currentWeek}</span>
          </div>
        </div>
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

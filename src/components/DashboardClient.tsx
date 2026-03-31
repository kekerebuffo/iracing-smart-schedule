'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { FilterBar } from '@/components/filters/FilterBar';
import { SeriesCard } from '@/components/ui/SeriesCard';
import { PlannerMatrix } from '@/components/planner/PlannerMatrix';
import { IRacingSeries, getCurrentWeek } from '@/lib/scheduleProcessor';
import { isTuesdayAlertActive, getIRacingWeek, getSeasonInfo } from '@/lib/dateUtils';
import { Calendar, LayoutGrid, TableProperties, Car, Map } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  schedule: IRacingSeries[];
  ownedTracks: number[]; 
  freeCars: string[];
  freeTracks: string[];
  initialView?: 'matrix' | 'cards';
}

export function DashboardClient({ schedule, freeCars = [], freeTracks = [], initialView = 'cards' }: Props) {
  const { t } = useLanguageStore();
  const { 
    ownedOnly, ownedCarsOnly, 
    showOnlyOwned, ownedCars, ownedTracks,
    licenses, types, favorites, toggleFavorite 
  } = useFilterStore();
  
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>(initialView);

  const alertActive = isTuesdayAlertActive();
  const currentIRacingWeek = getIRacingWeek();
  const seasonInfo = getSeasonInfo();

  const isTrackOwned = (trackName: string) => {
    if (ownedTracks.includes(trackName)) return true;
    if (freeTracks.some(t => trackName.includes(t) || t.includes(trackName))) return true;
    
    // Heuristic for "free" tracks if not in strict mode (legacy fallback)
    if (!showOnlyOwned) {
      const legacyFreeTracks = ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'];
      if (legacyFreeTracks.some(t => trackName.includes(t))) return true;
    }
    return false;
  };

  const isCarOwned = (series: IRacingSeries) => {
    // A series is "owned" if at least one of its cars is owned
    if (series.cars && series.cars.some(c => ownedCars.includes(c))) return true;
    
    // Check against CSV free content
    if (series.cars && series.cars.some(c => freeCars.some(fc => c.includes(fc) || fc.includes(c)))) return true;
    if (freeCars.some(fc => series.seriesName.toLowerCase().includes(fc.toLowerCase()))) return true;

    // Heuristic for "free" cars if not in strict mode (legacy fallback)
    if (!showOnlyOwned) {
      const legacyFreeCars = ['Mazda', 'Mustang', 'Legends', 'Street Stock', 'Formula Vee', 'Formula 1600', 'Toyota', 'Clio'];
      if (legacyFreeCars.some(c => series.seriesName.toLowerCase().includes(c.toLowerCase()))) return true;
    }
    return false;
  };

  const filteredSchedule = schedule.filter(series => {
    if (licenses.length > 0 && !licenses.includes(series.license)) return false;
    if (types.length > 0 && !types.includes(series.category)) return false;
    
    const currentWk = getCurrentWeek(series);
    
    // Legacy generic filters
    if (ownedOnly && !showOnlyOwned && !isTrackOwned(currentWk.trackName)) return false;
    if (ownedCarsOnly && !showOnlyOwned && !isCarOwned(series)) return false;

    // Strict synced filters
    if (showOnlyOwned) {
      if (!isTrackOwned(currentWk.trackName)) return false;
      if (!isCarOwned(series)) return false;
    }

    return true;
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">{t('dashboard')}</h1>
          <p className="text-zinc-400 font-medium truncate max-w-md">
            {t('dashboard_desc').replace('{count}', filteredSchedule.length.toString())}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* My Cars / My Circuits quick links */}
          <Link
            href="/garage"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all text-sm font-bold"
          >
            <Car className="w-4 h-4 text-indigo-400" />
            Mis Coches
          </Link>
          <Link
            href="/garage"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all text-sm font-bold"
          >
            <Map className="w-4 h-4 text-teal-400" />
            Mis Circuitos
          </Link>

          {/* Season info pill */}
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{seasonInfo}</p>
              <p className="text-white font-black text-lg leading-none mt-1">{t('week')} {currentIRacingWeek}</p>
            </div>
          </div>
        </div>
      </div>


      {!initialView && (
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 shrink-0 w-fit mb-4">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'cards' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            {t('races_now')}
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'matrix' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            {t('planner')}
          </button>
        </div>
      )}
      
      <div className="flex-1 mb-8">
        <FilterBar />
      </div>

      {viewMode === 'matrix' ? (
        <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl overflow-hidden p-4 shadow-xl">
          <PlannerMatrix schedule={filteredSchedule} freeTracks={freeTracks} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredSchedule.map((series, idx) => {
          const currentWk = getCurrentWeek(series);
          const isFav = favorites.includes(series.seriesName);
          return (
            <SeriesCard 
              key={`${series.seriesName}-${idx}`} 
              series={series} 
              currentWeek={currentWk}
              isFavorite={isFav}
              onToggleFavorite={() => toggleFavorite(series.seriesName)}
              ownedCar={isCarOwned(series)}
              ownedTrack={isTrackOwned(currentWk.trackName)}
            />
          );
        })}
        {filteredSchedule.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 font-bold uppercase tracking-widest">{t('no_results')}</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

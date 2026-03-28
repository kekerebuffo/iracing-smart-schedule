'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { FilterBar } from '@/components/filters/FilterBar';
import { SeriesCard } from '@/components/ui/SeriesCard';
import { IRacingSeries, getCurrentWeek } from '@/lib/scheduleProcessor';
import { isTuesdayAlertActive } from '@/lib/dateUtils';
import { AlertTriangle } from 'lucide-react';

interface Props {
  schedule: IRacingSeries[];
  ownedTracks: number[]; 
}

export function DashboardClient({ schedule }: Props) {
  const { 
    ownedOnly, ownedCarsOnly, 
    showOnlyOwned, ownedCars, ownedTracks,
    licenses, types, favorites, toggleFavorite 
  } = useFilterStore();
  
  const alertActive = isTuesdayAlertActive();

  const isTrackOwned = (trackName: string) => {
    if (ownedTracks.includes(trackName)) return true;
    
    // Heuristic for "free" tracks if not in strict mode
    if (!showOnlyOwned) {
      const freeTracks = ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'];
      if (freeTracks.some(t => trackName.includes(t))) return true;
    }
    return false;
  };

  const isCarOwned = (series: IRacingSeries) => {
    // A series is "owned" if at least one of its cars is owned
    if (series.cars && series.cars.some(c => ownedCars.includes(c))) return true;
    
    // Heuristic for "free" cars if not in strict mode
    if (!showOnlyOwned) {
      const freeCars = ['Mazda', 'Mustang', 'Legends', 'Street Stock', 'Formula Vee', 'Formula 1600', 'Toyota', 'Clio'];
      if (freeCars.some(c => series.seriesName.includes(c))) return true;
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">Race Dashboard</h1>
          <p className="text-zinc-400 font-medium">Find your next race across {filteredSchedule.length} available active series.</p>
        </div>
      </div>

      {alertActive && (
        <div className="mb-8 bg-red-950/40 border border-red-900 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-red-900/50 p-2 rounded-lg shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold uppercase tracking-wider mb-1">Tuesday Season Reset Approaching</h3>
            <p className="text-red-200/80 text-sm">You are within 48 hours of the Tuesday 00:00 UTC track rotation. Prepare for next week's circuits!</p>
          </div>
        </div>
      )}

      <FilterBar />

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
              ownedTrack={isTrackOwned(currentWk.trackName)}
            />
          );
        })}
        {filteredSchedule.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 font-bold uppercase tracking-widest">No Series Match Your Filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

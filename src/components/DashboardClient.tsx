'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { FilterBar } from '@/components/filters/FilterBar';
import { SeriesCard } from '@/components/ui/SeriesCard';
import { IRacingSeries, getCurrentWeek } from '@/lib/scheduleProcessor';
import { isTuesdayAlertActive, getIRacingWeek, getSeasonInfo } from '@/lib/dateUtils';
import { AlertTriangle, Calendar } from 'lucide-react';

interface Props {
  schedule: IRacingSeries[];
  ownedTracks: number[]; 
  freeCars: string[];
  freeTracks: string[];
}

export function DashboardClient({ schedule, freeCars = [], freeTracks = [] }: Props) {
  const { t } = useLanguageStore();
  const { 
    ownedOnly, ownedCarsOnly, 
    showOnlyOwned, ownedCars, ownedTracks,
    licenses, types, favorites, toggleFavorite 
  } = useFilterStore();
  
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

      {alertActive && (
        <div className="mb-8 bg-red-950/40 border border-red-900 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-red-900/50 p-2 rounded-lg shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold uppercase tracking-wider mb-1">{t('season_reset')}</h3>
            <p className="text-red-200/80 text-sm">{t('season_reset_desc')}</p>
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
    </div>
  );
}

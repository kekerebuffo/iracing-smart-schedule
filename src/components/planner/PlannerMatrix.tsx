'use client'

import { IRacingSeries, SeriesWeek } from '@/lib/scheduleProcessor';
import { useFilterStore } from '@/store/useFilterStore';
import { getIRacingWeek } from '@/lib/dateUtils';
import { useState } from 'react';
import { Star, StarOff } from 'lucide-react';
import { formatTrackName } from '@/lib/utils';

interface Props {
  schedule: IRacingSeries[];
  freeTracks: string[];
}

export function PlannerMatrix({ schedule, freeTracks = [] }: Props) {
  const currentWeekNum = getIRacingWeek();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const { 
    ownedTracks, wishlistTracks, favorites, toggleFavorite,
    ownedCars, showOnlyOwned 
  } = useFilterStore();

  const displayedSchedule = onlyFavorites
    ? schedule.filter(s => favorites.includes(s.seriesName))
    : schedule;

  const isFreeTrack = (trackName: string) => {
    if (freeTracks.some(t => trackName.includes(t) || t.includes(trackName))) return true;
    if (!showOnlyOwned) {
      const legacyFree = ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'];
      if (legacyFree.some(t => trackName.includes(t))) return true;
    }
    return false;
  };

  const isTrackOwned = (trackName: string) => ownedTracks.includes(trackName);
  const isTrackWishlist = (trackName: string) => wishlistTracks.includes(trackName);

  const getCellColor = (trackName: string) => {
    if (isFreeTrack(trackName)) return "bg-green-950/60 text-green-300 border-green-900/50 hover:bg-green-900/80";
    if (isTrackOwned(trackName)) return "bg-teal-950/60 text-teal-300 border-teal-900/50 hover:bg-teal-900/80";
    if (isTrackWishlist(trackName)) return "bg-blue-950/60 text-blue-300 border-blue-900/50 hover:bg-blue-900/80";
    return "bg-red-950/40 text-red-300 border-red-900/40 hover:bg-red-900/60 opacity-80";
  };

  return (
    <div className="w-full overflow-x-auto pb-6 custom-scrollbar animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
          {displayedSchedule.length} series · {onlyFavorites ? 'Solo Favoritas' : 'Todas'}
        </p>
        <button
          onClick={() => setOnlyFavorites(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm transition-all ${
            onlyFavorites
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-yellow-400 hover:border-yellow-500/50'
          }`}
        >
          {onlyFavorites ? <Star className="w-4 h-4" fill="currentColor" /> : <Star className="w-4 h-4" />}
          Solo Favoritas
        </button>
      </div>
      <div className="min-w-[1400px]">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-y border-zinc-800 text-zinc-400">
              <th className="py-3 px-4 font-bold uppercase tracking-wider w-10 text-center rounded-tl-xl border-l border-zinc-800 sticky left-0 z-30 bg-zinc-900">★</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider sticky left-14 z-30 bg-zinc-900 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">Series Name</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider w-16 text-center">Lic</th>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className={`py-3 px-2 font-bold uppercase tracking-wider text-center w-[6%] border-l border-zinc-800/50 ${currentWeekNum === i + 1 ? 'text-red-500 bg-red-950/20' : ''}`}>
                  W{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {displayedSchedule.map((series, idx) => {
              const isFav = favorites.includes(series.seriesName);
              // Map weeks 1-12
              const weeksMap = new Map<number, SeriesWeek>();
              if (series.weeks) {
                series.weeks.forEach(w => weeksMap.set(w.weekNum, w));
              }

              return (
                <tr key={`${series.seriesName}-${idx}`} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="py-2 px-4 text-center border-l border-zinc-800 sticky left-0 z-20 bg-zinc-950 group-hover:bg-zinc-800/90 transition-colors">
                    <button 
                      onClick={() => toggleFavorite(series.seriesName)}
                      className={`p-1 rounded hover:bg-zinc-700 transition ${isFav ? 'text-yellow-500' : 'text-zinc-600'}`}
                    >
                      <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="py-2 px-4 sticky left-14 z-20 bg-zinc-950 group-hover:bg-zinc-800/90 transition-colors shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    <p className="font-bold text-zinc-200 whitespace-normal min-w-[200px]" title={series.seriesName}>
                      {series.seriesName}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{series.category}</p>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-black ${
                      series.license.includes('Rookie') ? 'bg-red-900/40 text-red-500' : 
                      series.license.includes('D') ? 'bg-orange-900/40 text-orange-500' : 
                      series.license.includes('C') ? 'bg-yellow-900/40 text-yellow-500' : 
                      series.license.includes('B') ? 'bg-green-900/40 text-green-500' : 
                      'bg-blue-900/40 text-blue-500'
                    }`}>
                      {series.license.charAt(0)}
                    </span>
                  </td>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const weekData = weeksMap.get(i + 1);
                    const isCurrentWeek = currentWeekNum === i + 1;
                    
                    if (!weekData) {
                      return <td key={i} className={`py-1 px-1 border-l border-zinc-800/50 ${isCurrentWeek ? 'bg-red-950/20' : ''}`}></td>;
                    }

                    const tName = weekData.trackName;
                    const isHovered = hoveredTrack === tName;
                    const colorClasses = getCellColor(tName);
                    
                    return (
                      <td 
                        key={i} 
                        className={`py-1 px-1 border-l border-zinc-800/50 ${isCurrentWeek ? 'bg-red-950/10' : ''}`}
                      >
                        <div 
                          className={`
                            h-full min-h-[44px] rounded-md p-1.5 flex flex-col justify-center border transition-all duration-200 cursor-default
                            ${colorClasses}
                            ${isHovered ? 'ring-2 ring-white scale-[1.05] shadow-xl z-10 relative saturate-150' : ''}
                          `}
                          onMouseEnter={() => setHoveredTrack(tName)}
                          onMouseLeave={() => setHoveredTrack(null)}
                          title={`${tName} \nDuration: ${weekData.duration || tName}`}
                        >
                          <p className="text-[10px] font-bold uppercase truncate leading-tight">
                            {formatTrackName(tName)}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
{/* 
      Legend 
*/}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></div> Free Content</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-teal-500/20 border border-teal-500/50"></div> Owned</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div> Wishlist</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div> Unowned</span>
      </div>
    </div>
  );
}

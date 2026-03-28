'use client'

import { useState, useMemo } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { getFullSchedule, getCurrentWeek, IRacingSeries } from '@/lib/scheduleProcessor';
import { isTuesdayAlertActive } from '@/lib/dateUtils';
import { cn } from '@/components/layout/Sidebar';
import { Clock, Star, CalendarDays, ListTree, LayoutList, Timer, Thermometer, CloudRain, Flag, Car } from 'lucide-react';

export default function AgendaPage() {
  const { favorites, showOnlyOwned, ownedCars, ownedTracks } = useFilterStore();
  const schedule = getFullSchedule();
  const alertActive = isTuesdayAlertActive();
  const [viewMode, setViewMode] = useState<'series' | 'calendar'>('series');
  
  const isTrackOwned = (trackName: string) => {
    if (ownedTracks.includes(trackName)) return true;
    if (!showOnlyOwned) {
      const freeTracks = ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'];
      if (freeTracks.some(t => trackName.includes(t))) return true;
    }
    return false;
  };

  const isCarOwned = (series: IRacingSeries) => {
    if (series.cars && series.cars.some(c => ownedCars.includes(c))) return true;
    if (!showOnlyOwned) {
      const freeCars = ['Mazda', 'Mustang', 'Legends', 'Street Stock', 'Formula Vee', 'Formula 1600', 'Toyota', 'Clio'];
      if (freeCars.some(c => series.seriesName.includes(c))) return true;
    }
    return false;
  };

  const favoriteSeries = schedule.filter(s => {
    if (!favorites.includes(s.seriesName)) return false;
    if (showOnlyOwned && !isCarOwned(s)) return false;
    return true;
  });

  const allWeeks = favoriteSeries.flatMap(s => s.weeks.map(w => ({ series: s, week: w })));
  
  const filteredWeeks = allWeeks.filter(curr => {
    if (showOnlyOwned && !isTrackOwned(curr.week.trackName)) return false;
    return true;
  });

  const weeksGrouped = filteredWeeks.reduce((acc, curr) => {
    const key = curr.week.weekNum;
    if (!acc[key]) acc[key] = { weekNum: key, startDate: curr.week.startDate, events: [] };
    acc[key].events.push(curr);
    return acc;
  }, {} as Record<number, { weekNum: number, startDate: string, events: any[] }>);
  
  const calendarWeeks = Object.values(weeksGrouped).sort((a, b) => a.weekNum - b.weekNum);

  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">Favorite Agenda</h1>
          <p className="text-zinc-400 font-medium">Track the upcoming weeks for your favorite series.</p>
        </div>
        
        {favoriteSeries.length > 0 && (
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setViewMode('series')}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-md font-bold text-[11px] uppercase tracking-wider transition-all", viewMode === 'series' ? "bg-red-600 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300")}
            >
              <ListTree className="w-4 h-4" /> Series Layout
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-md font-bold text-[11px] uppercase tracking-wider transition-all", viewMode === 'calendar' ? "bg-red-600 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300")}
            >
              <CalendarDays className="w-4 h-4" /> Timeline Layout
            </button>
          </div>
        )}
      </div>

      {favoriteSeries.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
          <Star className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest">You have no favorited series yet.</p>
          <p className="text-sm text-zinc-600 mt-2">Go to the Dashboard and click the star icon on series you want to track.</p>
        </div>
      ) : (
        viewMode === 'series' ? (
          <div className="space-y-8">
            {favoriteSeries.map((series, idx) => {
              const currentWk = getCurrentWeek(series);
              return (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="bg-zinc-950/80 p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">{series.category}</span>
                      <h2 className="text-xl font-bold text-white">{series.seriesName}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-sm uppercase tracking-widest border border-zinc-700/50">
                        CLASS {series.license}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900 text-zinc-500 text-[10px] uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3 font-bold w-32">Week</th>
                          <th className="px-6 py-3 font-bold">Start Date</th>
                          <th className="px-6 py-3 font-bold">Track</th>
                          <th className="px-6 py-3 font-bold text-center w-48">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {series.weeks.map(wk => {
                          const isCurrent = wk.weekNum === currentWk.weekNum;
                          const isNext = wk.weekNum === currentWk.weekNum + 1;
                          
                          return (
                            <tr key={wk.weekNum} className={cn("transition-colors", isCurrent ? "bg-zinc-800/80" : "bg-zinc-900/40 hover:bg-zinc-800/50")}>
                              <td className="px-6 py-4 font-bold text-zinc-300">
                                Week {wk.weekNum}
                              </td>
                              <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                                {wk.startDate}
                              </td>
                              <td className={cn("px-6 py-4 font-medium", isCurrent ? "text-white" : "text-zinc-500")}>
                                {wk.trackName}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {isCurrent ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-950/40 px-2.5 py-1 rounded border border-green-900/50 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span> Active
                                  </span>
                                ) : isNext && alertActive ? (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded border border-orange-900/50 uppercase tracking-wider">
                                    <Clock className="w-3 h-3" /> Next Up (24h)
                                  </span>
                                ) : (
                                  <span className="text-xs text-zinc-700 font-bold uppercase tracking-wider">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6 relative ml-4 md:ml-12">
            <div className="absolute left-[-15px] md:left-2 top-0 bottom-0 w-px bg-zinc-800 -z-10" />
            
            {calendarWeeks.map((calWk, idx) => {
              const sampleSeries = calWk.events[0].series;
              const currentWk = getCurrentWeek(sampleSeries);
              const isCurrentWeek = calWk.weekNum === currentWk.weekNum;
              const isNextWeek = calWk.weekNum === currentWk.weekNum + 1;

              return (
                <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                  <div className="w-32 shrink-0 md:text-right pt-2 relative">
                    <div className={cn("absolute left-[-19px] md:auto md:right-[-37px] top-4 w-3 h-3 rounded-full border-2", isCurrentWeek ? "bg-red-500 border-red-500 shadow-[0_0_10px_#ef4444]" : "bg-zinc-950 border-zinc-700")} />
                    <div className={cn("text-xs font-bold uppercase tracking-widest", isCurrentWeek ? "text-red-400" : "text-zinc-500")}>
                      Week {calWk.weekNum}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{calWk.startDate}</div>
                    
                    {isCurrentWeek && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-bold text-green-400 uppercase tracking-wider">
                         Active
                      </span>
                    )}
                    {isNextWeek && alertActive && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-bold text-orange-400 uppercase tracking-wider">
                         <Clock className="w-2 h-2" /> 24h
                      </span>
                    )}
                  </div>
                  
                  <div className={cn("flex-1 p-5 rounded-xl border shadow-lg w-full", isCurrentWeek ? "border-red-900/50 bg-zinc-900/80" : "border-zinc-800/80 bg-zinc-900/30")}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {calWk.events.map((ev, i) => (
                        <div key={i} className="flex items-center gap-4 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                          <div className="w-10 h-10 rounded shrink-0 bg-zinc-900 flex items-center justify-center font-bold text-zinc-400 text-xs border border-zinc-800">
                            {ev.series.license}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest select-none truncate">{ev.series.seriesName}</div>
                            <div className="text-sm font-medium text-white max-w-full truncate mt-0.5">{ev.week.trackName}</div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {ev.week.duration && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                  <Timer className="w-3 h-3 text-blue-400" /> {ev.week.duration}
                                </div>
                              )}
                              {ev.week.temp && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                  <Thermometer className="w-3 h-3 text-orange-400" /> {ev.week.temp}
                                </div>
                              )}
                              {ev.week.rain && ev.week.rain.toLowerCase() !== 'none' && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                  <CloudRain className="w-3 h-3 text-cyan-400" /> {ev.week.rain}
                                </div>
                              )}
                              {ev.week.startType && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                  <Flag className="w-3 h-3 text-green-400" /> {ev.week.startType}
                                </div>
                              )}
                              {ev.series.cars && ev.series.cars.length > 0 && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider truncate max-w-[150px]">
                                  <Car className="w-3 h-3 text-purple-400" /> {ev.series.cars[0]}{ev.series.cars.length > 1 ? ` +${ev.series.cars.length - 1}` : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

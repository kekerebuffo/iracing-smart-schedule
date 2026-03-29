'use client'

import { IRacingSeries } from '@/lib/scheduleProcessor';
import { useFilterStore } from '@/store/useFilterStore';
import { ShoppingCart, Heart, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
  schedule: IRacingSeries[];
  freeTracks: string[];
}

export function ShopGuideClient({ schedule, freeTracks = [] }: Props) {
  const { favorites, ownedTracks, wishlistTracks, showOnlyOwned, toggleWishlistTrack, toggleOwnedTrack } = useFilterStore();
  
  // Calculate track frequencies in favorite series
  const trackStats = useMemo(() => {
    const stats: Record<string, { count: number, series: string[] }> = {};
    
    // Only analyze favorited series, unless none are favorited (then analyze all)
    const targetSeries = favorites.length > 0 
      ? schedule.filter(s => favorites.includes(s.seriesName))
      : schedule;

    targetSeries.forEach(series => {
      if (!series.weeks) return;
      series.weeks.forEach(wk => {
        const tName = wk.trackName;
        // Check if free
        const isFree = freeTracks.some(ft => tName.includes(ft) || ft.includes(tName)) ||
                       (!showOnlyOwned && ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'].some(ft => tName.includes(ft)));
        
        if (isFree) return; // Ignore free tracks from shop guide

        const isOwned = ownedTracks.includes(tName);
        if (isOwned) return; // Ignore owned tracks from shop guide recommendations
        
        if (!stats[tName]) {
          stats[tName] = { count: 0, series: [] };
        }
        stats[tName].count += 1;
        if (!stats[tName].series.includes(series.seriesName)) {
          stats[tName].series.push(series.seriesName);
        }
      });
    });

    // Sort by frequency
    return Object.entries(stats)
      .map(([trackName, data]) => ({ trackName, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [schedule, favorites, ownedTracks, freeTracks, showOnlyOwned]);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8 border-b border-zinc-800 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            Shop Guide
          </h1>
          <p className="text-zinc-400 mt-2">
            Optimiza tus compras. Analizamos tus Series Favoritas y te listamos qué pistas de pago usarás más veces en esta temporada.
          </p>
          {favorites.length === 0 && (
            <p className="text-orange-400 text-sm font-bold mt-2">
              ⚠️ No tienes Series Favoritas marcadas. Mostrando estadísticas de todo iRacing.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {trackStats.map((stat, idx) => {
          const isWishlist = wishlistTracks.includes(stat.trackName);
          return (
            <div 
              key={stat.trackName}
              className={`flex items-stretch justify-between rounded-xl border p-4 transition-colors ${
                isWishlist ? 'bg-blue-950/20 border-blue-900/50' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 text-zinc-300 w-8 h-8 rounded flex items-center justify-center font-black">
                    #{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">
                    {stat.trackName}
                  </h3>
                </div>
                
                <div className="mt-3 text-sm text-zinc-400">
                  <p className="font-bold text-zinc-500 mb-1 uppercase tracking-widest text-[10px]">Aparece en {stat.series.length} de tus series:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {stat.series.map(s => <li key={s} className="truncate max-w-[400px]">{s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 justify-between pl-4 border-l border-zinc-800/50">
                <div className="text-right">
                  <span className="text-3xl font-black text-white leading-none block">{stat.count}</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Semanas Totales</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlistTrack(stat.trackName)}
                    className={`p-2 rounded border font-bold text-xs uppercase transition-colors ${
                      isWishlist 
                      ? 'bg-blue-900 text-blue-200 border-blue-700 hover:bg-blue-800' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-blue-900/50 hover:text-blue-400'
                    }`}
                  >
                    {isWishlist ? 'En Wishlist' : 'A Wishlist'}
                  </button>
                  <button
                    onClick={() => toggleOwnedTrack(stat.trackName)}
                    className="p-2 rounded border border-teal-800/50 bg-teal-950/30 text-teal-400 hover:bg-teal-900/50 hover:text-teal-300 font-bold text-xs uppercase transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Comprado
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {trackStats.length === 0 && (
          <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest border border-dashed border-zinc-800 rounded-xl">
            No faltan pistas en tus series favoritas.
          </div>
        )}
      </div>
    </div>
  );
}

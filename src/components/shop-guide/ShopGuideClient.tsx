'use client'

import { IRacingSeries } from '@/lib/scheduleProcessor';
import { useFilterStore } from '@/store/useFilterStore';
import { TrendingUp, CheckCircle2, Heart, Minus } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  schedule: IRacingSeries[];
  freeTracks: string[];
}

export function ShopGuideClient({ schedule, freeTracks = [] }: Props) {
  const { favorites, ownedTracks, wishlistTracks, showOnlyOwned, toggleWishlistTrack, toggleOwnedTrack } = useFilterStore();

  const isFreeTrack = (trackName: string) => {
    if (freeTracks.some(ft => trackName.includes(ft) || ft.includes(trackName))) return true;
    if (!showOnlyOwned) {
      const legacyFree = ['Charlotte', 'USA International', 'Lanier', 'South Boston', 'Oulton', 'Tsukuba', 'Okayama', 'Summit Point', 'Lime Rock', 'Laguna Seca', 'Concord', 'Oxford', 'Centripetal'];
      if (legacyFree.some(ft => trackName.includes(ft))) return true;
    }
    return false;
  };

  // Calculate track frequencies — now also showing owned ones for reference
  const trackStats = useMemo(() => {
    const stats: Record<string, { count: number, series: string[] }> = {};

    const targetSeries = favorites.length > 0
      ? schedule.filter(s => favorites.includes(s.seriesName))
      : schedule;

    targetSeries.forEach(series => {
      if (!series.weeks) return;
      series.weeks.forEach(wk => {
        const tName = wk.trackName;
        if (isFreeTrack(tName)) return; // Free tracks don't need buying

        if (!stats[tName]) stats[tName] = { count: 0, series: [] };
        stats[tName].count += 1;
        if (!stats[tName].series.includes(series.seriesName)) {
          stats[tName].series.push(series.seriesName);
        }
      });
    });

    return Object.entries(stats)
      .map(([trackName, data]) => ({ trackName, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [schedule, favorites, ownedTracks, freeTracks, showOnlyOwned]);

  const getTrackState = (trackName: string) => {
    if (ownedTracks.includes(trackName)) return 'owned';
    if (wishlistTracks.includes(trackName)) return 'wishlist';
    return 'none';
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-white uppercase flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-500" />
          Optimizador de Compras
        </h1>
        <p className="text-zinc-400 mt-2">
          Analizamos tus Series Favoritas y te mostramos qué circuitos de pago usarás más veces esta temporada.
        </p>
        {favorites.length === 0 && (
          <p className="text-orange-400 text-sm font-bold mt-2">
            ⚠️ No tienes Series Favoritas marcadas. Mostrando estadísticas de todo iRacing.
          </p>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Ya lo tengo</span>
          <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-blue-400" /> Lista de Deseados</span>
          <span className="flex items-center gap-2"><Minus className="w-4 h-4 text-zinc-600" /> Sin marcar</span>
        </div>
      </div>

      <div className="grid gap-3">
        {trackStats.map((stat, idx) => {
          const state = getTrackState(stat.trackName);
          const isOwned = state === 'owned';
          const isWishlist = state === 'wishlist';

          return (
            <div
              key={stat.trackName}
              className={`flex items-stretch justify-between rounded-xl border p-4 transition-all ${
                isOwned
                  ? 'bg-teal-950/20 border-teal-800/50'
                  : isWishlist
                  ? 'bg-blue-950/20 border-blue-900/50'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 text-zinc-300 w-8 h-8 rounded flex items-center justify-center font-black text-sm shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold uppercase italic tracking-wider ${isOwned ? 'text-teal-400' : isWishlist ? 'text-blue-300' : 'text-white'}`}>
                      {stat.trackName}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      En {stat.series.length} serie{stat.series.length !== 1 ? 's' : ''} · {stat.count} semana{stat.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pl-11 text-sm text-zinc-500 flex flex-wrap gap-1">
                  {stat.series.map(s => (
                    <span key={s} className="bg-zinc-800/60 px-2 py-0.5 rounded text-[10px] truncate max-w-[220px]">{s}</span>
                  ))}
                </div>
              </div>

              {/* 3-state buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pl-4 border-l border-zinc-800/50 shrink-0">
                {/* Ya lo tengo */}
                <button
                  onClick={() => {
                    // If already owned, unmark it. Otherwise mark as owned (and remove from wishlist if it was there).
                    if (isOwned) {
                      toggleOwnedTrack(stat.trackName);
                    } else {
                      if (isWishlist) toggleWishlistTrack(stat.trackName); // remove from wishlist
                      toggleOwnedTrack(stat.trackName);
                    }
                  }}
                  title="Ya lo tengo"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-bold text-[10px] sm:text-xs uppercase transition-all w-full sm:w-auto justify-center ${
                    isOwned
                      ? 'bg-teal-600 border-teal-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-teal-600/60 hover:text-teal-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isOwned ? 'Tengo' : 'Ya lo tengo'}
                </button>

                {/* Lista de Deseados */}
                <button
                  onClick={() => {
                    if (isOwned) return; // Can't wishlist if already owned
                    toggleWishlistTrack(stat.trackName);
                  }}
                  title={isOwned ? 'Ya tienes esta pista' : 'Lista de Deseados'}
                  disabled={isOwned}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-bold text-[10px] sm:text-xs uppercase transition-all w-full sm:w-auto justify-center ${
                    isOwned
                      ? 'opacity-30 cursor-not-allowed bg-zinc-800 border-zinc-700 text-zinc-500'
                      : isWishlist
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-blue-600/60 hover:text-blue-400'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" fill={isWishlist && !isOwned ? 'currentColor' : 'none'} />
                  {isWishlist && !isOwned ? 'Deseado' : 'Lista de Deseados'}
                </button>
              </div>
            </div>
          );
        })}

        {trackStats.length === 0 && (
          <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest border border-dashed border-zinc-800 rounded-xl">
            ¡No faltan pistas en tus series favoritas! 🎉
          </div>
        )}
      </div>
    </div>
  );
}

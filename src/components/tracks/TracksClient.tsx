'use client'

import { useState } from 'react';
import { iRacingTrack } from '@/lib/dataService';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Search, Map, Ruler, Flag, Info, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/components/layout/Sidebar';

interface Props {
  tracks: iRacingTrack[];
}

export function TracksClient({ tracks }: Props) {
  const { t } = useLanguageStore();
  const [search, setSearch] = useState('');

  const filteredTracks = tracks.filter(track => {
    return track.track_name.toLowerCase().includes(search.toLowerCase()) || 
           track.location.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">{t('tracks')}</h1>
          <p className="text-zinc-400 font-medium">Browse the iRacing circuit database ({filteredTracks.length} configurations).</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tracks or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTracks.map((track) => (
          <Link 
            key={track.track_id} 
            href={`/tracks/${track.track_id}`}
            className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 flex flex-col"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-zinc-800 p-2 rounded-lg">
                  <Map className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    {track.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors uppercase leading-tight mb-1">
                {track.track_name}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mb-4 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {track.location}
              </p>

              <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800/50 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Length
                  </span>
                  <span className="text-zinc-300 font-mono">{track.track_config_length} miles</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Corners
                  </span>
                  <span className="text-zinc-300 font-mono">{track.corners_per_lap}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-zinc-800/50 bg-zinc-950/30 flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {track.free_with_subscription === 'TRUE' ? 'FREE' : track.price === '0' ? 'Free' : `$${track.price}`}
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Details <Info className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

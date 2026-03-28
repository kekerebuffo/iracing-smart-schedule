'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { cn } from '@/components/layout/Sidebar';
import { Car, Map, Check, ChevronRight, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { iRacingCar, iRacingTrack } from '@/lib/dataService';

interface Props {
  cars: iRacingCar[];
  tracks: iRacingTrack[];
}

export default function GarageClient({ cars, tracks }: Props) {
  const { ownedCars, ownedTracks, toggleOwnedCar, toggleOwnedTrack } = useFilterStore();
  const [activeTab, setActiveTab] = useState<'cars' | 'tracks'>('cars');
  const [searchQuery, setSearchQuery] = useState('');

  const groupedCars = useMemo(() => {
    const groups: Record<string, iRacingCar[]> = {};
    cars.forEach(car => {
      const cat = car.categories || 'Otros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(car);
    });
    return groups;
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter(c => 
      c.car_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.car_make.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cars, searchQuery]);

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => 
      t.track_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tracks, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <Car className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Mi Garaje</h1>
          </div>
          <p className="text-zinc-400 font-medium max-w-xl">
            Selecciona los coches y circuitos que tienes. Usaremos los datos de los CSV para mayor precisión.
          </p>
        </div>
        
        <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 shadow-2xl">
          <button
            onClick={() => setActiveTab('cars')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-widest",
              activeTab === 'cars' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            <Car className="w-4 h-4" /> Coches
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-widest",
              activeTab === 'tracks' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            <Map className="w-4 h-4" /> Circuitos
          </button>
        </div>
      </div>

      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text"
          placeholder={activeTab === 'cars' ? "Buscar coche..." : "Buscar circuito..."}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-600/50 focus:bg-zinc-900 transition-all text-lg font-medium shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {activeTab === 'cars' && searchQuery === '' ? (
        <div className="space-y-12">
          {Object.entries(groupedCars).map(([groupName, groupCars]) => (
            <div key={groupName} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-indigo-400 uppercase tracking-[0.2em] italic shrink-0">{groupName.replace('_', ' ')}</h2>
                <div className="h-px bg-gradient-to-r from-indigo-900/50 to-transparent flex-1" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupCars.map(car => (
                  <ContentCard 
                    key={car.car_id}
                    name={car.car_name}
                    isOwned={ownedCars.includes(car.car_name)}
                    onToggle={() => toggleOwnedCar(car.car_name)}
                    type="car"
                    isFree={car.free_with_subscription === 'TRUE'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(activeTab === 'cars' ? filteredCars : filteredTracks).map(item => {
            const name = 'car_name' in item ? item.car_name : item.track_name;
            const id = 'car_id' in item ? item.car_id : item.track_id;
            const isFree = item.free_with_subscription === 'TRUE';
            return (
              <ContentCard 
                key={id}
                name={name}
                isOwned={activeTab === 'cars' ? ownedCars.includes(name) : ownedTracks.includes(name)}
                onToggle={() => activeTab === 'cars' ? toggleOwnedCar(name) : toggleOwnedTrack(name)}
                type={activeTab === 'cars' ? "car" : "track"}
                isFree={isFree}
              />
            );
          })}
        </div>
      )}

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <Link 
          href="/"
          className="bg-zinc-950 text-white border border-zinc-700 px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-900 hover:border-indigo-500 transition-all flex items-center gap-3 backdrop-blur-md"
        >
          Guardar y Volver al Dashboard <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function ContentCard({ name, isOwned, onToggle, type, isFree }: { name: string, isOwned: boolean, onToggle: () => void, type: 'car' | 'track', isFree: boolean }) {
  const displayOwned = isOwned || isFree;
  return (
    <button
      onClick={isFree ? undefined : onToggle}
      disabled={isFree}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left group overflow-hidden",
        displayOwned 
          ? "bg-indigo-950/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
          : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60",
        isFree && "cursor-default opacity-80"
      )}
    >
      <div className="flex justify-between items-start w-full mb-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          displayOwned ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
        )}>
          {type === 'car' ? <Car className="w-5 h-5" /> : <Map className="w-5 h-5" />}
        </div>
        
        {displayOwned && (
          <div className="flex items-center gap-2">
            {isFree && <span className="text-[8px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">BASE</span>}
            <div className="bg-indigo-600 rounded-full p-1">
              <Check className="w-3 h-3 text-white" strokeWidth={4} />
            </div>
          </div>
        )}
      </div>
      
      <div className="w-full">
        <h3 className={cn(
          "font-bold text-sm leading-tight transition-colors line-clamp-2 uppercase italic",
          displayOwned ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
        )}>
          {name}
        </h3>
      </div>
    </button>
  );
}

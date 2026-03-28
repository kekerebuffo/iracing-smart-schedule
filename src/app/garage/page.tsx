'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { getFullSchedule } from '@/lib/scheduleProcessor';
import { cn } from '@/components/layout/Sidebar';
import { Car, Map, Check, ChevronRight, Search, LayoutGrid, List } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function GaragePage() {
  const { ownedCars, ownedTracks, toggleOwnedCar, toggleOwnedTrack } = useFilterStore();
  const [activeTab, setActiveTab] = useState<'cars' | 'tracks'>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  
  const schedule = getFullSchedule();

  // Extract unique cars and tracks
  const allCars = useMemo(() => {
    const cars = new Set<string>();
    schedule.forEach(s => {
      s.cars.forEach(c => cars.add(c));
    });
    return Array.from(cars).sort();
  }, [schedule]);

  const allTracks = useMemo(() => {
    const tracks = new Set<string>();
    schedule.forEach(s => {
      s.weeks.forEach(w => tracks.add(w.trackName));
    });
    return Array.from(tracks).sort();
  }, [schedule]);

  // Car categories for grouping
  const carCategories = [
    { name: 'GT3 / IMSA', keywords: ['GT3', 'Ferrari 296', 'Porsche 911 GT3', 'BMW M4 GT3', 'Lamborghini Huracán GT3', 'Mercedes-AMG GT3', 'Audi R8 LMS', 'Ford Mustang GT3', 'Chevrolet Corvette Z06 GT3'] },
    { name: 'GT4', keywords: ['GT4', 'Porsche 718 Cayman GT4', 'BMW M4 GT4', 'Aston Martin Vantage GT4', 'Mercedes-AMG GT4', 'McLaren 570S GT4'] },
    { name: 'LMP / Prototypes', keywords: ['LMP2', 'LMP3', 'Dallara P217', 'Ligier JS P320', 'Acura ARX-06', 'BMW M Hybrid V8', 'Cadillac V-Series.R', 'Porsche 963', 'Dallara DW12', 'IndyCar', 'IR-01'] },
    { name: 'Formula / Open Wheel', keywords: ['Formula', 'F1', 'F2', 'F3', 'F4', 'Super Formula', 'Dallara F3', 'Indy NXT', 'Lotus 79', 'Lotus 49', 'Skippy', 'Skip Barber', 'Vee', '1600'] },
    { name: 'Touring / GT Cars', keywords: ['TCR', 'Clio', 'Civic', 'Elantra', 'Veloster', 'Audi RS 3', 'BMW M2', 'Toyota GR86', 'Porsche 911 GT3 Cup', 'Ferrari 488 GTE', 'Chevrolet Corvette C8.R', 'Ford GTE', 'BMW M8 GTE'] },
    { name: 'Oval / NASCAR', keywords: ['NASCAR', 'Cup', 'Xfinity', 'Truck', 'Silverado', 'Camry', 'Mustang', 'Dark Horse', 'ARCA', 'Street Stock', 'Late Model', 'SK Modified', 'Whelen'] },
    { name: 'Dirt / Rally', keywords: ['Dirt', 'Rallycross', 'RX', 'Beetle', 'Subaru WRX', 'Fiesta', 'Sprint Car', 'Midget', 'Micro', 'UMP'] },
  ];

  const groupedCars = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const assigned = new Set<string>();

    carCategories.forEach(cat => {
      groups[cat.name] = allCars.filter(car => {
        if (assigned.has(car)) return false;
        const isMatch = cat.keywords.some(kw => car.toLowerCase().includes(kw.toLowerCase()));
        if (isMatch) assigned.add(car);
        return isMatch;
      });
    });

    const others = allCars.filter(car => !assigned.has(car));
    if (others.length > 0) groups['Otros'] = others;

    return groups;
  }, [allCars]);

  const filteredItems = useMemo(() => {
    const list = activeTab === 'cars' ? allCars : allTracks;
    return list.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, searchQuery, allCars, allTracks]);

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
            Selecciona manualmente los coches y circuitos que tienes en iRacing. Usaremos esta información para filtrar el calendario automáticamente.
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
          placeholder={activeTab === 'cars' ? "Buscar coche por nombre..." : "Buscar circuito por nombre..."}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-600/50 focus:bg-zinc-900 transition-all text-lg font-medium shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {activeTab === 'cars' && searchQuery === '' ? (
        <div className="space-y-12">
          {Object.entries(groupedCars).map(([groupName, cars]) => cars.length > 0 && (
            <div key={groupName} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-indigo-400 uppercase tracking-[0.2em] italic shrink-0">{groupName}</h2>
                <div className="h-px bg-gradient-to-r from-indigo-900/50 to-transparent flex-1" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cars.map(car => (
                  <ContentCard 
                    key={car}
                    name={car}
                    isOwned={ownedCars.includes(car)}
                    onToggle={() => toggleOwnedCar(car)}
                    type="car"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <ContentCard 
              key={item}
              name={item}
              isOwned={activeTab === 'cars' ? ownedCars.includes(item) : ownedTracks.includes(item)}
              onToggle={() => activeTab === 'cars' ? toggleOwnedCar(item) : toggleOwnedTrack(item)}
              type={activeTab === 'cars' ? "car" : "track"}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 font-bold uppercase tracking-widest italic">No se encontraron resultados para "{searchQuery}"</p>
            </div>
          )}
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

function ContentCard({ name, isOwned, onToggle, type }: { name: string, isOwned: boolean, onToggle: () => void, type: 'car' | 'track' }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left group overflow-hidden",
        isOwned 
          ? "bg-indigo-950/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
          : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60"
      )}
    >
      <div className="flex justify-between items-start w-full mb-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          isOwned ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
        )}>
          {type === 'car' ? <Car className="w-5 h-5" /> : <Map className="w-5 h-5" />}
        </div>
        
        {isOwned && (
          <div className="bg-indigo-600 rounded-full p-1 animate-in zoom-in-50 duration-300">
            <Check className="w-3 h-3 text-white" strokeWidth={4} />
          </div>
        )}
      </div>
      
      <div className="w-full">
        <h3 className={cn(
          "font-bold text-sm leading-tight transition-colors line-clamp-2",
          isOwned ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
        )}>
          {name}
        </h3>
      </div>
      
      {isOwned && (
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transform rotate-12 scale-150 transition-transform group-hover:scale-[1.6]">
           {type === 'car' ? <Car size={100} /> : <Map size={100} />}
        </div>
      )}
    </button>
  );
}

'use client'

import { useState } from 'react';
import { iRacingCar } from '@/lib/dataService';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Search, Filter, Car, Zap, Droplets, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/components/layout/Sidebar';

interface Props {
  cars: iRacingCar[];
}

export function CarsClient({ cars }: Props) {
  const { t } = useLanguageStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(cars.map(c => c.categories).filter(Boolean)))];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.car_name.toLowerCase().includes(search.toLowerCase()) || 
                         car.car_make.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || car.categories === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">{t('cars')}</h1>
          <p className="text-zinc-400 font-medium">Explore the iRacing car catalog ({filteredCars.length} models).</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search cars or makes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 border",
                category === cat 
                  ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredCars.map((car) => (
          <Link 
            key={car.car_id} 
            href={`/cars/${car.car_id}`}
            className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 flex flex-col"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">{car.car_make}</p>
                  <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors">{car.car_name}</h3>
                </div>
                <div className="bg-zinc-800 p-2 rounded-lg">
                  <Car className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Zap className="w-2 h-2" /> Power
                  </p>
                  <p className="text-xs font-mono text-zinc-300">{car.hp} HP</p>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-xs font-mono text-zinc-300">{car.car_weight} lbs</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-zinc-800/50 bg-zinc-950/30 flex items-center justify-between">
              <div className="flex gap-2">
                {car.rain_enabled === 'TRUE' && (
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {car.free_with_subscription === 'TRUE' ? 'FREE' : car.price_display || car.price}
                </span>
              </div>
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

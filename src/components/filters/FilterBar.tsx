'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { cn } from '@/components/layout/Sidebar';
import { ToggleRight, ToggleLeft, Car } from 'lucide-react';

const LICENSES = ['R', 'D', 'C', 'B', 'A'];
const CATEGORIES = ['OVAL', 'SPORTS CAR', 'FORMULA CAR', 'DIRT OVAL', 'DIRT ROAD'];

function ToggleButton({ active, onClick, children, className }: { active: boolean, onClick: () => void, children: React.ReactNode, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-bold transition-all border tracking-wide",
        active
          ? "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar() {
  const { t } = useLanguageStore();
  const {
    licenses, toggleLicense,
    types, toggleType,
    showOnlyOwned, toggleShowOnlyOwned,
    ownedCars, ownedTracks
  } = useFilterStore();

  const hasOwnedContent = ownedCars.length > 0 || ownedTracks.length > 0;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 mb-8 flex flex-col xl:flex-row gap-6 items-start xl:items-center">
      
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('content_check')}</span>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Link 
            href="/garage"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap",
              hasOwnedContent
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/40"
            )}
          >
            <Car className="w-4 h-4" />
            {hasOwnedContent ? t('garage') : t('configure_garage')}
          </Link>
          
          <button
            onClick={toggleShowOnlyOwned}
            disabled={!hasOwnedContent}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-medium text-sm border",
              showOnlyOwned 
                ? "bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600/30" 
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white",
              !hasOwnedContent && "opacity-50 cursor-not-allowed"
            )}
          >
            {showOnlyOwned ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
            {t('hide_unowned')}
          </button>
        </div>
      </div>

      <div className="xl:border-l xl:border-zinc-800 xl:pl-6 space-y-3 shrink-0 h-full flex flex-col justify-center">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('license_filter')}</span>
        <div className="flex flex-wrap gap-2">
          {LICENSES.map(lic => (
            <ToggleButton
              key={lic}
              active={licenses.includes(lic)}
              onClick={() => toggleLicense(lic)}
              className="w-10 h-10 p-0 flex items-center justify-center rounded-lg text-sm font-black"
            >
              {lic}
            </ToggleButton>
          ))}
        </div>
      </div>

      <div className="xl:border-l xl:border-zinc-800 xl:pl-6 space-y-3 flex-1 w-full relative h-full flex flex-col justify-center">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('discipline_filter')}</span>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map(cat => (
            <ToggleButton
              key={cat}
              active={types.includes(cat)}
              onClick={() => toggleType(cat)}
              className="rounded-lg py-2 uppercase"
            >
              {cat}
            </ToggleButton>
          ))}
        </div>
      </div>

    </div>
  );
}

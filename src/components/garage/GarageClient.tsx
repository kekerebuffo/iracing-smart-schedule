'use client'

import { useFilterStore } from '@/store/useFilterStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { cn } from '@/components/layout/Sidebar';
import { Car, Map, Check, ChevronRight, Search, User, Globe, Info, Save } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { iRacingCar, iRacingTrack } from '@/lib/dataService';
import { GarageDetailModal } from './GarageDetailModal';

interface Props {
  cars: iRacingCar[];
  tracks: iRacingTrack[];
}

export default function GarageClient({ cars, tracks }: Props) {
  const { t } = useLanguageStore();
  const { 
    ownedCars, ownedTracks, toggleOwnedCar, toggleOwnedTrack,
    pilotName, pilotNationality, setPilotName, setPilotNationality
  } = useFilterStore();
  const [viewType, setViewType] = useState<'collection' | 'setup'>('collection');
  const [activeTab, setActiveTab] = useState<'cars' | 'tracks' | 'profile'>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<{type: 'car' | 'track', data: iRacingCar | iRacingTrack} | null>(null);

  const groupedCars = useMemo(() => {
    const groups: Record<string, iRacingCar[]> = {};
    cars.forEach(car => {
      // Use clean names for categories
      const cat = car.categories?.split(',')[0].replace(/_/g, ' ') || 'Otros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(car);
    });
    return groups;
  }, [cars]);

  const groupedTracks = useMemo(() => {
    const groups: Record<string, iRacingTrack[]> = {};
    tracks.forEach(track => {
      const cat = track.category || 'Otros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(track);
    });
    return groups;
  }, [tracks]);

  const getFlagEmoji = (code: string) => {
    const flags: Record<string, string> = {
      'ES': '🇪🇸', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'IT': '🇮🇹', 'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CL': '🇨🇱',
      'CO': '🇨🇴', 'UY': '🇺🇾', 'PT': '🇵🇹', 'JP': '🇯🇵', 'CA': '🇨🇦',
      'AU': '🇦🇺'
    };
    return flags[code] || '🏁';
  };

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
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/80 px-4 py-2 rounded-xl w-fit">
            <span className="text-2xl" role="img" aria-label="flag">{getFlagEmoji(pilotNationality)}</span>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Piloto Oficial</p>
              <p className="text-white font-bold text-sm tracking-wide uppercase italic">{pilotName}</p>
            </div>
          </div>
        </div>
        
        <div className="flex bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-2xl relative">
          <button
            onClick={() => setViewType('collection')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all uppercase tracking-widest",
              viewType === 'collection' ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-500 hover:text-white"
            )}
          >
            {t('my_collection')}
          </button>
          <button
            onClick={() => setViewType('setup')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all uppercase tracking-widest relative overflow-hidden group",
              viewType === 'setup' 
                ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
                : "text-zinc-400 hover:text-white bg-red-600/10 border border-red-600/20"
            )}
          >
            <span className="relative z-10">{t('setup_content')}</span>
            {viewType !== 'setup' && (
              <span className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            )}
            <span className={cn(
              "absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping",
              viewType === 'setup' ? "hidden" : ""
            )} />
          </button>
        </div>
      </div>

      {viewType === 'setup' ? (
        <>          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 shrink-0 w-fit mb-8 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('cars')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-widest shrink-0",
                activeTab === 'cars' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <Car className="w-4 h-4" /> Coches
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-widest shrink-0",
                activeTab === 'tracks' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <Map className="w-4 h-4" /> Circuitos
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-widest shrink-0",
                activeTab === 'profile' ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:text-red-500"
              )}
            >
              <User className="w-4 h-4" /> Perfil
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="max-w-2xl bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 animate-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-black text-white uppercase italic mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-red-500" /> Configuración de Perfil
              </h2>
              
              <div className="grid gap-8">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Nombre del Piloto</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      type="text" 
                      value={pilotName}
                      onChange={(e) => setPilotName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold tracking-wide"
                      placeholder="Ej: John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Nacionalidad</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { code: 'ES', label: 'España', flag: '🇪🇸' },
                      { code: 'US', label: 'USA', flag: '🇺🇸' },
                      { code: 'GB', label: 'UK', flag: '🇬🇧' },
                      { code: 'DE', label: 'Germany', flag: '🇩🇪' },
                      { code: 'FR', label: 'France', flag: '🇫🇷' },
                      { code: 'IT', label: 'Italy', flag: '🇮🇹' },
                      { code: 'BR', label: 'Brazil', flag: '🇧🇷' },
                      { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
                      { code: 'MX', label: 'Mexico', flag: '🇲🇽' },
                    ].map((nat) => (
                      <button
                        key={nat.code}
                        onClick={() => setPilotNationality(nat.code)}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-bold text-base uppercase tracking-wider",
                          pilotNationality === nat.code 
                            ? "bg-red-600 border-red-500 text-white shadow-lg" 
                            : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        <span className="text-2xl">{nat.flag}</span> {nat.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <Save className="w-5 h-5 text-green-500" />
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Los cambios se guardan automáticamente y se verán reflejados en la parte superior.</p>
              </div>
            </div>
          ) : (
            <>
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

              {activeTab === 'cars' ? (
                <div className="space-y-12">
                  {Object.entries(groupedCars).map(([groupName, groupCars]) => {
                    // In search mode, check if any car in the group matches
                    const visibleCars = searchQuery === '' 
                      ? groupCars 
                      : groupCars.filter(c => 
                          c.car_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.car_make.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    
                    if (visibleCars.length === 0) return null;

                    return (
                      <div key={groupName} className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <h2 className="text-xl font-black text-indigo-400 uppercase tracking-[0.2em] italic shrink-0">{groupName.replace('_', ' ')}</h2>
                          <div className="h-px bg-gradient-to-r from-indigo-900/50 to-transparent flex-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {visibleCars.map(car => (
                            <ContentCard 
                              key={car.car_id}
                              name={car.car_name}
                              isOwned={ownedCars.includes(car.car_name)}
                              onToggle={() => toggleOwnedCar(car.car_name)}
                              type="car"
                              isFree={car.free_with_subscription === 'TRUE'}
                              onInfo={() => setSelectedContent({type: 'car', data: car})}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedTracks).map(([groupName, groupTracks]) => {
                    const visibleTracks = searchQuery === '' 
                      ? groupTracks 
                      : groupTracks.filter(t => 
                          t.track_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.location.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    
                    if (visibleTracks.length === 0) return null;

                    return (
                      <div key={groupName} className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <h2 className="text-xl font-black text-teal-400 uppercase tracking-[0.2em] italic shrink-0">{groupName}</h2>
                          <div className="h-px bg-gradient-to-r from-teal-900/50 to-transparent flex-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {visibleTracks.map(track => (
                            <ContentCard 
                              key={track.track_id}
                              name={track.track_name}
                              variant={track.config_name}
                              isOwned={ownedTracks.includes(track.track_name)}
                              onToggle={() => toggleOwnedTrack(track.track_name)}
                              type="track"
                              isFree={track.free_with_subscription === 'TRUE'}
                              onInfo={() => setSelectedContent({type: 'track', data: track})}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* My Cars Dashboard View */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-4">
              <Car className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-black text-white uppercase italic tracking-wider">Mis Coches</h2>
            </div>
            
            <div className="space-y-8">
              {Object.entries(groupedCars).map(([cat, carList]) => {
                const ownedInCat = carList.filter(c => c.free_with_subscription === 'TRUE' || ownedCars.includes(c.car_name));
                if (ownedInCat.length === 0) return null;
                
                return (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{cat}</h3>
                    <div className="grid gap-2">
                      {ownedInCat.sort((a,b) => a.car_name.localeCompare(b.car_name)).map(car => (
                        <div key={car.car_id} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-300 font-bold text-sm uppercase italic">{car.car_name}</span>
                            {car.free_with_subscription === 'TRUE' && (
                              <span className="text-[8px] font-black bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30 uppercase tracking-tighter">BASE</span>
                            )}
                          </div>
                          {car.free_with_subscription !== 'TRUE' && (
                            <button onClick={() => toggleOwnedCar(car.car_name)} className="text-[10px] text-zinc-600 hover:text-red-500 font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Tracks Dashboard View */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-4">
              <Map className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl font-black text-white uppercase italic tracking-wider">Mis Circuitos</h2>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedTracks).map(([group, trackList]) => {
                const isBaseGroup = group === 'Contenido Base (Gratis)';
                const ownedInGroup = trackList.filter(t => t.free_with_subscription === 'TRUE' || ownedTracks.includes(t.track_name));
                if (ownedInGroup.length === 0) return null;

                return (
                  <div key={group} className="space-y-3">
                    <h3 className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      isBaseGroup ? "text-green-500/70" : "text-zinc-500"
                    )}>{group}</h3>
                    <div className="grid gap-2">
                      {ownedInGroup.sort((a,b) => a.track_name.localeCompare(b.track_name)).map(track => (
                        <div key={track.track_id} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-300 font-bold text-sm uppercase italic">{track.track_name}</span>
                            {track.free_with_subscription === 'TRUE' && (
                              <span className="text-[8px] font-black bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30 uppercase tracking-tighter">BASE</span>
                            )}
                          </div>
                          {track.free_with_subscription !== 'TRUE' && (
                            <button onClick={() => toggleOwnedTrack(track.track_name)} className="text-[10px] text-zinc-600 hover:text-red-500 font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

      <GarageDetailModal 
        isOpen={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        type={selectedContent?.type || 'car'}
        data={selectedContent?.data || null}
      />
    </div>
  );
}

function ContentCard({ name, variant, isOwned, onToggle, type, isFree, onInfo }: { name: string, variant?: string, isOwned: boolean, onToggle: () => void, type: 'car' | 'track', isFree: boolean, onInfo: () => void }) {
  const { t } = useLanguageStore();
  const displayOwned = isOwned || isFree;
  return (
    <div
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left group overflow-hidden h-full",
        displayOwned 
          ? "bg-indigo-950/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
          : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60",
        isFree && "opacity-80"
      )}
    >
      <div className="flex justify-between items-start w-full mb-3">
        <button
          onClick={isFree ? undefined : onToggle}
          disabled={isFree}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-lg",
            displayOwned ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300"
          )}
        >
          {type === 'car' ? <Car className="w-5 h-5" /> : <Map className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onInfo();
            }}
            className="p-1.5 rounded-full bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            title="Ver información"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {displayOwned && (
            <div className="flex items-center gap-2">
              {isFree ? (
                <span className="text-[8px] font-black bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30 uppercase tracking-tighter shadow-md shadow-green-900/20">BASE</span>
              ) : (
                <div className="bg-indigo-600 rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3 text-white" strokeWidth={4} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={isFree ? undefined : onToggle}
        disabled={isFree}
        className="w-full text-left flex-1"
      >
        <h3 className={cn(
          "font-bold text-xs sm:text-sm leading-tight transition-colors line-clamp-2 uppercase italic mb-1",
          displayOwned ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
        )}>
          {name}
        </h3>
        {variant && (
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="shrink-0 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              {variant}
            </span>
          </div>
        )}
      </button>

      {!isFree && (
        <button 
          onClick={onToggle}
          className={cn(
            "mt-3 text-[9px] font-black uppercase tracking-widest transition-colors",
            displayOwned ? "text-indigo-400 hover:text-indigo-300" : "text-zinc-600 hover:text-indigo-400"
          )}
        >
          {displayOwned ? 'Quitar de mi garaje' : 'Añadir a mi garaje'}
        </button>
      )}
    </div>
  );
}

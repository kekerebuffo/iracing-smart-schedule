'use client'

import { useState, useEffect } from 'react';
import { X, Zap, Ruler, Flag, Droplets, Info, ExternalLink, ShieldCheck, Car, ChevronRight } from 'lucide-react';
import { IRacingSeries, SeriesWeek } from '@/lib/scheduleProcessor';
import { iRacingCar, iRacingTrack, getCarByName, getTrackByName } from '@/lib/dataService';
import { cn } from '@/components/layout/Sidebar';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  series: IRacingSeries;
  currentWeek: SeriesWeek;
}

export function SeriesInfoModal({ isOpen, onClose, series, currentWeek }: Props) {
  const [carDetails, setCarDetails] = useState<iRacingCar[]>([]);
  const [trackDetail, setTrackDetail] = useState<iRacingTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const carsData = await Promise.all(
            series.cars.map(carName => getCarByName(carName))
          );
          const trackData = await getTrackByName(currentWeek.trackName);
          
          setCarDetails(carsData.filter((c): c is iRacingCar => !!c));
          setTrackDetail(trackData || null);
        } catch (error) {
          console.error('Error fetching series details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, series.cars, currentWeek.trackName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur-md p-6 border-b border-zinc-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest leading-none">
                {series.license === 'R' ? 'Rookie' : `Class ${series.license}`}
              </span>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{series.category}</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic leading-tight">{series.seriesName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Track Section */}
          <section>
            <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4" /> Circuito de la Semana
            </h3>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase italic">{currentWeek.trackName}</h4>
                  {trackDetail && <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{trackDetail.location}</p>}
                </div>
                {trackDetail && (
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Longitud</p>
                      <p className="text-sm font-mono text-zinc-300">{trackDetail.track_config_length} miles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Curvas</p>
                      <p className="text-sm font-mono text-zinc-300">{trackDetail.corners_per_lap}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Cars Section */}
          <section>
            <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" /> Coches en esta Serie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-950 animate-pulse rounded-xl border border-zinc-800" />
                ))
              ) : carDetails.length > 0 ? (
                carDetails.map(car => (
                  <div key={car.car_id} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 group hover:border-red-600/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{car.car_make}</p>
                        <h5 className="text-sm font-bold text-white uppercase italic group-hover:text-red-500 transition-all">{car.car_name}</h5>
                      </div>
                      {car.rain_enabled === 'TRUE' && <Droplets className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-zinc-800/50">
                      <div>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Power</p>
                        <p className="text-[10px] font-mono text-zinc-400">{car.hp} HP</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Weight</p>
                        <p className="text-[10px] font-mono text-zinc-400">{car.car_weight} lbs</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                series.cars.map((carName, i) => (
                  <div key={i} className="bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-4">
                    <h5 className="text-sm font-bold text-zinc-500 uppercase italic">{carName}</h5>
                    <p className="text-[10px] text-zinc-700 uppercase mt-2 italic italic">Sin datos técnicos extra</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Race Info Section */}
          <section>
            <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Reglas y Detalles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Duración</p>
                <p className="text-xs font-bold text-zinc-300">{currentWeek.duration || 'N/A'}</p>
              </div>
              <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Salida</p>
                <p className="text-xs font-bold text-zinc-300">{currentWeek.startType || 'N/A'}</p>
              </div>
              <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Cautelas</p>
                <p className="text-xs font-bold text-zinc-300">{currentWeek.cautions || 'N/A'}</p>
              </div>
              <div className="bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Clima</p>
                <p className="text-xs font-bold text-zinc-300">{currentWeek.rain === 'None' ? 'Seco' : currentWeek.rain || 'Dinámico'}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex flex-wrap gap-4">
          <Link href={`/cars`} onClick={onClose} className="text-xs font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-all">
            <ExternalLink className="w-3.5 h-3.5" /> Ver todos los coches
          </Link>
          <Link href={`/tracks`} onClick={onClose} className="ml-auto text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1.5 transition-all">
            Ir a Circuitos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

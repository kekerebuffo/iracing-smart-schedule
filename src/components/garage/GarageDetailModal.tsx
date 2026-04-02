'use client'

import { X, Zap, Ruler, Flag, Droplets, Info, ExternalLink, ShieldCheck, Car, ChevronRight, Tags, Map, Globe, Box, CreditCard, MessageSquare } from 'lucide-react';
import { iRacingCar, iRacingTrack } from '@/lib/dataService';
import { cn } from '@/components/layout/Sidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'car' | 'track';
  data: iRacingCar | iRacingTrack | null;
}

export function GarageDetailModal({ isOpen, onClose, type, data }: Props) {
  if (!isOpen || !data) return null;

  const isCar = type === 'car';
  const car = isCar ? (data as iRacingCar) : null;
  const track = !isCar ? (data as iRacingTrack) : null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-6 border-b border-zinc-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest leading-none",
                isCar ? "bg-indigo-600 text-white" : "bg-teal-600 text-white"
              )}>
                {isCar ? 'Coche' : 'Circuito'}
              </span>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Detalles Técnicos</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic leading-tight">
              {isCar ? car?.car_name : track?.track_name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isCar ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={Zap} label="Potencia" value={`${car?.hp} HP`} />
              <DetailItem icon={Box} label="Peso" value={`${car?.car_weight} lbs`} />
              <DetailItem icon={Globe} label="Categoría" value={car?.categories.replace('_', ' ')} />
              <DetailItem icon={Droplets} label="Lluvia" value={car?.rain_enabled === 'TRUE' ? 'Soportado' : 'No soportado'} color={car?.rain_enabled === 'TRUE' ? 'text-blue-400' : 'text-zinc-500'} />
              <DetailItem icon={CreditCard} label="Precio" value={car?.free_with_subscription === 'TRUE' ? 'Gratis (Base)' : car?.price_display || car?.price} color={car?.free_with_subscription === 'TRUE' ? 'text-green-400' : 'text-zinc-300'} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={Ruler} label="Longitud" value={`${track?.track_config_length} miles`} />
              <DetailItem icon={Flag} label="Curvas" value={track?.corners_per_lap} />
              <DetailItem icon={Globe} label="Localización" value={track?.location} />
              <DetailItem icon={CreditCard} label="Precio" value={track?.free_with_subscription === 'TRUE' ? 'Gratis (Base)' : 'Contenido de pago'} color={track?.free_with_subscription === 'TRUE' ? 'text-green-400' : 'text-zinc-300'} />
            </div>
          )}

          {isCar && car?.search_filters && (
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tags className="w-3 h-3" /> Etiquetas de búsqueda
              </p>
              <div className="flex flex-wrap gap-2">
                {car.search_filters.split(',').map((tag, i) => (
                  <span key={i} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isCar && (
            <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 italic text-zinc-500 text-sm">
              Este circuito se utiliza en múltiples series esta temporada. Consulta el Planificador de Temporada para ver cuándo se corre aquí.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
          <button 
            onClick={onClose}
            className={cn(
              "w-full py-3 rounded-xl font-black uppercase tracking-widest transition-all text-sm",
              isCar ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20"
            )}
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, color = "text-zinc-200" }: { icon: any, label: string, value: any, color?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 group">
      <div className="bg-zinc-900 p-2 rounded-lg text-zinc-500 group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
        <p className={cn("text-sm font-mono uppercase", color)}>{value || 'N/A'}</p>
      </div>
    </div>
  );
}

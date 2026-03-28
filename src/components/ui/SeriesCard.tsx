import { Star, Timer, Thermometer, CloudRain, Flag, ShieldAlert, Car } from 'lucide-react';
import { cn } from '@/components/layout/Sidebar';
import { IRacingSeries, SeriesWeek } from '@/lib/scheduleProcessor';

interface Props {
  series: IRacingSeries;
  currentWeek: SeriesWeek;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  ownedTrack: boolean;
}

export function SeriesCard({ series, currentWeek, isFavorite, onToggleFavorite, ownedTrack }: Props) {
  const getLicenseColor = (lic: string) => {
    switch (lic) {
      case 'R': return 'bg-red-600 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'C': return 'bg-yellow-400 text-black';
      case 'B': return 'bg-green-500 text-white';
      case 'A': return 'bg-blue-600 text-white';
      default: return 'bg-zinc-600 text-white';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col relative overflow-hidden group hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 h-full">
      <div className={cn("absolute top-0 left-0 w-full h-1", getLicenseColor(series.license))} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="pr-4">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm inline-block mb-2 mr-2 leading-none", getLicenseColor(series.license))}>
            CLASS {series.license}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{series.category}</span>
          <h3 className="font-bold text-lg text-white leading-tight mt-1">{series.seriesName}</h3>
        </div>
        <button 
          onClick={onToggleFavorite}
          className={cn("p-2 rounded-full transition-colors shrink-0", isFavorite ? "bg-red-900/20 text-red-500" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white")}
        >
          <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Current Week (W{currentWeek.weekNum})</span>
          {ownedTrack ? (
            <span className="text-[10px] font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-900/50 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> Owned
            </span>
          ) : (
             <span className="text-[10px] font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Unowned
            </span>
          )}
        </div>
        <div className="bg-zinc-950/50 rounded p-3 text-zinc-300 font-medium text-[13px] border border-zinc-800/30">
          📍 {currentWeek.trackName}
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {currentWeek.duration && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              <Timer className="w-3 h-3 text-blue-400" />
              {currentWeek.duration}
            </div>
          )}
          {currentWeek.temp && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              <Thermometer className="w-3 h-3 text-orange-400" />
              {currentWeek.temp}
            </div>
          )}
          {currentWeek.rain && currentWeek.rain.toLowerCase() !== 'none' && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              <CloudRain className="w-3 h-3 text-cyan-400" />
              Rain: {currentWeek.rain}
            </div>
          )}
          {currentWeek.startType && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              <Flag className="w-3 h-3 text-green-400" />
              {currentWeek.startType}
            </div>
          )}
          {currentWeek.cautions && currentWeek.cautions.toLowerCase() !== 'disabled' && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              <ShieldAlert className="w-3 h-3 text-yellow-500" />
              Caut: {currentWeek.cautions}
            </div>
          )}
          {series.cars && series.cars.length > 0 && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider font-bold col-span-2 truncate">
              <Car className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">{series.cars[0]}{series.cars.length > 1 ? ` +${series.cars.length - 1}` : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

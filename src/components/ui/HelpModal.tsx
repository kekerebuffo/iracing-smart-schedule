'use client'

import { X, HelpCircle, Car, Map, Star, LayoutGrid, Info, Calendar } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: Props) {
  const { t } = useLanguageStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <HelpCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Guía de ZazoApp</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Cómo configurar y usar la app</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Section: Garage */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider italic">1. Mi Garaje (Configuración)</h3>
            </div>
            <div className="pl-8 space-y-2 text-sm text-zinc-400 leading-relaxed">
              <p>Lo primero es ir a <strong className="text-indigo-400 italic">Mi Garaje</strong> y marcar los coches y circuitos que tienes.</p>
              <ul className="list-disc list-inside space-y-1 ml-4 decoration-zinc-700">
                <li><span className="text-zinc-200 font-bold uppercase italic text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 mr-1.5">BASE</span> Contenido gratis de la suscripción (ya viene marcado).</li>
                <li>Pulsa en las tarjetas para añadir o quitar contenido de tu colección.</li>
                <li>Usa <strong className="text-zinc-200 italic">"Configurar"</strong> para ver todo el contenido disponible.</li>
              </ul>
            </div>
          </section>

          {/* Section: Favorites */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider italic">2. Favoritos y Agenda</h3>
            </div>
            <div className="pl-8 space-y-2 text-sm text-zinc-400 leading-relaxed">
              <p>En el <strong className="text-red-500 italic uppercase">Panel Principal</strong>, verás una estrella en cada serie.</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Marca tus series favoritas para habilitar la sección <strong className="text-zinc-200">Agenda Favoritos</strong>.</li>
                <li>La Agenda te permite ver el calendario detallado semana a semana solo de lo que te interesa.</li>
              </ul>
            </div>
          </section>

          {/* Section: Filters */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider italic">3. Filtros Inteligentes</h3>
            </div>
            <div className="pl-8 space-y-2 text-sm text-zinc-400 leading-relaxed">
              <p>Usa el botón <strong className="text-zinc-200 italic">"Ocultar contenido que no tengo"</strong> para que la app solo te muestre las carreras en las que puedes participar hoy mismo con tu garaje actual.</p>
            </div>
          </section>

          {/* Section: Sections Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider italic">4. Secciones clave</h3>
            </div>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3 text-red-500" /> Panel
                </h4>
                <p className="text-xs text-zinc-500 mt-1">Series activas <strong className="text-zinc-400">ESTA SEMANA</strong> con estados (Tengo todo, Falta coche/pista).</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                  <LayoutGrid className="w-3 h-3 text-yellow-500" /> Planificador
                </h4>
                <p className="text-xs text-zinc-500 mt-1">Vista de matriz de <strong className="text-zinc-400">TODA LA TEMPORADA</strong> para planificar compras.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all border border-zinc-700/50"
          >
            Entendido, ¡A correr!
          </button>
        </div>
      </div>
    </div>
  );
}

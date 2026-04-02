'use client'

import { Bell, User, Languages, LogOut, Menu } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useFilterStore } from '@/store/useFilterStore';
import { useSession, signOut } from 'next-auth/react';
import { isTuesdayAlertActive } from '@/lib/dateUtils';
import { useState } from 'react';

export default function Header() {
  const { language, setLanguage, t } = useLanguageStore();
  const { data: session } = useSession();
  const { toggle } = useSidebarStore();
  const { pilotName, pilotNationality } = useFilterStore();
  const alertActive = isTuesdayAlertActive();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 max-w-[100px] overflow-hidden">
          <img src="/logo.jpg" alt="ZazoApp" className="w-7 h-7 rounded-full border border-red-600/50 shrink-0" />
          <span className="text-xs font-black tracking-tighter uppercase italic text-white truncate">ZazoApp</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">

        {/* Notification Bell (Tuesday Reset Alert) */}
        <div className="relative">
          <button
            onClick={() => setShowAlert(prev => !prev)}
            className={`relative p-2 rounded-lg border transition-all ${
              alertActive
                ? 'border-orange-500/60 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Bell className="w-4 h-4" />
            {alertActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            )}
          </button>

          {showAlert && (
            <div className="absolute right-0 top-12 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 z-50">
              {alertActive ? (
                <>
                  <p className="text-orange-400 font-black uppercase text-xs tracking-widest mb-1">⚠️ {t('season_reset')}</p>
                  <p className="text-zinc-300 text-sm">{t('season_reset_desc')}</p>
                </>
              ) : (
                <p className="text-zinc-400 text-sm font-medium">No hay alertas pendientes.</p>
              )}
            </div>
          )}
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center space-x-2 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all text-zinc-400 hover:text-white"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{language}</span>
        </button>

        <div className="bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center space-x-3 hover:border-indigo-500/30 transition-colors cursor-default">
          <div className="flex items-center gap-1.5">
            <span className="text-lg leading-none filter drop-shadow-sm">
              {pilotNationality === 'ES' ? '🇪🇸' : 
               pilotNationality === 'US' ? '🇺🇸' : 
               pilotNationality === 'GB' ? '🇬🇧' : 
               pilotNationality === 'DE' ? '🇩🇪' : 
               pilotNationality === 'FR' ? '🇫🇷' : 
               pilotNationality === 'IT' ? '🇮🇹' : 
               pilotNationality === 'BR' ? '🇧🇷' : 
               pilotNationality === 'AR' ? '🇦🇷' : 
               pilotNationality === 'MX' ? '🇲🇽' : '🏁'}
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider max-w-[80px] sm:max-w-[120px] truncate">
              {pilotName}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse shrink-0" />
        </div>

        {session?.user && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md">
              <User className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-200">{session.user.name || 'User'}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

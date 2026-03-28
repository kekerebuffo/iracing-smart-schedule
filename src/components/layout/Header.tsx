'use client'

import { User, Languages, LogOut } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { language, setLanguage } = useLanguageStore();
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center space-x-2 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all text-zinc-400 hover:text-white"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{language}</span>
        </button>

        <div className="bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">iR API Connected</span>
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

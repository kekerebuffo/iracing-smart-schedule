import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <div className="bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">iR API Connected</span>
        </div>
        <button className="flex items-center space-x-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-md hover:bg-zinc-800 transition-all">
          <User className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-200">Keker / Profile</span>
        </button>
      </div>
    </header>
  );
}

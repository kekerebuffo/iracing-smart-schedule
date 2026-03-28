'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Flag } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/agenda', label: 'Favorite Agenda', icon: Calendar },
  ];

  return (
    <aside className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col p-4 shadow-xl z-10">
      <div className="mb-8 px-2 flex items-center space-x-3">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <Flag className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-widest uppercase">SmartSched</span>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 border group",
                isActive 
                  ? "bg-zinc-800 border-zinc-700 text-white shadow-sm" 
                  : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50 hover:border-zinc-700/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-red-500" : "group-hover:text-zinc-300")} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3 py-2 text-xs text-zinc-600 font-mono">
        v2.0 / iR-API-0.9
      </div>
    </aside>
  );
}

'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Flag, CalendarDays, Car, Map, ShoppingCart, Menu, X, LayoutGrid, TableProperties } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguageStore();
  const { isOpen, close } = useSidebarStore();

  const links = [
    { href: '/garage', label: t('garage'), icon: Car, color: 'text-indigo-400', border: 'border-indigo-500/20' },
    { href: '/planner', label: t('planner'), icon: LayoutGrid, color: 'text-yellow-500', border: 'border-yellow-500/20' },
    { href: '/', label: t('home'), icon: Home },
    { href: '/shop-guide', label: 'Guía de Compras V2', icon: ShoppingCart },
    { href: '/agenda', label: t('agenda'), icon: Calendar },
    { href: '/calendar', label: t('calendar'), icon: CalendarDays },
    { href: '/cars', label: t('cars'), icon: Car },
    { href: '/tracks', label: t('tracks'), icon: Map },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col p-4 shadow-xl z-50 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <img src="/logo.jpg" alt="ZazoApp Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">ZazoApp</span>
          </div>
          
          <button onClick={close} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
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
                  : cn(
                      "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50 hover:border-zinc-700/50",
                      link.border && "hover:border-opacity-100"
                    )
              )}
            >
              <Icon className={cn(
                "w-5 h-5", 
                isActive 
                  ? (link.color ? link.color : "text-red-500") 
                  : (link.color ? `${link.color} opacity-70 group-hover:opacity-100` : "group-hover:text-zinc-300")
              )} />
              <span className={cn(
                "font-medium",
                !isActive && link.color && "text-zinc-300"
              )}>{link.label}</span>
              {link.href === '/planner' && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              )}
            </Link>
          );
        })}
        </nav>
        <div className="mt-auto px-3 py-2 text-[10px] text-zinc-600 font-mono flex items-center justify-between border-t border-zinc-800/50 pt-4">
          <span>v2.1 / iR-API</span>
          <span className="text-red-900/50 uppercase font-black tracking-tighter">ZazoApp</span>
        </div>
      </aside>
    </>
  );
}

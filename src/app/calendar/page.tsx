'use client'

import { getFullSchedule } from '@/lib/scheduleProcessor';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { getIRacingWeek } from '@/lib/dateUtils';
import { cn } from '@/components/layout/Sidebar';

export default function CalendarPage() {
  const { t } = useLanguageStore();
  const schedule = getFullSchedule();
  const currentWeekNum = getIRacingWeek();

  // Get weeks from the first series as a reference
  const referenceWeeks = schedule.length > 0 ? schedule[0].weeks : [];

  // Parse a YYYY-MM-DD string as UTC (not local time) to avoid timezone day-shifts
  const parseUTC = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  const formatUTC = (date: Date) => date.toISOString().split('T')[0];

  const getEndDate = (startDateStr: string) => {
    const start = parseUTC(startDateStr);
    // Week runs Tue → next Mon (6 days later)
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    return formatUTC(end);
  };

  const displayStart = (dateStr: string) => formatUTC(parseUTC(dateStr));

  return (
    <div className="animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-10">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">{t('calendar')}</h1>
          <p className="text-zinc-400 font-medium">Full season schedule visualization.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
          <div className="bg-red-600/20 p-2 rounded-lg">
            <CalendarDays className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Week</p>
            <p className="text-white font-black text-lg leading-none mt-1">{currentWeekNum}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {referenceWeeks.map((wk) => {
          const isCurrent = wk.weekNum === currentWeekNum;
          const isPast = wk.weekNum < currentWeekNum;
          const endDate = getEndDate(wk.startDate);

          return (
            <div 
              key={wk.weekNum}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-5 transition-all duration-300",
                isCurrent 
                  ? "bg-zinc-900 border-red-600/50 shadow-lg shadow-red-900/10" 
                  : isPast 
                    ? "bg-zinc-950/50 border-zinc-800 opacity-60" 
                    : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {isCurrent && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600" />
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "text-4xl font-black italic tracking-tighter w-16",
                    isCurrent ? "text-red-500" : "text-zinc-700"
                  )}>
                    W{wk.weekNum}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm">
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">{displayStart(wk.startDate)}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-600" />
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">{endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-950/40 px-3 py-1.5 rounded-full border border-green-900/50 uppercase tracking-wider">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span> 
                      ACTIVE SESSION
                    </span>
                  ) : isPast ? (
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">COMPLETED</span>
                  ) : wk.weekNum === currentWeekNum + 1 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-400 bg-orange-950/40 px-3 py-1.5 rounded-full border border-orange-900/50 uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> NEXT UP
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

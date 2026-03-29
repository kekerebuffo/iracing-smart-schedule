/**
 * iRacing Week Calculation Utility
 * Weeks strictly start/end on Tuesday at 00:00 UTC.
 * Season 2, 2026 starts precisely on March 10, 2026 00:00:00 UTC.
 */

export function getIRacingWeek() {
  const now = new Date(); // Browser's local timestamp, but getTime() is universal UTC.
  
  // Reference: Season 2, 2026 Week 1 starts March 10, 2026 00:00:00 UTC.
  // JS Date.UTC uses month index (0-11). So March is 2.
  const seasonStart = new Date(Date.UTC(2026, 2, 10, 0, 0, 0)); 
  
  const diffMs = now.getTime() - seasonStart.getTime();
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)) + 1;
  
  // Basic range check (clamp between 1 and 13)
  if (diffWeeks < 1) return 1;
  if (diffWeeks > 13) return 13;
  
  return diffWeeks;
}

export function getSeasonInfo() {
  return "2026 Season 2";
}

export function isTuesdayAlertActive() {
  const now = new Date();
  const day = now.getUTCDay(); // 0-6 (Sun-Sat)
  const hour = now.getUTCHours();
  
  // Tuesday is day 2. 
  // We want to alert on Sunday (0) afternoon or Monday (1).
  if (day === 0 && hour >= 12) return true;
  if (day === 1) return true;
  return false;
}

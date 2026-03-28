export const isTuesdayAlertActive = (date: Date = new Date()): boolean => {
  const futureDate = new Date(date.getTime() + 48 * 60 * 60 * 1000);
  
  // Encontrar el próximo Martes a las 00:00 UTC
  const nextTuesday = new Date(date);
  nextTuesday.setUTCDate(date.getUTCDate() + ((2 - date.getUTCDay() + 7) % 7));
  
  // Si hoy es martes, y ya pasamos las 00:00, el próximo es en 7 días
  if (nextTuesday.getUTCDay() === date.getUTCDay() && date.getUTCHours() > 0) {
    nextTuesday.setUTCDate(nextTuesday.getUTCDate() + 7);
  }
  nextTuesday.setUTCHours(0, 0, 0, 0);
  
  const diffHours = (nextTuesday.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 48;
};

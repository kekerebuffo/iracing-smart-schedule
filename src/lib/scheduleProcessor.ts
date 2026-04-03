import scheduleData from '../../public/schedule.json';
import { getIRacingWeek } from './dateUtils';

export interface SeriesWeek {
  weekNum: number;
  startDate: string;
  trackName: string;
  temp?: string;
  rain?: string;
  startType?: string;
  cautions?: string;
  qualScrutiny?: string;
  duration?: string;
}

export interface IRacingSeries {
  seriesName: string;
  category: string;
  license: string;
  cars: string[];
  weeks: SeriesWeek[];
}

export const getFullSchedule = (): IRacingSeries[] => {
  return scheduleData as IRacingSeries[];
};

export const getCurrentWeek = (series: IRacingSeries, currentDate = new Date()): SeriesWeek => {
  const currentWeekNum = getIRacingWeek();
  const current = series.weeks.find(w => w.weekNum === currentWeekNum);
  return current || series.weeks[0];
};

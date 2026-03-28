import scheduleData from '../../public/schedule.json';

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
  let current = null;
  for (const w of series.weeks) {
    if (new Date(w.startDate) <= currentDate) {
      current = w;
    }
  }
  return current || series.weeks[0];
};

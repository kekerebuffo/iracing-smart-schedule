'use server'

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const BASE_PATH = 'C:\\Users\\keker\\Desktop\\iracing project\\iracing api';
const CARS_CSV = path.join(BASE_PATH, 'iracing_cars.csv');
const TRACKS_CSV = path.join(BASE_PATH, 'iracing_tracks.csv');

export interface iRacingCar {
  car_id: string;
  car_name: string;
  car_make: string;
  car_model: string;
  car_types: string;
  categories: string;
  hp: string;
  car_weight: string;
  price: string;
  free_with_subscription: string;
  rain_enabled: string;
  search_filters: string;
}

export interface iRacingTrack {
  track_id: string;
  track_name: string;
  config_name: string;
  category: string;
  corners_per_lap: string;
  location: string;
  latitude: string;
  longitude: string;
  track_config_length: string;
  free_with_subscription: string;
  price: string;
}

export const getCars = async (): Promise<iRacingCar[]> => {
  try {
    const csvData = fs.readFileSync(CARS_CSV, 'utf8');
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data as iRacingCar[];
  } catch (error) {
    console.error('Error reading cars CSV:', error);
    return [];
  }
};

export const getTracks = async (): Promise<iRacingTrack[]> => {
  try {
    const csvData = fs.readFileSync(TRACKS_CSV, 'utf8');
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data as iRacingTrack[];
  } catch (error) {
    console.error('Error reading tracks CSV:', error);
    return [];
  }
};

export const getFreeContent = async (): Promise<{ freeCars: string[], freeTracks: string[] }> => {
  const [cars, tracks] = await Promise.all([getCars(), getTracks()]);
  
  return {
    freeCars: cars
      .filter(c => c.free_with_subscription === 'TRUE')
      .map(c => c.car_name),
    freeTracks: tracks
      .filter(t => t.free_with_subscription === 'TRUE')
      .map(t => t.track_name)
  };
};

export const getCarByName = async (name: string): Promise<iRacingCar | undefined> => {
  const cars = await getCars();
  return cars.find(c => name.toLowerCase().includes(c.car_name.toLowerCase()) || c.car_name.toLowerCase().includes(name.toLowerCase()));
};

export const getTrackByName = async (name: string): Promise<iRacingTrack | undefined> => {
  const tracks = await getTracks();
  return tracks.find(t => name.toLowerCase().includes(t.track_name.toLowerCase()) || t.track_name.toLowerCase().includes(name.toLowerCase()));
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  ownedOnly: boolean;
  ownedCarsOnly: boolean;
  showOnlyOwned: boolean;
  ownedCars: string[];
  ownedTracks: string[];
  licenses: string[];
  types: string[];
  favorites: string[];
  toggleOwnedOnly: () => void;
  toggleOwnedCarsOnly: () => void;
  toggleShowOnlyOwned: () => void;
  setOwnedContent: (cars: string[], tracks: string[]) => void;
  toggleLicense: (lic: string) => void;
  toggleType: (type: string) => void;
  toggleFavorite: (seriesId: string) => void;
  toggleOwnedCar: (car: string) => void;
  toggleOwnedTrack: (track: string) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ownedOnly: false,
      ownedCarsOnly: false,
      showOnlyOwned: false,
      ownedCars: [],
      ownedTracks: [],
      licenses: [],
      types: [],
      favorites: [],
      userEmail: null,
      setUserEmail: (email) => set({ userEmail: email }),
      toggleOwnedOnly: () => set((state) => ({ ownedOnly: !state.ownedOnly })),
      toggleOwnedCarsOnly: () => set((state) => ({ ownedCarsOnly: !state.ownedCarsOnly })),
      toggleShowOnlyOwned: () => set((state) => ({ showOnlyOwned: !state.showOnlyOwned })),
      setOwnedContent: (cars, tracks) => set({ ownedCars: cars, ownedTracks: tracks, showOnlyOwned: true }),
      toggleLicense: (lic) => set((state) => ({
        licenses: state.licenses.includes(lic) 
          ? state.licenses.filter(l => l !== lic)
          : [...state.licenses, lic]
      })),
      toggleType: (type) => set((state) => ({
        types: state.types.includes(type) 
          ? state.types.filter(t => t !== type)
          : [...state.types, type]
      })),
      toggleFavorite: (seriesId) => set((state) => ({
        favorites: state.favorites.includes(seriesId)
          ? state.favorites.filter(id => id !== seriesId)
          : [...state.favorites, seriesId]
      })),
      toggleOwnedCar: (car) => set((state) => ({
        ownedCars: state.ownedCars.includes(car) 
          ? state.ownedCars.filter(c => c !== car)
          : [...state.ownedCars, car]
      })),
      toggleOwnedTrack: (track) => set((state) => ({
        ownedTracks: state.ownedTracks.includes(track)
          ? state.ownedTracks.filter(t => t !== track)
          : [...state.ownedTracks, track]
      }))
    }),
    {
      name: 'iracing-filters-storage',
    }
  )
);

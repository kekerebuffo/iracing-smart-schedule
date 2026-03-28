'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFilterStore } from '@/store/useFilterStore';

export function UserSessionManager() {
  const { data: session } = useSession();
  const { userEmail, setUserEmail, setOwnedContent } = useFilterStore();

  useEffect(() => {
    if (session?.user?.email && session.user.email !== userEmail) {
      // User changed or logged in
      setUserEmail(session.user.email);
      
      // Load user-specific garage from localStorage
      const savedGarage = localStorage.getItem(`garage_${session.user.email}`);
      if (savedGarage) {
        const { cars, tracks } = JSON.parse(savedGarage);
        setOwnedContent(cars, tracks);
      } else {
        // Clear if new user has no garage
        setOwnedContent([], []);
      }
    } else if (!session && userEmail) {
      // Logged out
      setUserEmail(null);
      setOwnedContent([], []);
    }
  }, [session, userEmail, setUserEmail, setOwnedContent]);

  // Auto-save whenever garage changes
  useEffect(() => {
    if (userEmail) {
      const { ownedCars, ownedTracks } = useFilterStore.getState();
      localStorage.setItem(`garage_${userEmail}`, JSON.stringify({
        cars: ownedCars,
        tracks: ownedTracks
      }));
    }
  }, [userEmail]);

  return null;
}

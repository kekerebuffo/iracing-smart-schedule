'use client'

import dynamic from 'next/dynamic';

const TrackMap = dynamic(() => import('./TrackMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-zinc-900 animate-pulse rounded-xl" />
});

export function TrackMapWrapper({ lat, lng, name }: { lat: number, lng: number, name: string }) {
  return <TrackMap lat={lat} lng={lng} name={name} />;
}

import { getCars, getTracks } from '@/lib/dataService';
import GarageClient from '@/components/garage/GarageClient';

export default async function GaragePage() {
  const [cars, tracks] = await Promise.all([getCars(), getTracks()]);

  return <GarageClient cars={cars} tracks={tracks} />;
}

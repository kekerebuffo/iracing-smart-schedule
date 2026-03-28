import { getCars } from '@/lib/dataService';
import { CarsClient } from '@/components/cars/CarsClient';

export default async function CarsPage() {
  const cars = await getCars();

  return <CarsClient cars={cars} />;
}

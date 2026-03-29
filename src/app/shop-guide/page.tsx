import { getFullSchedule } from '@/lib/scheduleProcessor';
import { getFreeContent } from '@/lib/dataService';
import { ShopGuideClient } from '@/components/shop-guide/ShopGuideClient';

export default async function ShopGuidePage() {
  const schedule = getFullSchedule();
  const { freeTracks } = await getFreeContent();

  return (
    <div className="animate-in fade-in duration-500">
      <ShopGuideClient schedule={schedule} freeTracks={freeTracks} />
    </div>
  );
}

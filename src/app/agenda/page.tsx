import { getFullSchedule } from '@/lib/scheduleProcessor';
import { getFreeContent } from '@/lib/dataService';
import { AgendaClient } from '@/components/agenda/AgendaClient';

export default async function AgendaPage() {
  const schedule = getFullSchedule();
  const { freeCars, freeTracks } = await getFreeContent();

  return (
    <AgendaClient 
      schedule={schedule}
      freeCars={freeCars}
      freeTracks={freeTracks}
    />
  );
}

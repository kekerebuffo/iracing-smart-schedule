import { getTracks } from '@/lib/dataService';
import { TracksClient } from '@/components/tracks/TracksClient';

export default async function TracksPage() {
  const tracks = await getTracks();

  return <TracksClient tracks={tracks} />;
}

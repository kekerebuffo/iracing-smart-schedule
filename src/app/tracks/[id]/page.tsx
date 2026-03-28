import { getTracks } from '@/lib/dataService';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Ruler, Flag, Globe, MapPin, CreditCard, Box } from 'lucide-react';
import dynamic from 'next/dynamic';

const TrackMap = dynamic(() => import('@/components/tracks/TrackMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-zinc-900 animate-pulse rounded-xl" />
});

export default async function TrackDetailPage({ params }: { params: { id: string } }) {
  const tracks = await getTracks();
  const track = tracks.find(t => t.track_id === params.id);

  if (!track) notFound();

  const lat = parseFloat(track.latitude);
  const lng = parseFloat(track.longitude);
  const hasCoordinates = !isNaN(lat) && !isNaN(lng);

  const stats = [
    { label: 'Length', value: `${track.track_config_length} miles`, icon: Ruler },
    { label: 'Corners', value: track.corners_per_lap, icon: Flag },
    { label: 'Category', value: track.category, icon: Box },
    { label: 'Price', value: track.free_with_subscription === 'TRUE' ? 'Free' : `$${track.price}`, icon: CreditCard },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <Link 
        href="/tracks" 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Circuits
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950 p-8 border-b border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{track.location}</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight uppercase tracking-tight">{track.track_name}</h1>
              {track.config_name && (
                <p className="text-red-500 font-bold uppercase tracking-[0.2em] mt-1 text-sm">{track.config_name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> Layout Details
              </h3>
              <div className="grid gap-4">
                {stats.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-sm font-mono text-zinc-200 group-hover:text-red-400 transition-colors uppercase">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Geographical Location
              </h3>
              {hasCoordinates ? (
                <TrackMap lat={lat} lng={lng} name={track.track_name} />
              ) : (
                <div className="h-[300px] bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center italic text-zinc-600">
                  No GPS data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

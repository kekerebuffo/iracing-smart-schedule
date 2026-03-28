import { getCars } from '@/lib/dataService';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Zap, Droplets, CreditCard, Box, Tag, Globe, MessageSquare } from 'lucide-react';

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const cars = await getCars();
  const car = cars.find(c => c.car_id === params.id);

  if (!car) notFound();

  const details = [
    { label: 'Make', value: car.car_make, icon: Tag },
    { label: 'Model', value: car.car_model, icon: Box },
    { label: 'Power', value: `${car.hp} HP`, icon: Zap },
    { label: 'Weight', value: `${car.car_weight} lbs`, icon: Box },
    { label: 'Category', value: car.categories.replace('_', ' '), icon: Globe },
    { label: 'Rain Support', value: car.rain_enabled === 'TRUE' ? 'Yes' : 'No', icon: Droplets },
    { label: 'Price', value: car.free_with_subscription === 'TRUE' ? 'Free' : car.price_display || car.price, icon: CreditCard },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <Link 
        href="/cars" 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950 p-8 border-b border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-2 block">{car.car_make}</span>
              <h1 className="text-4xl font-black text-white leading-tight uppercase tracking-tight">{car.car_name}</h1>
            </div>
            {car.free_with_subscription === 'TRUE' && (
              <span className="bg-green-600/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-green-900/50">
                Included in Subscription
              </span>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">Technical Specifications</h3>
            <div className="grid gap-4">
              {details.map((item, idx) => (
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
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">Additional Info</h3>
            <div className="space-y-4">
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Search Tags</p>
                <div className="flex flex-wrap gap-2">
                  {car.search_filters.split(',').map((tag, i) => (
                    <span key={i} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {car.forum_url && (
                <a 
                  href={car.forum_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-red-600/30 hover:bg-zinc-900 transition-all group"
                >
                  <div className="flex items-center gap-3 text-zinc-400">
                    <MessageSquare className="w-4 h-4 group-hover:text-red-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Community Forums</span>
                  </div>
                  <Globe className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

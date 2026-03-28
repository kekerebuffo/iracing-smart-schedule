'use client'

import { useState } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { RefreshCw, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function SyncModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { setOwnedContent } = useFilterStore();

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, introduce correo y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/iracing/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error('Detalles del error:', data.details);
        throw new Error(data.error + (data.details?.error ? ` Detalles: ${data.details.error}` : ''));
      }

      // Process the response to extract owned cars and tracks
      // iRacing typically returns purchased: true or has_entitlement: true, and free_with_subscription: true
      const processAssets = (assets: any[]) => {
        if (!Array.isArray(assets)) return [];
        return assets
          .filter(a => a.purchased || a.has_entitlement || a.free_with_subscription || a.owned)
          // Also extract names if we need them, but we'll store names so we can substring check easily like before
          .map(a => a.track_name || a.car_name || a.track_id || a.car_id);
      };

      const rawCars = Array.isArray(data.cars) ? data.cars : data.cars?.data || [];
      const rawTracks = Array.isArray(data.tracks) ? data.tracks : data.tracks?.data || [];
      
      const ownedCars = processAssets(rawCars);
      const ownedTracks = processAssets(rawTracks);

      // Save to store
      setOwnedContent(ownedCars, ownedTracks);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Sync iRacing Content</h2>
        <p className="text-sm text-zinc-400 mb-6 font-medium">
          Tus credenciales <strong className="text-red-400">no se guardarán</strong>. Solo se usan una vez para sincronizar los coches y circuitos que tienes comprados.
        </p>

        {success ? (
          <div className="bg-green-950/40 border border-green-900 rounded-lg p-6 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-green-400 font-bold uppercase tracking-wider">¡Sincronizado!</h3>
            <p className="text-green-200/70 text-sm mt-1">El contenido de tu cuenta se ha guardado localmente.</p>
          </div>
        ) : (
          <form onSubmit={handleSync} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-900 p-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Email de iRacing</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="piloto@ejemplo.com"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                'Sincronizar'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

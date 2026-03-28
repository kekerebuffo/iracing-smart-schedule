'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Flag, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] mb-4">
              <Flag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">SmartSched</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">iRacing Season Companion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hermano@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_4px_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn className="w-5 h-5" /> Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              Authorized personnel only / v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

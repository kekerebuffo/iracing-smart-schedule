import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZazoApp - iRacing Smart Sched',
  description: 'Advanced scheduling and telemetry dashboard for iRacing by ZazoApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen antialiased`}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

// Simple wrapper to handle conditional UI
import { headers } from 'next/headers';

async function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const heads = await headers();
  const pathname = heads.get('x-pathname') || ''; 
  const isLoginPage = pathname === '/login';
  
  if (isLoginPage) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen relative overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-6 selection:bg-red-900/40">
          {children}
        </main>
      </div>
    </div>
  );
}

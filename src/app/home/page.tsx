'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function HomePage() {
  const { user } = useUser();
  const [matches, setMatches] = useState<any[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (user && !synced) {
      // Sync user to database
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
        method: 'POST',
        headers: {
          'x-user-id': user.id,
          'x-user-email': user.emailAddresses[0]?.emailAddress || '',
          'x-user-name': `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          'x-user-avatar': user.imageUrl || '',
        },
      }).then(() => setSynced(true));
      import('@/lib/push-notifications').then(m => m.subscribeToPushNotifications());
    }
  }, [user]);

  useEffect(() => {
    const load = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
        .then(r => r.json())
        .then(data => setMatches(Array.isArray(data) ? data.slice(0, 3) : []));
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500 tracking-widest uppercase">FanVerse</h1>
          <p className="text-xs text-gray-500">FIFA World Cup 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-red-500 bg-red-950/30 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>LIVE
          </span>
          {user?.imageUrl && <img src={user.imageUrl} alt="" className="w-9 h-9 rounded-full border border-yellow-700" />}
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-24">
        <div>
          <h2 className="text-2xl font-bold">Welcome, <span className="text-yellow-500">{user?.firstName || 'Fan'}</span> 👋</h2>
          <p className="text-gray-400 mt-1 text-sm">Your World Cup journey starts here</p>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Matches</h3>
            <a href="/matches" className="text-xs text-yellow-500">See all →</a>
          </div>
          <div className="space-y-2">
            {matches.length === 0 && <p className="text-xs text-gray-600 text-center py-4">Loading matches...</p>}
            {matches.map((m: any) => (
              <div key={m.id} className={`rounded-2xl p-3 border ${m.isLive ? 'border-red-600 bg-red-950/20' : 'border-gray-800 bg-gray-900'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <img src={m.homeLogo} alt="" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-sm">{m.homeTeamCode}</span>
                  </div>
                  <div className="text-center px-2">
                    {m.isLive
                      ? <span className="text-red-500 font-bold text-lg">{m.homeScore} - {m.awayScore}</span>
                      : <span className="text-xs text-gray-400">{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    }
                  </div>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="font-bold text-sm">{m.awayTeamCode}</span>
                    <img src={m.awayLogo} alt="" className="w-8 h-8 object-contain" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-center mt-1">{m.venue}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '⚽', label: 'All Matches', href: '/matches' },
            { icon: '👥', label: 'Find Fans', href: '/fans' },
            { icon: '💬', label: 'Fan Groups', href: '/groups' },
            { icon: '🗺️', label: 'AI Guide', href: '/ai' },
            { icon: '🏅', label: 'My Passport', href: '/passport' },
            { icon: '📍', label: 'Meetups', href: '/meetups' },
          ].map(item => (
            <a key={item.href} href={item.href} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-2 hover:border-yellow-700 transition-all">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

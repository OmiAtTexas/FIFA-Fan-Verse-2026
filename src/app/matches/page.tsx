'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
        .then(r => r.json())
        .then(data => { setMatches(data); setLoading(false); });
    };
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const grouped = matches.reduce((acc: any, m: any) => {
    const date = new Date(m.kickoffAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">Matches</h1>
          <p className="text-xs text-gray-500">FIFA World Cup 2026 · Live</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-red-500">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
          LIVE
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-yellow-500 text-sm animate-pulse">Loading matches...</div>
          </div>
        )}
        {Object.entries(grouped).map(([date, dayMatches]: any) => (
          <div key={date}>
            <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-3 border-b border-yellow-900 pb-1">{date}</p>
            <div className="space-y-3">
              {dayMatches.map((m: any) => (
                <div key={m.id} className={`rounded-2xl p-4 border ${m.isLive ? 'border-red-600 bg-red-950/20' : 'border-gray-800 bg-gray-900'}`}>
                  {m.isLive && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
                      <span className="text-xs text-red-500 font-bold">{m.clock}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <img src={m.homeLogo} alt={m.homeTeam} className="w-12 h-12 object-contain" />
                      <p className="font-bold text-sm text-center">{m.homeTeam}</p>
                      <p className="text-xs text-gray-500">{m.homeTeamCode}</p>
                    </div>
                    <div className="px-4 text-center min-w-[80px]">
                      {m.isLive || m.status === 'STATUS_FINAL' ? (
                        <p className="font-bold text-3xl text-yellow-500">{m.homeScore} - {m.awayScore}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-white">{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p>
                          <p className="text-[10px] text-gray-600 mt-1">vs</p>
                        </div>
                      )}
                      {m.status === 'STATUS_FINAL' && <p className="text-[10px] text-gray-500 mt-1">FT</p>}
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <img src={m.awayLogo} alt={m.awayTeam} className="w-12 h-12 object-contain" />
                      <p className="font-bold text-sm text-center">{m.awayTeam}</p>
                      <p className="text-xs text-gray-500">{m.awayTeamCode}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 text-center mt-3">📍 {m.venue}, {m.city}, {m.country}</p>
                  <p className="text-[10px] text-gray-600 text-center">{m.stage}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}

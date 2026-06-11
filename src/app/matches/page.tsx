'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  const load = (d?: string) => {
    const url = d
      ? `${process.env.NEXT_PUBLIC_API_URL}/matches?date=${d}`
      : `${process.env.NEXT_PUBLIC_API_URL}/matches`;
    fetch(url).then(r => r.json()).then(data => {
      setMatches(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => load(date), 30000);
    return () => clearInterval(interval);
  }, [date]);

  const grouped = matches.reduce((acc: any, m: any) => {
    const d = new Date(m.kickoffAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">Matches</h1>
            <p className="text-xs text-gray-500">FIFA World Cup 2026 · Live</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-red-500">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>LIVE
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {loading && <p className="text-center text-gray-500 py-8 animate-pulse">Loading matches...</p>}
        {Object.entries(grouped).map(([date, dayMatches]: any) => (
          <div key={date}>
            <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-3 border-b border-yellow-900/30 pb-1">{date}</p>
            <div className="space-y-3">
              {dayMatches.map((m: any) => (
                <div key={m.id} className={`rounded-2xl border overflow-hidden ${m.isLive ? 'border-red-600' : m.isCompleted ? 'border-gray-700' : 'border-gray-800'} bg-gray-900`}>
                  {m.isLive && (
                    <div className="bg-red-600 px-3 py-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>
                      <span className="text-white text-xs font-bold">LIVE — {m.clock}</span>
                    </div>
                  )}
                  {m.isCompleted && (
                    <div className="bg-gray-800 px-3 py-1">
                      <span className="text-gray-400 text-xs font-bold">FULL TIME</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <img src={m.homeLogo} alt={m.homeTeam} className="w-14 h-14 object-contain" />
                        <p className="font-bold text-sm text-center leading-tight">{m.homeTeam}</p>
                        <p className="text-xs text-gray-500">{m.homeTeamCode}</p>
                      </div>
                      <div className="px-4 text-center min-w-[100px]">
                        {m.isLive || m.isCompleted ? (
                          <div>
                            <p className="font-black text-3xl text-yellow-500">{m.homeScore} - {m.awayScore}</p>
                            {m.winner && <p className="text-xs text-green-500 mt-1 font-bold">{m.winner === 'Draw' ? 'Draw' : `${m.winner} wins`}</p>}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-bold text-white">{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p>
                            <p className="text-[10px] text-gray-600 mt-1">vs</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <img src={m.awayLogo} alt={m.awayTeam} className="w-14 h-14 object-contain" />
                        <p className="font-bold text-sm text-center leading-tight">{m.awayTeam}</p>
                        <p className="text-xs text-gray-500">{m.awayTeamCode}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <p className="text-[10px] text-gray-600">📍 {m.venue}, {m.city}</p>
                      {m.isCompleted && (
                        <a href={m.espnUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-yellow-500 font-bold">Full Report on ESPN →</a>
                      )}
                    </div>
                  </div>
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

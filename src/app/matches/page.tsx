'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
      .then(r => r.json())
      .then(data => { setMatches(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 30000);
    return () => clearInterval(i);
  }, []);

  const grouped = matches.reduce((acc: any, m: any) => {
    const d = new Date(m.kickoffAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <header className="sticky top-0 bg-black/95 backdrop-blur border-b border-yellow-900/50 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-yellow-500 tracking-widest uppercase">Matches</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">FIFA World Cup 2026</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 border border-red-900/50 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>LIVE
        </span>
      </header>

      <main className="px-4 py-4 space-y-6">
        {loading && <p className="text-center text-gray-500 py-12 animate-pulse">Loading matches...</p>}
        {Object.entries(grouped).map(([date, dayMatches]: any) => (
          <div key={date}>
            <p className="text-xs text-yellow-500/80 font-bold uppercase tracking-widest mb-3">{date}</p>
            <div className="space-y-3">
              {dayMatches.map((m: any) => (
                <div key={m.id} className={`rounded-2xl border overflow-hidden ${m.isLive ? 'border-red-700' : m.isCompleted ? 'border-gray-700' : 'border-gray-800'} bg-gray-900`}>
                  {m.isLive && (
                    <div className="bg-red-700 px-3 py-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"/>
                      <span className="text-white text-xs font-black tracking-wider">LIVE · {m.clock}</span>
                    </div>
                  )}
                  {m.isCompleted && (
                    <div className="bg-gray-800 px-3 py-1.5">
                      <span className="text-gray-400 text-xs font-bold tracking-wider">FULL TIME</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <img src={m.homeLogo} alt={m.homeTeam} className="w-14 h-14 object-contain drop-shadow" />
                        <p className="font-bold text-sm text-center leading-tight">{m.homeTeam}</p>
                      </div>
                      <div className="px-4 text-center min-w-[110px]">
                        {m.isLive || m.isCompleted ? (
                          <div>
                            <p className="font-black text-4xl text-yellow-500 tracking-tight">{m.homeScore} - {m.awayScore}</p>
                            {m.winner && <p className="text-xs text-green-400 mt-1 font-bold">{m.winner === 'Draw' ? '🤝 Draw' : `🏆 ${m.winner}`}</p>}
                          </div>
                        ) : (
                          <div>
                            <p className="text-base font-black text-white">{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">{new Date(m.kickoffAt).toLocaleDateString('en-US', { timeZoneName: 'short' }).split(',')[1]}</p>
                          </div>
                        )}
                        <p className="text-[9px] text-gray-600 mt-2">{m.stage}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <img src={m.awayLogo} alt={m.awayTeam} className="w-14 h-14 object-contain drop-shadow" />
                        <p className="font-bold text-sm text-center leading-tight">{m.awayTeam}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <p className="text-[10px] text-gray-600">📍 {m.venue}{m.city ? `, ${m.city}` : ''}</p>
                      {m.isCompleted && (
                        <a href={m.espnUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-yellow-500 font-bold">ESPN Report →</a>
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

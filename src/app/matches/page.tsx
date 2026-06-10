'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
      .then(r => r.json())
      .then(data => { setMatches(data); setLoading(false); });
  }, []);

  const grouped = matches.reduce((acc: any, m: any) => {
    const date = new Date(m.kickoffAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">Matches</h1>
        <p className="text-xs text-gray-500">FIFA World Cup 2026</p>
      </header>
      <main className="px-4 py-4 space-y-6">
        {loading && <p className="text-gray-400 text-center py-8">Loading matches...</p>}
        {Object.entries(grouped).map(([date, dayMatches]: any) => (
          <div key={date}>
            <p className="text-xs text-yellow-500 font-semibold uppercase tracking-wider mb-2">{date}</p>
            <div className="space-y-2">
              {dayMatches.map((m: any) => (
                <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="font-bold text-sm">{m.homeTeam}</p>
                      <p className="text-xs text-gray-500">{m.homeTeamCode}</p>
                    </div>
                    <div className="px-4 text-center">
                      {m.homeScore !== null ? (
                        <p className="font-bold text-xl text-yellow-500">{m.homeScore} - {m.awayScore}</p>
                      ) : (
                        <p className="text-xs text-gray-500">{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      )}
                      <p className="text-[10px] text-gray-600 mt-1">{m.stage}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-bold text-sm">{m.awayTeam}</p>
                      <p className="text-xs text-gray-500">{m.awayTeamCode}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 text-center mt-2">📍 {m.stadium}, {m.city}</p>
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

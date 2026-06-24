'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';



export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  const getDates = () => {
    const dates = [];
    for (let i = -2; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');

  const load = (date?: string) => {
    setLoading(true);
    const url = date
      ? `${process.env.NEXT_PUBLIC_API_URL}/matches?date=${date}`
      : `${process.env.NEXT_PUBLIC_API_URL}/matches`;
    fetch(url).then(r => r.json()).then(data => {
      setMatches(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    load(selectedDate);
    const i = setInterval(() => load(selectedDate), 30000);
    return () => clearInterval(i);
  }, [selectedDate]);

  const grouped = matches.reduce((acc: any, m: any) => {
    const d = new Date(m.kickoffAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(m);
    return acc;
  }, {});

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 className="fifa-font" style={{ fontSize: 28, color: '#e8003d' }}>MATCHES</h1>
              <p style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase' }}>FIFA World Cup 2026</p>
            </div>
            <span className="live-badge"><span className="pulse-dot" style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', display: 'inline-block' }}/>LIVE</span>
          </div>
          <div className="scrollbar-hide" style={{ overflowX: 'auto', marginTop: 12, paddingBottom: 4 }}>
            <button onClick={() => setSelectedDate('')} className="pill" style={{ background: selectedDate === '' ? '#e8003d' : 'var(--bg3)', color: selectedDate === '' ? 'white' : '#888', borderColor: selectedDate === '' ? '#e8003d' : 'var(--border)', flexShrink: 0 }}>Today</button>
            {getDates().map(d => {
              const key = formatDate(d);
              const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const active = selectedDate === key;
              return (
                <button key={key} onClick={() => setSelectedDate(key)} className="pill" style={{ background: active ? '#e8003d' : 'var(--bg3)', color: active ? 'white' : '#888', borderColor: active ? '#e8003d' : 'var(--border)', flexShrink: 0 }}>{label}</button>
              );
            })}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="card" style={{ height: 110, opacity: 0.3 }}/>)}
          </div>
        )}
        {!loading && matches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>📅</p>
            <p style={{ color: 'var(--text3)', fontWeight: 600 }}>No matches on this date</p>
          </div>
        )}
        {Object.entries(grouped).map(([date, dayMatches]: any) => (
          <div key={date} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{date}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dayMatches.map((m: any, idx: number) => {
                const color = m.isLive ? '#e8003d' : m.isCompleted ? '#7b2fff' : '#0f3066';
                return (
                  <div key={m.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderTop: `3px solid ${color}`, borderRadius: "16px", overflow: "hidden" }}>
                    {m.isLive && <div style={{ background: '#e8003d', padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}><span className="pulse-dot" style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', display: 'inline-block' }}/><span style={{ fontSize: 10, fontWeight: 800, color: 'white', letterSpacing: 1 }}>LIVE · {m.clock}</span></div>}
                    {m.isCompleted && <div style={{ background: 'var(--bg3)', padding: '5px 14px' }}><span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', letterSpacing: 1 }}>FULL TIME</span></div>}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <img src={m.homeLogo} alt={m.homeTeam} style={{ width: 48, height: 48, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                          <p style={{ fontWeight: 800, fontSize: 13, textAlign: 'center' }}>{m.homeTeam}</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 16px', minWidth: 100 }}>
                          {m.isLive || m.isCompleted ? (
                            <div>
                              <p style={{ fontWeight: 900, fontSize: 32, color }}>{m.homeScore} - {m.awayScore}</p>
                              {m.winner && <p style={{ fontSize: 11, color: '#00e676', fontWeight: 700, marginTop: 4 }}>{m.winner === 'Draw' ? '🤝 Draw' : `🏆 ${m.winner}`}</p>}
                            </div>
                          ) : (
                            <div>
                              <p style={{ fontWeight: 900, fontSize: 16, color: 'white' }}>{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                              <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>vs</p>
                            </div>
                          )}
                          <p style={{ fontSize: 9, color: 'var(--text3)', marginTop: 6 }}>{m.stage}</p>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <img src={m.awayLogo} alt={m.awayTeam} style={{ width: 48, height: 48, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                          <p style={{ fontWeight: 800, fontSize: 13, textAlign: 'center' }}>{m.awayTeam}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 10, color: 'var(--text3)' }}>📍 {m.venue}{m.city ? `, ${m.city}` : ''}</p>
                        {m.isCompleted && m.espnUrl && <a href={m.espnUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: '#e8003d', fontWeight: 700, textDecoration: 'none' }}>ESPN →</a>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}

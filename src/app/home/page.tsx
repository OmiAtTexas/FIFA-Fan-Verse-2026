'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/ui/BottomNav';

export default function HomePage() {
  const { user } = useUser();
  const [matches, setMatches] = useState<any[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (user && !synced) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
        method: 'POST',
        headers: {
          'x-user-id': user.id,
          'x-user-email': user.emailAddresses[0]?.emailAddress || '',
          'x-user-name': `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          'x-user-avatar': user.imageUrl || '',
        },
      }).then(() => setSynced(true));
    }
  }, [user, synced]);

  useEffect(() => {
    const load = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
        .then(r => r.json())
        .then(data => setMatches(Array.isArray(data) ? data.slice(0, 5) : []));
    };
    load();
    const i = setInterval(load, 30000);
    return () => clearInterval(i);
  }, []);

  const colors = ['#e63946','#ff6b35','#2ec4b6','#8338ec','#06d6a0','#ffbe0b'];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0d0d0d' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <div>
          <h1 className="fifa-title text-3xl" style={{ color: '#e63946', letterSpacing: 2 }}>FANVERSE 26</h1>
          <p style={{ fontSize: 9, color: '#666', letterSpacing: 3, textTransform: 'uppercase' }}>FIFA World Cup Companion</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-badge flex items-center gap-1">
            <span style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1s infinite' }}/>
            LIVE
          </span>
          <Link href="/profile">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e63946' }} />
              : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>{user?.firstName?.[0] || '?'}</div>
            }
          </Link>
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* Welcome */}
        <div style={{ padding: '20px', borderRadius: 20, background: 'linear-gradient(135deg, #e63946 0%, #8338ec 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
          <div style={{ position: 'absolute', bottom: -30, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Welcome back,</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{user?.firstName || 'Fan'} 👋</h2>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>The World Cup has started! 🔥</p>
        </div>

        {/* Today's Matches */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#666', letterSpacing: 3, textTransform: 'uppercase' }}>Today's Matches</h3>
            <Link href="/matches" style={{ fontSize: 11, color: '#e63946', fontWeight: 700 }}>See all →</Link>
          </div>
          <div className="space-y-2">
            {matches.length === 0 && (
              <div style={{ background: '#111', borderRadius: 16, padding: '16px', textAlign: 'center', color: '#444', fontSize: 13 }}>Loading matches...</div>
            )}
            {matches.map((m: any, idx: number) => (
              <div key={m.id} style={{ background: '#111', borderRadius: 16, padding: '14px', borderLeft: `3px solid ${colors[idx % colors.length]}`, position: 'relative', overflow: 'hidden' }}>
                {m.isLive && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span className="live-badge">LIVE {m.clock}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <img src={m.homeLogo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{m.homeTeamCode}</span>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0 12px' }}>
                    {m.isLive || m.isCompleted
                      ? <span style={{ fontWeight: 900, fontSize: 22, color: colors[idx % colors.length] }}>{m.homeScore} - {m.awayScore}</span>
                      : <span style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>{new Date(m.kickoffAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    }
                    {m.isCompleted && <p style={{ fontSize: 9, color: '#555', marginTop: 2 }}>FULL TIME</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{m.awayTeamCode}</span>
                    <img src={m.awayLogo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                  </div>
                </div>
                <p style={{ fontSize: 10, color: '#444', textAlign: 'center', marginTop: 8 }}>📍 {m.venue}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#666', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Explore</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { emoji: '👥', label: 'Find Fans', href: '/fans', color: '#e63946' },
              { emoji: '🫂', label: 'Groups', href: '/groups', color: '#8338ec' },
              { emoji: '🤖', label: 'AI Guide', href: '/ai', color: '#2ec4b6' },
              { emoji: '💬', label: 'Messages', href: '/messages', color: '#ff6b35' },
              { emoji: '🏅', label: 'Passport', href: '/passport', color: '#ffbe0b' },
              { emoji: '👤', label: 'Profile', href: '/profile', color: '#06d6a0' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ background: '#111', borderRadius: 16, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: `1px solid #222`, textDecoration: 'none', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 26 }}>{item.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#ccc', textAlign: 'center' }}>{item.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

const STAMPS = [
  { id: 'group_member', title: 'Group Member', desc: 'Join a fan group', color: '#00e676', auto: true, icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'fan_connector', title: 'Fan Connector', desc: 'Follow 5 fans', color: '#7b2fff', auto: true, icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8' },
  { id: 'world_traveler', title: 'World Traveler', desc: 'Add 3+ host cities to your profile', color: '#00c2a8', auto: true, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { id: 'usa_explorer', title: 'USA Explorer', desc: 'Add a US host city to profile', color: '#e8003d', auto: true, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { id: 'canada_explorer', title: 'Canada Explorer', desc: 'Add a Canadian host city to profile', color: '#e8003d', auto: true, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { id: 'mexico_explorer', title: 'Mexico Explorer', desc: 'Add a Mexican host city to profile', color: '#00c2a8', auto: true, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { id: 'first_match', title: 'First Match', desc: 'Mark that you attended a match', color: '#ff5c1a', auto: false, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8l4 4-4 4-4-4z' },
  { id: 'group_stage', title: 'Group Stage Fan', desc: 'Mark attending 3 group stage matches', color: '#ffd700', auto: false, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8l4 4-4 4-4-4z' },
  { id: 'quarter_final', title: 'Quarter Final Fan', desc: 'Mark attending a quarter final', color: '#c9a227', auto: false, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8l4 4-4 4-4-4z' },
  { id: 'final_witness', title: 'Final Witness', desc: 'Mark attending the World Cup Final', color: '#e8003d', auto: false, icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'local_foodie', title: 'Local Foodie', desc: 'Self-certify trying local food', color: '#ff5c1a', auto: false, icon: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3' },
  { id: 'photographer', title: 'Photographer', desc: 'Self-certify sharing match day photos', color: '#7b2fff', auto: false, icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
];

const US_CITIES = ['Dallas', 'New York/New Jersey', 'Los Angeles', 'Miami', 'Atlanta', 'Houston', 'Seattle', 'San Francisco Bay Area', 'Boston', 'Philadelphia', 'Kansas City'];
const CA_CITIES = ['Vancouver', 'Toronto'];
const MX_CITIES = ['Mexico City', 'Guadalajara', 'Monterrey'];

export default function PassportPage() {
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [claimedStamps, setClaimedStamps] = useState<string[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    // Load claimed stamps from localStorage
    const saved = JSON.parse(localStorage.getItem(`stamps_${userId}`) || '[]');
    setClaimedStamps(saved);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { 'x-user-id': userId } })
      .then(r => r.json()).then(setProfile);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, { headers: { 'x-user-id': userId } })
      .then(r => r.json()).then(data => setGroups(Array.isArray(data) ? data : []));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
      .then(r => r.json()).then(data => setMatches(Array.isArray(data) ? data.slice(0, 3) : []));
  }, [userId]);

  const isEarned = (stampId: string) => {
    if (claimedStamps.includes(stampId)) return true;
    if (!profile) return false;
    switch (stampId) {
      case 'group_member': return groups.some(g => g.isMember);
      case 'fan_connector': return (profile._count?.following || 0) >= 5;
      case 'world_traveler': return (profile.hostCities?.length || 0) >= 3;
      case 'usa_explorer': return profile.hostCities?.some((c: string) => US_CITIES.includes(c));
      case 'canada_explorer': return profile.hostCities?.some((c: string) => CA_CITIES.includes(c));
      case 'mexico_explorer': return profile.hostCities?.some((c: string) => MX_CITIES.includes(c));
      default: return false;
    }
  };

  const claim = (stampId: string) => {
    setClaiming(stampId);
    setTimeout(() => {
      const updated = [...claimedStamps, stampId];
      setClaimedStamps(updated);
      localStorage.setItem(`stamps_${userId}`, JSON.stringify(updated));
      setClaiming(null);
    }, 800);
  };

  const getActionLabel = (stamp: any) => {
    switch (stamp.id) {
      case 'group_member': return { label: 'Join a Group', action: () => router.push('/groups') };
      case 'fan_connector': return { label: 'Find Fans', action: () => router.push('/fans') };
      case 'world_traveler': return { label: 'Edit Profile', action: () => router.push('/profile/edit') };
      case 'usa_explorer': return { label: 'Edit Profile', action: () => router.push('/profile/edit') };
      case 'canada_explorer': return { label: 'Edit Profile', action: () => router.push('/profile/edit') };
      case 'mexico_explorer': return { label: 'Edit Profile', action: () => router.push('/profile/edit') };
      default: return { label: 'Claim Badge', action: () => claim(stamp.id) };
    }
  };

  const earnedStamps = STAMPS.filter(s => isEarned(s.id));
  const unearnedStamps = STAMPS.filter(s => !isEarned(s.id));

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="fifa-font" style={{ fontSize: 28, color: '#e8003d' }}>MY PASSPORT</h1>
          <p style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase' }}>FIFA World Cup 2026 Journey</p>
        </div>
      </header>

      <main className="inner" style={{ paddingBottom: 100 }}>
        {/* Passport Card */}
        <div style={{ borderRadius: 24, background: 'linear-gradient(135deg, #020F2A 0%, #0a2454 50%, #1a3a6b 100%)', border: '2px solid #c9a227', padding: 24, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,162,39,0.08)' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 10, color: '#c9a227', fontWeight: 800, letterSpacing: 3 }}>FIFA WORLD CUP</p>
              <h2 className="fifa-font" style={{ fontSize: 48, color: '#c9a227', lineHeight: 1 }}>USA '26</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#c9a227', marginTop: 4 }}>{earnedStamps.length}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>STAMPS</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { label: 'Following', value: profile?._count?.following || 0 },
              { label: 'Cities', value: profile?.hostCities?.length || 0 },
              { label: 'Groups', value: groups.filter(g => g.isMember).length },
              { label: 'Stamps', value: earnedStamps.length },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '10px 6px', textAlign: 'center', border: '1px solid rgba(201,162,39,0.2)' }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#c9a227' }}>{s.value}</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{s.label.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earned Stamps */}
        {earnedStamps.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <p className="section-label">Earned Stamps</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {earnedStamps.map(s => (
                <div key={s.id} style={{ background: `${s.color}15`, border: `1px solid ${s.color}44`, borderRadius: 16, padding: '14px 8px', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon.split('M').filter(Boolean).map((seg: string, i: number) => <path key={i} d={'M' + seg} />)}
                    </svg>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: s.color }}>{s.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, lineHeight: 1.3 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {matches.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <p className="section-label">Upcoming Matches</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {matches.map((m: any) => (
                <div key={m.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={m.homeLogo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{m.homeTeamCode}</span>
                    <span style={{ color: 'var(--text3)', fontSize: 11 }}>vs</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{m.awayTeamCode}</span>
                    <img src={m.awayLogo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} onError={(e: any) => e.target.style.display='none'} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{new Date(m.kickoffAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stamps to Earn */}
        <section>
          <p className="section-label">Earn More Stamps</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {unearnedStamps.map(s => {
              const { label, action } = getActionLabel(s);
              return (
                <div key={s.id} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon.split('M').filter(Boolean).map((seg: string, i: number) => <path key={i} d={'M' + seg} />)}
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{s.desc}</p>
                  </div>
                  <button
                    onClick={action}
                    disabled={claiming === s.id}
                    style={{ padding: '8px 14px', borderRadius: 10, background: s.color, color: s.id === 'final_witness' || s.color === '#ffd700' || s.color === '#c9a227' ? '#000' : 'white', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', flexShrink: 0, opacity: claiming === s.id ? 0.6 : 1 }}>
                    {claiming === s.id ? '...' : label}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

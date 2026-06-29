'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function FansPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [followRequests, setFollowRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<'discover' | 'requests'>('discover');
  const [busy, setBusy] = useState<string | null>(null);

  const load = async (q?: string) => {
    if (!userId) return;
    setLoading(true);
    const url = q && q.length >= 2 ? `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${q}` : `${process.env.NEXT_PUBLIC_API_URL}/users/suggestions`;
    const res = await fetch(url, { headers: { 'x-user-id': userId }, cache: 'no-store' });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadRequests = async () => {
    if (!userId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/follow-requests`, { headers: { 'x-user-id': userId } });
    const data = await res.json();
    setFollowRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (userId) {
      load();
      loadRequests();
      const i = setInterval(loadRequests, 10000);
      // Re-fetch when user returns to this page
      const onFocus = () => { load(); loadRequests(); };
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) { load(); loadRequests(); } });
      return () => { clearInterval(i); window.removeEventListener('focus', onFocus); };
    }
  }, [userId]);

  useEffect(() => { const t = setTimeout(() => { if (userId) load(search); }, 400); return () => clearTimeout(t); }, [search]);

  const follow = async (targetId: string) => {
    setBusy(targetId);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${targetId}/follow-request`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setUsers(u => u.map(x => x.id === targetId ? { ...x, followStatus: 'requested' } : x));
    setBusy(null);
    load();
  };

  const unfollow = async (targetId: string) => {
    if (!confirm('Unfollow? Your chat with this person will also be removed.')) return;
    setBusy(targetId);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${targetId}/unfollow`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setUsers(u => u.map(x => x.id === targetId ? { ...x, followStatus: null, canChat: false } : x));
    setBusy(null);
  };

  const cancelRequest = async (targetId: string) => {
    setBusy(targetId);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${targetId}/unfollow`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setUsers(u => u.map(x => x.id === targetId ? { ...x, followStatus: null } : x));
    setBusy(null);
  };

  const startChat = async (clerkId: string) => {
    setBusy(clerkId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/dm/${clerkId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId || '' },
      body: JSON.stringify({ content: '👋 Hey!' }),
    });
    const data = await res.json();
    setBusy(null);
    router.push(data.conversationId ? `/messages/${data.conversationId}` : '/messages');
  };

  const acceptRequest = async (requestId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/follow-requests/${requestId}/accept`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    loadRequests(); load();
  };

  const declineRequest = async (requestId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/follow-requests/${requestId}/decline`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    loadRequests();
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="fifa-font" style={{ fontSize: 28, color: '#e8003d' }}>FIND FANS</h1>
          <p style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Connect with fans worldwide</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: tab === 'discover' ? 10 : 0 }}>
            <button onClick={() => setTab('discover')} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', background: tab === 'discover' ? '#7b2fff' : 'var(--bg3)', color: tab === 'discover' ? 'white' : 'var(--text2)' }}>Discover</button>
            <button onClick={() => { setTab('requests'); loadRequests(); }} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', background: tab === 'requests' ? '#7b2fff' : 'var(--bg3)', color: tab === 'requests' ? 'white' : 'var(--text2)', position: 'relative' }}>
              Requests {followRequests.length > 0 && <span style={{ position: 'absolute', top: -6, right: -4, background: '#e8003d', color: 'white', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{followRequests.length}</span>}
            </button>
          </div>
          {tab === 'discover' && <div style={{ width: '100%', marginBottom: 12 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, country, team..." className="input" style={{ width: '100%', boxSizing: 'border-box' }} /></div>}
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        {tab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {followRequests.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px' }}><p style={{ fontSize: 48, marginBottom: 12 }}>🔔</p><p style={{ color: 'var(--text2)', fontWeight: 600 }}>No pending requests</p></div>}
            {followRequests.map((req: any) => (
              <div key={req.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }} onClick={() => router.push(`/fans/${req.from?.id}`)}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'var(--text2)', cursor: 'pointer' }}>
                    {req.from?.avatarUrl ? <img src={req.from.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : req.from?.displayName?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1, cursor: 'pointer' }}>
                    <p style={{ fontWeight: 800 }}>{req.from?.displayName}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                      {req.from?.nationality && <span style={{ fontSize: 11, color: 'var(--text2)' }}>🌍 {req.from.nationality}</span>}
                      {req.from?.supportedTeam && <span style={{ fontSize: 11, color: '#7b2fff' }}>⚽ {req.from.supportedTeam}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => acceptRequest(req.id)} style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#7b2fff', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Accept</button>
                  <button onClick={() => declineRequest(req.id)} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 700, border: '1px solid var(--border)', cursor: 'pointer' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'discover' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!search && <p className="section-label">Suggested Fans</p>}
            {loading && [1,2,3,4].map(i => <div key={i} className="card" style={{ height: 80, opacity: 0.3 }}/>)}
            {!loading && users.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px' }}><p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p><p style={{ color: 'var(--text2)', fontWeight: 600 }}>No fans found</p></div>}
            {users.map(u => {
              const isBusy = busy === u.id || busy === u.clerkId;
              return (
                <div key={u.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push(`/fans/${u.id}`)}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'var(--text2)' }}>
                    {u.avatarUrl ? <img src={u.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.displayName?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.displayName || u.username}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                      {u.nationality && <span style={{ fontSize: 11, color: 'var(--text2)' }}>🌍 {u.nationality}</span>}
                      {u.supportedTeam && <span style={{ fontSize: 11, color: '#7b2fff', fontWeight: 600 }}>⚽ {u.supportedTeam}</span>}
                    </div>
                    {u.bio && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.bio}</p>}
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>{u._count?.followers || 0} followers</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'stretch', minWidth: 95 }}>
                    {u.canChat && (
                      <button onClick={e => { e.stopPropagation(); startChat(u.clerkId); }} disabled={isBusy} style={{ padding: '8px 10px', borderRadius: 10, background: '#00c2a8', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 12, opacity: isBusy ? 0.6 : 1 }}>
                        {isBusy ? '...' : 'Message'}
                      </button>
                    )}

                    {u.followStatus === 'requested' && (
                      <button onClick={e => { e.stopPropagation(); cancelRequest(u.id); }} disabled={isBusy} style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 700, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12 }}>
                        Requested
                      </button>
                    )}
                    {!u.followStatus && (
                      <button onClick={e => { e.stopPropagation(); follow(u.id); }} disabled={isBusy} style={{ padding: '8px 10px', borderRadius: 10, background: '#7b2fff', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 12, opacity: isBusy ? 0.6 : 1 }}>
                        {isBusy ? '...' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

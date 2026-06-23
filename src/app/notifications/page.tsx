'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function NotificationsPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, { headers: { 'x-user-id': userId } });
    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { if (userId) load(); }, [userId]);

  const accept = async (actionId: string, notifId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/follow-requests/${actionId}/accept`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setNotifications(n => n.map(x => x.id === notifId ? { ...x, done: true, message: x.message.replace('sent you a follow request', 'is now following you') } : x));
  };

  const decline = async (actionId: string, notifId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/follow-requests/${actionId}/decline`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setNotifications(n => n.filter(x => x.id !== notifId));
  };

  const getIcon = (type: string) => {
    if (type === 'follow_request') return '👥';
    if (type === 'request_accepted') return '✅';
    if (type === 'new_follower') return '❤️';
    return '🔔';
  };

  const getColor = (type: string) => {
    if (type === 'follow_request') return '#7b2fff';
    if (type === 'request_accepted') return '#00e676';
    if (type === 'new_follower') return '#e8003d';
    return '#00c2a8';
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="fifa-font" style={{ fontSize: 24, color: '#e8003d' }}>NOTIFICATIONS</h1>
          <button onClick={load} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18, cursor: 'pointer' }}>↻</button>
        </div>
      </header>

      <main className="inner" style={{ paddingBottom: 100 }}>
        {loading && [1,2,3,4].map(i => <div key={i} className="card" style={{ height: 72, marginBottom: 10, opacity: 0.3 }}/>)}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🔔</p>
            <p style={{ color: 'var(--text2)', fontWeight: 600 }}>No notifications yet</p>
            <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 6 }}>When fans follow you or accept your requests, you'll see them here</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding: 14, borderLeft: `3px solid ${getColor(n.type)}`, opacity: n.done ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className="avatar" style={{ width: 46, height: 46, fontSize: 18, border: `2px solid ${getColor(n.type)}44` }}>
                    {n.user?.avatarUrl ? <img src={n.user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : n.user?.displayName?.[0] || '?'}
                  </div>
                  <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 14 }}>{getIcon(n.type)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                    {n.user?.nationality && <span style={{ fontSize: 11, color: 'var(--text3)' }}>🌍 {n.user.nationality}</span>}
                    {n.user?.supportedTeam && <span style={{ fontSize: 11, color: '#7b2fff' }}>⚽ {n.user.supportedTeam}</span>}
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {n.user && (
                    <button onClick={() => router.push(`/fans/${n.user.id}`)} style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 600, fontSize: 11, border: '1px solid var(--border)', cursor: 'pointer', marginBottom: 6, display: 'block' }}>
                      View
                    </button>
                  )}
                </div>
              </div>
              {n.type === 'follow_request' && !n.done && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => accept(n.actionId, n.id)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: '#7b2fff', color: 'white', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>Accept</button>
                  <button onClick={() => decline(n.actionId, n.id)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 700, fontSize: 13, border: '1px solid var(--border)', cursor: 'pointer' }}>Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

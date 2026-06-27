'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function FollowersPage({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}/followers`, { headers: { 'x-user-id': userId || '' } })
      .then(r => r.json()).then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); });
  }, [params.id]);

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#e8003d', padding: 0, fontWeight: 900 }}>←</button>
          <h1 className="fifa-font" style={{ fontSize: 22, color: '#e8003d' }}>FOLLOWERS</h1>
        </div>
      </header>
      <main className="inner" style={{ paddingBottom: 100 }}>
        {loading && [1,2,3].map(i => <div key={i} className="card" style={{ height: 70, marginBottom: 10, opacity: 0.3 }}/>)}
        {!loading && users.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px' }}><p style={{ color: 'var(--text2)' }}>No followers yet</p></div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {users.map(u => (
            <div key={u.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push(`/fans/${u.id}`)}>
              <div className="avatar" style={{ width: 46, height: 46, fontSize: 18, border: '2px solid #e8003d44' }}>
                {u.avatarUrl ? <img src={u.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.displayName?.[0] || '?'}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{u.displayName}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  {u.nationality && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{u.nationality}</span>}
                  {u.supportedTeam && <span style={{ fontSize: 11, color: '#7b2fff', fontWeight: 600 }}>{u.supportedTeam}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

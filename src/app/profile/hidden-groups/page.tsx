'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function HiddenGroupsPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/hidden`, { headers: { 'x-user-id': userId } });
    const data = await res.json();
    setGroups(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { if (userId) load(); }, [userId]);

  const unhide = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${id}/unhide`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setGroups(g => g.filter(x => x.id !== id));
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#7b2fff', padding: 0 }}>←</button>
          <h1 className="fifa-font" style={{ fontSize: 22, color: '#7b2fff' }}>HIDDEN GROUPS</h1>
        </div>
      </header>
      <main className="inner" style={{ paddingBottom: 100 }}>
        {loading && [1,2,3].map(i => <div key={i} className="card" style={{ height: 70, marginBottom: 10, opacity: 0.3 }}/>)}
        {!loading && groups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>👁️</p>
            <p style={{ color: 'var(--text2)', fontWeight: 600 }}>No hidden groups</p>
          </div>
        )}
        {groups.map(g => (
          <div key={g.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#00e67222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>●</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text2)' }}>📍 {g.citySlug}</p>
            </div>
            <button onClick={() => unhide(g.id)} style={{ padding: '7px 14px', borderRadius: 10, background: '#00e676', color: '#000', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>Unhide</button>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}

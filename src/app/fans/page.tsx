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
  const [following, setFollowing] = useState<string[]>([]);
  const [messaging, setMessaging] = useState<string | null>(null);

  const load = async (q?: string) => {
    setLoading(true);
    const url = q && q.length >= 2
      ? `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${q}`
      : `${process.env.NEXT_PUBLIC_API_URL}/users/suggestions`;
    const res = await fetch(url, { headers: { 'x-user-id': userId || '' } });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { if (userId) load(); }, [userId]);
  useEffect(() => {
    const t = setTimeout(() => { if (userId) load(search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const toggleFollow = async (targetId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${targetId}/follow`, {
      method: 'POST',
      headers: { 'x-user-id': userId || '' },
    });
    const data = await res.json();
    setFollowing(f => data.following ? [...f, targetId] : f.filter(x => x !== targetId));
  };

  const startChat = async (targetClerkId: string) => {
    setMessaging(targetClerkId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/dm/${targetClerkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId || '' },
      body: JSON.stringify({ content: '👋 Hey!' }),
    });
    const data = await res.json();
    setMessaging(null);
    if (data.conversationId) {
      router.push(`/messages/${data.conversationId}`);
    } else {
      router.push('/messages');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">Find Fans</h1>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, country, team..."
          className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
        />
      </header>

      <main className="px-4 py-4 space-y-3">
        {!search && <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Suggested Fans</p>}
        {loading && <p className="text-center text-gray-500 py-8 animate-pulse">Finding fans...</p>}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400">No fans found.</p>
          </div>
        )}
        {users.map(u => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <span className="text-yellow-500 font-bold text-lg">{u.displayName?.[0] || '?'}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{u.displayName || u.username}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {u.nationality && <span className="text-xs text-gray-400">🌍 {u.nationality}</span>}
                  {u.supportedTeam && <span className="text-xs text-gray-400">⚽ {u.supportedTeam}</span>}
                </div>
                {u.bio && <p className="text-xs text-gray-500 mt-1 truncate">{u.bio}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleFollow(u.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${following.includes(u.id) ? 'bg-gray-700 text-gray-300' : 'bg-yellow-500 text-black'}`}
              >
                {following.includes(u.id) ? '✓ Following' : '+ Follow'}
              </button>
              <button
                onClick={() => startChat(u.clerkId)}
                disabled={messaging === u.clerkId}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-800 border border-gray-700 text-white disabled:opacity-50"
              >
                {messaging === u.clerkId ? '...' : '💬 Message'}
              </button>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}

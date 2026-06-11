'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MessagesPage() {
  const { userId } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/connections`, {
      headers: { 'x-user-id': userId }
    }).then(r => r.json()).then(data => {
      setConnections(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">Messages</h1>
        <p className="text-xs text-gray-500">Chat with your fan connections</p>
      </header>
      <main className="px-4 py-4 space-y-3">
        {loading && <p className="text-center text-gray-500 py-8 animate-pulse">Loading messages...</p>}
        {!loading && connections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-400 text-sm">No connections yet.</p>
            <a href="/fans" className="text-yellow-500 text-sm mt-2 inline-block">Find fans to connect with →</a>
          </div>
        )}
        {connections.map((c: any) => {
          const other = c.sender?.clerkId === userId ? c.receiver : c.sender;
          return (
            <a key={c.id} href={`/messages/${c.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-3 block">
              <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                {other?.avatarUrl
                  ? <img src={other.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <span className="text-yellow-500 font-bold text-lg">{other?.displayName?.[0] || '?'}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{other?.displayName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{other?.supportedTeam ? `⚽ ${other.supportedTeam}` : 'Fan'}</p>
              </div>
              <span className="text-gray-600 text-lg">→</span>
            </a>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
}

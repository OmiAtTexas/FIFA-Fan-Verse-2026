'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { BottomNav } from '@/components/ui/BottomNav';

export default function MessagesPage() {
  const { userId } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readMap, setReadMap] = useState<{[key: string]: string}>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const load = () => {
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, { headers: { 'x-user-id': userId } })
      .then(r => r.json()).then(data => {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dm_read_map') || '{}');
      setReadMap(saved);
    } catch (e) {}
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [userId]);

  const markRead = (convId: string, lastMsgAt: string) => {
    const updated = { ...readMap, [convId]: lastMsgAt };
    setReadMap(updated);
    localStorage.setItem('dm_read_map', JSON.stringify(updated));
    localStorage.setItem('dm_last_seen', Date.now().toString());
  };

  const deleteConv = async (convId: string) => {
    if (!confirm('Delete this conversation? This cannot be undone and will remove all messages.')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations/${convId}`, { method: 'DELETE', headers: { 'x-user-id': userId || '' } });
    setConversations(cs => cs.filter(x => x.id !== convId));
    setMenuOpen(null);
  };

  const isUnread = (conv: any) => {
    if (!conv.lastMessageAt) return false;
    if (!conv.lastMessage) return false;
    if (conv.lastMessageSenderClerkId === userId) return false;
    const lastRead = readMap[conv.id];
    if (!lastRead) return true;
    return new Date(conv.lastMessageAt) > new Date(lastRead);
  };

  const unreadCount = conversations.filter(isUnread).length;

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="fifa-font" style={{ fontSize: 28, color: '#e8003d' }}>MESSAGES</h1>
            <p style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase' }}>Your direct messages</p>
          </div>
          {unreadCount > 0 && (
            <div style={{ background: '#e8003d', color: 'white', fontWeight: 800, fontSize: 12, minWidth: 24, height: 24, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              {unreadCount}
            </div>
          )}
        </div>
      </header>

      <main className="inner" style={{ paddingBottom: 100 }}>
        {loading && [1,2,3].map(i => <div key={i} className="card" style={{ height: 72, marginBottom: 10, opacity: 0.3 }}/>)}
        {!loading && conversations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No messages yet</p>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>Follow fans and start chatting!</p>
            <a href="/fans" style={{ padding: '12px 24px', borderRadius: 12, background: '#e8003d', color: 'white', fontWeight: 800, textDecoration: 'none', fontSize: 14 }}>Find Fans</a>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversations.map((c: any) => {
            const unread = isUnread(c);
            return (
              <a key={c.id} href={`/messages/${c.id}`} onClick={() => markRead(c.id, c.lastMessageAt)} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', borderLeft: `3px solid ${unread ? '#e8003d' : '#00c2a8'}` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className="avatar" style={{ width: 50, height: 50, fontSize: 20, border: `2px solid ${unread ? '#e8003d44' : '#00c2a844'}` }}>
                    {c.other?.avatarUrl ? <img src={c.other.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.other?.displayName?.[0] || '?'}
                  </div>
                  {unread && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: '#e8003d', border: '2px solid var(--bg2)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: unread ? 900 : 700, fontSize: 15 }}>{c.other?.displayName || 'Fan'}</p>
                  <p style={{ fontSize: 12, color: unread ? 'var(--text2)' : 'var(--text3)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: unread ? 700 : 400 }}>{c.lastMessage || 'Say hello!'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  {c.lastMessageAt && <p style={{ fontSize: 10, color: unread ? '#e8003d' : 'var(--text3)', fontWeight: unread ? 700 : 400 }}>{new Date(c.lastMessageAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>}
                  {unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e8003d' }} />}
                  <div style={{ position: 'relative' }} onClick={e => e.preventDefault()}>
                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id); }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, padding: '2px 6px', lineHeight: 1 }}>⋯</button>
                    {menuOpen === c.id && (
                      <div onClick={e => e.preventDefault()} style={{ position: 'absolute', right: 0, bottom: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 8, zIndex: 100, minWidth: 140, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                        <button onClick={() => deleteConv(c.id)} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#e8003d', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 8 }}>Delete Chat</button>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

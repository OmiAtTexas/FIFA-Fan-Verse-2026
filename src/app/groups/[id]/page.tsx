'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

const REACTIONS = ['❤️','😂','😮','🔥','👍','😢'];

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [group, setGroup] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [activeMsg, setActiveMsg] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}/messages`);
    if (res.ok) { const data = await res.json(); setMessages(Array.isArray(data) ? data : []); }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}`, { headers: { 'x-user-id': userId || '' } })
      .then(r => r.json()).then(setGroup);
    loadMessages();
    const i = setInterval(loadMessages, 3000);
    return () => clearInterval(i);
  }, [params.id, userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const join = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}/join`, { method: 'POST', headers: { 'x-user-id': userId || '' } });
    setGroup((g: any) => ({ ...g, isMember: true }));
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    setError('');
    setSending(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId || '' },
      body: JSON.stringify({ content: input.trim() }),
    });
    if (!res.ok) { const d = await res.json(); setError(d.message || 'Failed to send'); }
    else { setInput(''); loadMessages(); }
    setSending(false);
  };

  const deleteMsg = async (msgId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}/messages/${msgId}`, {
      method: 'DELETE', headers: { 'x-user-id': userId || '' },
    });
    setMessages(m => m.filter(x => x.id !== msgId));
    setActiveMsg(null);
  };

  const addReaction = (msgId: string, emoji: string) => {
    setReactions(r => {
      const current = r[msgId] || [];
      if (current.includes(emoji)) return { ...r, [msgId]: current.filter(e => e !== emoji) };
      return { ...r, [msgId]: [...current, emoji] };
    });
    setActiveMsg(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }} onClick={() => setActiveMsg(null)}>
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#00e676', padding: 0, fontWeight: 900 }}>←</button>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: '#00e67222', border: '1px solid #00e67644', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {group?.isOfficial ? '🏟️' : '🔒'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 15 }}>{group?.name || 'Loading...'}</p>
            <p style={{ fontSize: 11, color: 'var(--text2)' }}>👥 {group?._count?.members || 0} members</p>
          </div>
          {!group?.isMember && group?.isPublic && (
            <button onClick={join} style={{ padding: '7px 14px', borderRadius: 10, background: '#00e676', color: '#000', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>Join</button>
          )}
        </div>
      </header>

      {group?.isOfficial && (
        <div style={{ background: 'rgba(0,230,118,0.05)', borderBottom: '1px solid rgba(0,230,118,0.1)', padding: '6px 16px' }}>
          <p style={{ fontSize: 10, color: '#00e676', textAlign: 'center' }}>📋 No racism, hate speech, or abusive language. 3 violations = 24hr ban.</p>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 80 }} onClick={() => setActiveMsg(null)}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>💬</p>
            <p style={{ color: 'var(--text2)', fontWeight: 600 }}>No messages yet</p>
          </div>
        )}
        {messages.map((m: any, i: number) => {
          const isMe = m.sender?.clerkId === userId;
          const msgReactions = reactions[m.id] || [];
          const isActive = activeMsg === m.id;

          return (
            <div key={m.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6, marginBottom: msgReactions.length > 0 ? 20 : 10, position: 'relative' }}>
              {!isMe && (
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>
                  {m.sender?.avatarUrl ? <img src={m.sender.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.sender?.displayName?.[0] || '?'}
                </div>
              )}
              <div style={{ maxWidth: '75%', position: 'relative' }}>
                {!isMe && <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>{m.sender?.displayName}</p>}

                {/* Reaction/delete popup */}
                {isActive && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: '100%', [isMe ? 'right' : 'left']: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 10px', display: 'flex', gap: 6, marginBottom: 6, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap', alignItems: 'center' }}>
                    {REACTIONS.map(emoji => (
                      <button key={emoji} onClick={() => addReaction(m.id, emoji)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '2px 3px' }}>{emoji}</button>
                    ))}
                    {isMe && (
                      <button onClick={() => deleteMsg(m.id)} style={{ background: 'rgba(232,0,61,0.15)', border: 'none', color: '#e8003d', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 10px', borderRadius: 99, marginLeft: 4 }}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                )}

                <div
                  onClick={e => { e.stopPropagation(); setActiveMsg(isActive ? null : m.id); }}
                  style={{ padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? '#00e676' : 'var(--bg2)', color: isMe ? '#000' : 'var(--text)', fontSize: 14, border: isMe ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}>
                  {m.content}
                </div>

                {/* Reactions display */}
                {msgReactions.length > 0 && (
                  <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    {Array.from(new Set(msgReactions)).map((emoji: any) => (
                      <span key={emoji} onClick={() => addReaction(m.id, emoji)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 99, padding: '2px 7px', fontSize: 12, cursor: 'pointer' }}>
                        {emoji} {msgReactions.filter(e => e === emoji).length}
                      </span>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: 9, color: 'var(--text3)', marginTop: 3, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div style={{ background: 'rgba(232,0,61,0.1)', border: '1px solid rgba(232,0,61,0.3)', margin: '0 16px 8px', borderRadius: 10, padding: '8px 12px' }}>
          <p style={{ fontSize: 12, color: '#e8003d', textAlign: 'center' }}>⛔ {error}</p>
        </div>
      )}

      {!group?.isMember ? (
        <div style={{ padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Join this group to send messages</p>
          {group?.isPublic && <button onClick={join} style={{ padding: '10px 32px', borderRadius: 12, background: '#00e676', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Join Group</button>}
        </div>
      ) : (
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." className="input" style={{ flex: 1 }} />
          <button onClick={send} disabled={sending || !input.trim()} style={{ padding: '11px 16px', borderRadius: 12, background: '#00e676', color: '#000', fontWeight: 900, fontSize: 18, border: 'none', cursor: 'pointer', opacity: !input.trim() ? 0.5 : 1 }}>→</button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { io, Socket } from 'socket.io-client';
import { BottomNav } from '@/components/ui/BottomNav';

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [group, setGroup] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${params.id}`)
      .then(r => r.json()).then(setGroup);

    const s = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '', {
      path: '/socket.io',
      query: { clerkId: userId },
    });

    s.emit('joinGroup', { groupId: params.id });
    s.on('groupHistory', (msgs: any[]) => setMessages(msgs));
    s.on('newGroupMessage', (msg: any) => setMessages(m => [...m, msg]));
    setSocket(s);

    return () => { s.disconnect(); };
  }, [params.id, userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim() || !socket) return;
    socket.emit('sendGroupMessage', { groupId: params.id, content: input.trim(), clerkId: userId });
    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3 flex items-center gap-3">
        <a href="/groups" className="text-yellow-500 text-xl">←</a>
        <div>
          <h1 className="font-bold text-sm">{group?.name || 'Loading...'}</h1>
          <p className="text-xs text-gray-500">📍 {group?.citySlug?.replace(/_/g, ' ')}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.sender?.clerkId === userId ? 'justify-end' : 'justify-start'}`}>
            {m.sender?.clerkId !== userId && (
              <div className="w-7 h-7 rounded-full bg-yellow-900 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-bold text-yellow-500">
                {m.sender?.displayName?.[0] || '?'}
              </div>
            )}
            <div className={`max-w-[75%] ${m.sender?.clerkId === userId ? 'items-end' : 'items-start'} flex flex-col`}>
              {m.sender?.clerkId !== userId && (
                <p className="text-[10px] text-gray-500 mb-1 ml-1">{m.sender?.displayName}</p>
              )}
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.sender?.clerkId === userId ? 'bg-yellow-500 text-black' : 'bg-gray-900 border border-gray-800 text-white'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
        />
        <button onClick={send} className="bg-yellow-500 text-black font-bold px-5 rounded-xl">→</button>
      </div>
    </div>
  );
}

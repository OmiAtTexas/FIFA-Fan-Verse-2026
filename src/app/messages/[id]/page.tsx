'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { io, Socket } from 'socket.io-client';

export default function DMPage({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [other, setOther] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [toClerkId, setToClerkId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/connections/${params.id}`, {
      headers: { 'x-user-id': userId }
    }).then(r => r.json()).then(data => {
      const otherUser = data.sender?.clerkId === userId ? data.receiver : data.sender;
      setOther(otherUser);
      setToClerkId(otherUser?.clerkId || '');
    });

    const s = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '', {
      path: '/socket.io',
      query: { clerkId: userId },
    });

    s.on('newDM', (msg: any) => setMessages(m => [...m, msg]));
    setSocket(s);
    return () => { s.disconnect(); };
  }, [params.id, userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim() || !socket || !toClerkId) return;
    socket.emit('sendDM', { toClerkId, content: input.trim(), fromClerkId: userId });
    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3 flex items-center gap-3">
        <a href="/messages" className="text-yellow-500 text-xl">←</a>
        <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-yellow-500 font-bold text-sm">
          {other?.displayName?.[0] || '?'}
        </div>
        <div>
          <h1 className="font-bold text-sm">{other?.displayName || 'Loading...'}</h1>
          <p className="text-xs text-gray-500">{other?.nationality || 'Fan'}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-sm">Say hello to {other?.displayName}!</p>
          </div>
        )}
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.sender?.clerkId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.sender?.clerkId === userId ? 'bg-yellow-500 text-black' : 'bg-gray-900 border border-gray-800 text-white'}`}>
              {m.content}
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
          placeholder={`Message ${other?.displayName || ''}...`}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
        />
        <button onClick={send} className="bg-yellow-500 text-black font-bold px-5 rounded-xl">→</button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

const QUICK_PROMPTS = [
  '🏟️ Things to do before a match in Dallas',
  '🍕 Best food near MetLife Stadium NY',
  '🚌 How to get to SoFi Stadium LA',
  '🌮 Street food in Mexico City',
  '🏖️ Things to do in Miami before the match',
  '✈️ Getting from NYC to Boston for a match',
];

export default function AiPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Hey! I'm your FIFA World Cup 2026 AI companion 🌍⚽ Ask me anything about host cities, travel tips, food, transport, or match day advice!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: 'You are a helpful FIFA World Cup 2026 travel and match companion. You know everything about the 16 host cities in USA, Canada and Mexico. Give concise, practical advice about travel, food, transport, and match day experiences. Keep responses under 150 words and be friendly and enthusiastic.',
          messages: [{ role: 'user', content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, could not get a response. Try again!';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black border-b border-yellow-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">AI Guide</h1>
        <p className="text-xs text-gray-500">Your World Cup 2026 companion</p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-48">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-yellow-500 text-black font-medium' : 'bg-gray-900 border border-gray-800 text-white'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-16 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 space-y-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} className="flex-shrink-0 text-xs bg-gray-900 border border-gray-700 rounded-full px-3 py-1.5 text-gray-300 whitespace-nowrap hover:border-yellow-600">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Ask about cities, food, transport..." className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600" />
          <button onClick={() => send(input)} className="bg-yellow-500 text-black font-bold px-5 rounded-xl text-lg">→</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

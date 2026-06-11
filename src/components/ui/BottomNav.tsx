'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', emoji: '🏠', label: 'Home' },
  { href: '/matches', emoji: '⚽', label: 'Matches' },
  { href: '/fans', emoji: '👥', label: 'Fans' },
  { href: '/messages', emoji: '💬', label: 'Messages' },
  { href: '/groups', emoji: '🫂', label: 'Groups' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-t border-gray-800 flex justify-around py-2 px-1 safe-area-bottom">
      {navItems.map(({ href, emoji, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[56px] ${active ? 'text-yellow-500' : 'text-gray-600'}`}>
            <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>{emoji}</span>
            <span className={`text-[9px] font-semibold tracking-wide ${active ? 'text-yellow-500' : 'text-gray-600'}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

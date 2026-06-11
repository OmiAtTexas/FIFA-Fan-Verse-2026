'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', emoji: '🏠', label: 'Home' },
  { href: '/matches', emoji: '⚽', label: 'Matches' },
  { href: '/fans', emoji: '👥', label: 'Fans' },
  { href: '/groups', emoji: '💬', label: 'Groups' },
  { href: '/passport', emoji: '🏅', label: 'Passport' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 flex justify-around py-2 px-2">
      {navItems.map(({ href, emoji, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-yellow-500' : 'text-gray-500'}`}>
            <span className="text-xl">{emoji}</span>
            <span className={`text-[10px] font-medium ${active ? 'text-yellow-500' : 'text-gray-500'}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', emoji: '🏠', label: 'Home', color: '#e63946' },
  { href: '/matches', emoji: '⚽', label: 'Matches', color: '#ff6b35' },
  { href: '/fans', emoji: '👥', label: 'Fans', color: '#8338ec' },
  { href: '/messages', emoji: '💬', label: 'Messages', color: '#2ec4b6' },
  { href: '/groups', emoji: '🫂', label: 'Groups', color: '#06d6a0' },
  { href: '/ai', emoji: '🤖', label: 'AI', color: '#ffbe0b' },
  { href: '/passport', emoji: '🏅', label: 'Passport', color: '#e63946' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#0d0d0d', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '8px 4px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
      {navItems.map(({ href, emoji, label, color }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 6px', borderRadius: 12, textDecoration: 'none', minWidth: 40, background: active ? `${color}22` : 'transparent', transition: 'all 0.2s' }}>
            <span style={{ fontSize: 18, filter: active ? 'none' : 'grayscale(60%)' }}>{emoji}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: active ? color : '#555', letterSpacing: 0.5 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

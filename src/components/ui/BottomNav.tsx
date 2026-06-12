'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', emoji: '🏠', label: 'Home', color: '#e8003d' },
  { href: '/matches', emoji: '⚽', label: 'Matches', color: '#ff5c1a' },
  { href: '/fans', emoji: '👥', label: 'Fans', color: '#7b2fff' },
  { href: '/messages', emoji: '💬', label: 'DMs', color: '#00c2a8' },
  { href: '/groups', emoji: '🫂', label: 'Groups', color: '#00e676' },
  { href: '/ai', emoji: '🤖', label: 'AI', color: '#ffd700' },
  { href: '/passport', emoji: '🏅', label: 'Passport', color: '#ff5c1a' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, emoji, label, color }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 8px', borderRadius: 10, textDecoration: 'none',
            background: active ? `${color}20` : 'transparent', transition: 'all 0.2s',
            minWidth: 36,
          }}>
            <span style={{ fontSize: 16, filter: active ? 'none' : 'grayscale(70%) opacity(0.5)', transition: 'all 0.2s' }}>{emoji}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: active ? color : '#333', letterSpacing: 0.5, transition: 'color 0.2s' }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

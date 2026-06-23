'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', label: 'Home', color: '#e8003d', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { href: '/matches', label: 'Matches', color: '#ff5c1a', d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8l4 4-4 4-4-4z' },
  { href: '/fans', label: 'Fans', color: '#7b2fff', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { href: '/messages', label: 'DMs', color: '#00c2a8', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { href: '/groups', label: 'Groups', color: '#00e676', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { href: '/ai', label: 'AI', color: '#ffd700', d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01' },
  { href: '/passport', label: 'Passport', color: '#c9a227', d: 'M2 4h20v16H2zM12 8v8M8 12h8' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, label, color, d }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 6px', borderRadius: 10, textDecoration: 'none',
            background: active ? `${color}25` : 'transparent',
            transition: 'all 0.2s', minWidth: 36,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? color : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {d.split('M').filter(Boolean).map((seg, i) => (
                <path key={i} d={'M' + seg} />
              ))}
            </svg>
            <span style={{ fontSize: 8, fontWeight: 700, color: active ? color : 'var(--text3)', letterSpacing: 0.5 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

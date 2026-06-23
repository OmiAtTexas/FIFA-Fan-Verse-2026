'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', label: 'Home', color: '#e8003d', svg: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>, svg2: <polyline points="9 22 9 12 15 12 15 22"/> },
  { href: '/matches', label: 'Matches', color: '#ff5c1a', svg: <><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></> },
  { href: '/fans', label: 'Fans', color: '#7b2fff', svg: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { href: '/messages', label: 'DMs', color: '#00c2a8', svg: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> },
  { href: '/groups', label: 'Groups', color: '#00e676', svg: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { href: '/ai', label: 'AI', color: '#ffd700', svg: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></> },
  { href: '/passport', label: 'Passport', color: '#c9a227', svg: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></> },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, label, color, svg, svg2 }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 6px', borderRadius: 10, textDecoration: 'none',
            background: active ? `${color}25` : 'transparent',
            transition: 'all 0.2s', minWidth: 36,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s' }}>
              {svg}{svg2}
            </svg>
            <span style={{ fontSize: 8, fontWeight: 700, color: active ? color : 'var(--text3)', letterSpacing: 0.5, transition: 'color 0.2s' }}>{label}</span>
          </Link>
        );
      })}\n    </nav>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => {
      setDisplayed(children);
      setTransitioning(false);
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
      transition: 'opacity 0.18s ease, transform 0.18s ease',
    }}>
      {displayed}
    </div>
  );
}

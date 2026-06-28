'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useTransitionRouter() {
  const router = useRouter();

  const push = (href: string) => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }
    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return { push };
}

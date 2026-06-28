'use client';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export function useNavTransition() {
  const router = useRouter();
  
  const navigate = (href: string) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        startTransition(() => {
          router.push(href);
        });
      });
    } else {
      router.push(href);
    }
  };

  return navigate;
}

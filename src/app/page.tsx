'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/home'); }, []);
  return <div style={{ background: '#080c14', minHeight: '100vh' }} />;
}

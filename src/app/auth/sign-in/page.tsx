'use client';

import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/sign-in/sso-callback',
        redirectUrlComplete: '/home',
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020F2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,0,61,0.08)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -150, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(123,47,255,0.06)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', top: '30%', right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,194,168,0.05)', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 400, width: '100%', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 8 }}>🏆</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, color: '#e8003d', letterSpacing: 4, lineHeight: 1 }}>FANVERSE</h1>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#c9a227', letterSpacing: 6, lineHeight: 1 }}>2026</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 10, fontWeight: 500, letterSpacing: 1 }}>YOUR WORLD CUP COMPANION</p>
        </div>

        {/* Host countries */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 40 }}>
          {['🇺🇸 USA', '🇨🇦 Canada', '🇲🇽 Mexico'].map(c => (
            <div key={c} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{c}</div>
          ))}
        </div>

        {/* Sign in card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px 28px', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>Join the Fan Community</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginBottom: 28 }}>Connect with millions of fans worldwide</p>

          <button onClick={signInWithGoogle} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: 'white', color: '#111', fontWeight: 800, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.3)', fontSize: 11, lineHeight: 1.6 }}>
            By continuing, you agree to our Terms of Service.<br/>
            Free forever. No credit card required.
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
          {[
            { icon: '⚽', text: 'Live Scores' },
            { icon: '👥', text: 'Find Fans' },
            { icon: '🤖', text: 'AI Guide' },
            { icon: '💬', text: 'Group Chat' },
          ].map(f => (
            <div key={f.text} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

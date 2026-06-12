'use client';

import { useSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'password' | 'verify'>('email');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    setLoading(true);
    await signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/auth/sign-in/sso-callback',
      redirectUrlComplete: '/home',
    });
  };

  const handleEmail = async () => {
    if (!isLoaded || !email) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({ identifier: email });
      if (result.status === 'needs_first_factor') {
        const emailFactor = result.supportedFirstFactors?.find((f: any) => f.strategy === 'email_code');
        if (emailFactor) {
          await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: (emailFactor as any).emailAddressId });
          setStep('verify');
        } else {
          setStep('password');
        }
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!isLoaded || !code) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'email_code', code });
      if (result.status === 'complete') window.location.href = '/home';
    } catch (e: any) {
      setError(e.errors?.[0]?.message || 'Invalid code');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020F2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,0,61,0.08)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -150, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(123,47,255,0.06)', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 400, width: '100%', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: '#e8003d', letterSpacing: 4, lineHeight: 1 }}>FANVERSE</h1>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#c9a227', letterSpacing: 6, lineHeight: 1 }}>2026</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8, fontWeight: 500, letterSpacing: 2 }}>YOUR WORLD CUP COMPANION</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
            {['🇺🇸 USA', '🇨🇦 Canada', '🇲🇽 Mexico'].map(c => (
              <span key={c} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '28px', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, textAlign: 'center' }}>Join the Fan Community</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginBottom: 24 }}>Connect with millions of fans worldwide</p>

          {/* Google */}
          <button onClick={signInWithGoogle} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'white', color: '#111', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, transition: 'all 0.2s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
          </div>

          {/* Email */}
          {step === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} type="email" placeholder="Email address" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
              <button onClick={handleEmail} disabled={loading || !email} style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#e8003d', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: !email || loading ? 0.6 : 1 }}>
                {loading ? 'Sending...' : 'Continue with Email'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                No account? We'll create one for you automatically.
              </p>
            </div>
          )}

          {step === 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 4 }}>We sent a code to <strong>{email}</strong></p>
              <input value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()} type="text" placeholder="Enter 6-digit code" maxLength={6} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 18, outline: 'none', textAlign: 'center', letterSpacing: 8, fontFamily: 'Inter, sans-serif' }} />
              <button onClick={handleVerify} disabled={loading || code.length < 6} style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#e8003d', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: code.length < 6 || loading ? 0.6 : 1 }}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button onClick={() => { setStep('email'); setCode(''); setError(''); }} style={{ padding: '8px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}>← Back</button>
            </div>
          )}

          {error && <p style={{ color: '#e8003d', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{error}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
          {[{ icon: '⚽', text: 'Live Scores' }, { icon: '👥', text: 'Find Fans' }, { icon: '🤖', text: 'AI Guide' }, { icon: '💬', text: 'Group Chat' }].map(f => (
            <div key={f.text} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

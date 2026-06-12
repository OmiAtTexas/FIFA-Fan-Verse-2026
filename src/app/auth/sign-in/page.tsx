'use client';

import { useSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
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

      <div style={{ position: 'absolute', top: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,0,61,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -200, right: -150, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 400, width: '100%', zIndex: 1 }}>

        {/* Trophy + Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <img src="/trophy.png" alt="World Cup Trophy" style={{ height: 130, objectFit: 'contain', filter: 'drop-shadow(0 0 30px rgba(201,162,39,0.9)) drop-shadow(0 0 60px rgba(201,162,39,0.4))' }} />
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, letterSpacing: 6, lineHeight: 1, background: 'linear-gradient(135deg, #e8003d 0%, #ff5c1a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FANVERSE</h1>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 8, lineHeight: 1, background: 'linear-gradient(135deg, #c9a227 0%, #f0c84a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginTop: -2 }}>2026</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 8, fontWeight: 600, letterSpacing: 3 }}>YOUR WORLD CUP COMPANION · 🇺🇸 🇨🇦 🇲🇽</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '28px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, textAlign: 'center', color: 'white' }}>Join the Fan Community</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginBottom: 22 }}>Connect with millions of fans worldwide 🌍</p>

          <button onClick={signInWithGoogle} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'white', color: '#111', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
          </div>

          {step === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} type="email" placeholder="Email address" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
              <button onClick={handleEmail} disabled={loading || !email} style={{ padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #e8003d, #ff5c1a)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: !email || loading ? 0.6 : 1 }}>
                {loading ? 'Sending code...' : 'Continue with Email →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>No account? We'll create one automatically.</p>
            </div>
          )}

          {step === 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Code sent to <strong style={{ color: 'white' }}>{email}</strong></p>
              <input value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()} type="text" placeholder="000000" maxLength={6} style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 24, outline: 'none', textAlign: 'center', letterSpacing: 10, fontFamily: 'Inter, sans-serif', fontWeight: 800 }} />
              <button onClick={handleVerify} disabled={loading || code.length < 6} style={{ padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #e8003d, #ff5c1a)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: code.length < 6 || loading ? 0.6 : 1 }}>
                {loading ? 'Verifying...' : 'Verify & Enter →'}
              </button>
              <button onClick={() => { setStep('email'); setCode(''); setError(''); }} style={{ padding: '8px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer' }}>← Use different email</button>
            </div>
          )}

          {error && <p style={{ color: '#e8003d', fontSize: 12, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

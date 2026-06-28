'use client';
import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

const TEAMS = ['Brazil','Argentina','France','England','Germany','Spain','Portugal','Netherlands','Italy','Mexico','USA','Canada','Japan','South Korea','Morocco','Senegal','Australia','Belgium','Croatia','Uruguay','Ecuador','Cameroon','Ghana','Serbia','Switzerland','Poland','Denmark','Tunisia','Costa Rica'];
const COUNTRIES = ['USA','Brazil','Argentina','Mexico','England','France','Germany','Spain','Portugal','Italy','Netherlands','Japan','South Korea','Australia','Canada','Morocco','Senegal','India','China','Nigeria','South Africa','Saudi Arabia','UAE','Turkey','Poland','Colombia','Chile','Ecuador','Peru'];
const INTERESTS = ['Food & Drink','Nightlife','Culture','Photography','Tactics','Fan Zones','Stadium Tours','Local Transport','Budget Travel','Luxury Travel','History','Music','Art','Sports Betting','Fantasy Football'];
const CITIES = ['Dallas','New York/New Jersey','Los Angeles','Miami','Atlanta','Houston','Seattle','San Francisco Bay Area','Boston','Philadelphia','Kansas City','Mexico City','Guadalajara','Monterrey','Vancouver','Toronto'];

export default function EditProfilePage() {
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ displayName: '', nationality: '', supportedTeam: '', bio: '', interests: [] as string[], hostCities: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { 'x-user-id': user.id } })
      .then(r => r.json()).then(data => {
        if (data) setForm({
          displayName: data.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          nationality: data.nationality || '',
          supportedTeam: data.supportedTeam || '',
          bio: data.bio || '',
          interests: data.interests || [],
          hostCities: data.hostCities || [],
        });
      });
  }, [user]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    if (photoFile) await user?.setProfileImage({ file: photoFile });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id || '' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push('/profile'); }, 1200);
  };

  const toggleInterest = (i: string) => setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i] }));
  const toggleCity = (c: string) => setForm(f => ({ ...f, hostCities: f.hostCities.includes(c) ? f.hostCities.filter(x => x !== c) : [...f.hostCities, c] }));

  const avatarSrc = photo || user?.imageUrl;

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7b2fff', fontSize: 20, fontWeight: 900, padding: 0 }}>←</button>
          <h1 className="fifa-font" style={{ fontSize: 24, color: '#e8003d' }}>EDIT PROFILE</h1>
        </div>
      </header>

      <main className="inner" style={{ paddingBottom: 120 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
          <div onClick={() => fileRef.current?.click()} style={{ position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', border: '3px solid #7b2fff', background: 'var(--bg3)' }}>
              {avatarSrc
                ? <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#7b2fff' }}>{form.displayName?.[0] || '?'}</div>
              }
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#7b2fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 10 }}>Tap to change photo</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Display Name */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Display Name</label>
            <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your name" className="input" />
          </div>

          {/* Country */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Your Country</label>
            <select value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))} className="input">
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Team */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Team You Support</label>
            <select value={form.supportedTeam} onChange={e => setForm(f => ({ ...f, supportedTeam: e.target.value }))} className="input">
              <option value="">Select team</option>
              {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 150) }))}
              placeholder="Tell other fans about yourself..."
              className="input"
              rows={3}
              style={{ resize: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'right', marginTop: 4 }}>{form.bio.length}/150</p>
          </div>

          {/* Interests */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Interests</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} style={{ padding: '8px 14px', borderRadius: 99, fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer', background: form.interests.includes(i) ? '#e8003d' : 'var(--bg3)', color: form.interests.includes(i) ? 'white' : 'var(--text2)', transition: 'all 0.15s' }}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Host Cities */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Host Cities Visiting</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => toggleCity(c)} style={{ padding: '8px 14px', borderRadius: 99, fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer', background: form.hostCities.includes(c) ? '#7b2fff' : 'var(--bg3)', color: form.hostCities.includes(c) ? 'white' : 'var(--text2)', transition: 'all 0.15s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Save Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)', zIndex: 50 }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <button onClick={save} disabled={saving || saved} style={{ width: '100%', padding: '14px', borderRadius: 14, background: saved ? '#00e676' : '#e8003d', color: saved ? '#000' : 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

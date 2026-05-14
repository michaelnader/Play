// Play — login / signup screen
// Posts to /api/auth/login (or /api/auth/signup). On success, calls onAuth(user).

function Login({ onAuth }) {
  const { Shape, Icon } = window;
  const [mode, setMode] = React.useState('login'); // 'login' | 'signup'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!email.trim() || !password) return;
    if (mode === 'signup' && !name.trim()) {
      setError('name is required');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const url = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = mode === 'signup'
        ? { email: email.trim(), password, name: name.trim() }
        : { email: email.trim(), password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error?.message || data?.error?.code || 'authentication failed');
        setBusy(false);
        return;
      }
      onAuth?.(data.user, data.accessToken);
    } catch (err) {
      setError('network error — is the backend running?');
      setBusy(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 60, left: 60 }}>
        <div className="anim-float"><Shape.ArrowDot color="var(--tang)" size={150} /></div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 80, right: 80 }}>
        <div className="anim-float"><Shape.DotCrossDot a="var(--ocean)" b="var(--leaf)" size={130} /></div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', bottom: 70, left: 100 }}>
        <Shape.HalfDiscs a="var(--grape)" b="var(--sun)" size={120} />
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', bottom: 60, right: 80 }}>
        <div className="anim-float"><Shape.Triangles a="var(--tang)" b="var(--ocean)" size={180} /></div>
      </div>

      <form onSubmit={submit} className="anim-pop" style={{
        position: 'relative',
        zIndex: 2,
        width: 'min(440px, 92vw)',
        background: 'var(--paper)',
        border: '4px solid var(--ink)',
        borderRadius: 28,
        boxShadow: '10px 10px 0 var(--ink)',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="grainy" style={{
            background: 'var(--tang)', color: 'var(--paper)',
            border: '3px solid var(--ink)', borderRadius: 14,
            padding: '4px 14px', fontWeight: 800, fontSize: 28, lineHeight: 1,
            boxShadow: '4px 4px 0 var(--ink)',
          }}>P</div>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
            {mode === 'signup' ? 'Make an account' : 'Welcome back'}
          </div>
        </div>

        <div className="mono" style={{ fontSize: 12, opacity: 0.7, marginTop: -4 }}>
          {mode === 'signup' ? 'pick an email + password to get started' : 'sign in to keep playing'}
        </div>

        {/* mode toggle */}
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--cream-2)', borderRadius: 12, border: '2.5px solid var(--ink)' }}>
          {['login', 'signup'].map(m => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(''); }}
                disabled={busy}
                style={{
                  all: 'unset', cursor: 'pointer',
                  flex: 1, textAlign: 'center',
                  padding: '6px 8px', borderRadius: 8,
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--paper)' : 'var(--ink)',
                  fontWeight: 700, fontSize: 13, textTransform: 'capitalize',
                }}
              >{m === 'login' ? 'sign in' : 'sign up'}</button>
            );
          })}
        </div>

        {mode === 'signup' && (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>NAME</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              style={inputStyle}
            />
          </label>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>EMAIL</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>PASSWORD</span>
          <input
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            style={inputStyle}
          />
          {mode === 'signup' && (
            <span className="mono" style={{ fontSize: 10, opacity: 0.55 }}>
              at least 8 characters
            </span>
          )}
        </label>

        {error && (
          <div className="mono" style={{
            fontSize: 12,
            color: 'var(--paper)',
            background: 'var(--tang)',
            border: '2.5px solid var(--ink)',
            borderRadius: 10,
            padding: '8px 12px',
            fontWeight: 700,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary"
          style={{ justifyContent: 'center', fontSize: 17, opacity: busy ? 0.6 : 1 }}
        >
          {Icon?.Play && <Icon.Play size={16} color="var(--paper)" fill="var(--paper)" />}
          {busy
            ? (mode === 'signup' ? 'creating account…' : 'signing in…')
            : (mode === 'signup' ? 'Create account' : 'Sign in')}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  all: 'unset',
  padding: '12px 14px',
  border: '3px solid var(--ink)',
  borderRadius: 14,
  background: 'var(--cream)',
  fontWeight: 600,
  fontSize: 16,
  fontFamily: 'inherit',
};

window.Login = Login;

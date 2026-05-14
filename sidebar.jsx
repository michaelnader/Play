// Play — sidebar with past sessions

function Sidebar({ activeId, onSelect, onNewChat, onHome, user, onLogout, mobileOpen, onClose }) {
  const { Icon } = window;
  const [sessions, setSessions] = React.useState([]);

  const load = React.useCallback(() => {
    if (window.__playDemo) { setSessions([]); return; }
    const headers = window.__playAccessToken
      ? { Authorization: `Bearer ${window.__playAccessToken}` }
      : undefined;
    fetch('/api/chats', { credentials: 'same-origin', headers })
      .then(r => r.ok ? r.json() : { chats: [] })
      .then(d => {
        const rows = Array.isArray(d.chats) ? d.chats : [];
        setSessions(rows.map(c => ({
          id: c.id,
          title: c.title,
          when: relativeTime(c.updatedAt || c.createdAt),
          color: pickColor(c.id),
        })));
      })
      .catch(() => setSessions([]));
  }, []);

  React.useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('play:chats-updated', handler);
    return () => window.removeEventListener('play:chats-updated', handler);
  }, [load]);

  const displayName = user?.name || user?.username || 'You';
  const initial = (displayName.trim()[0] || 'P').toUpperCase();

  return (
    <aside className={'sidebar' + (mobileOpen ? ' open' : '')} style={{
      background: 'var(--cream-2)',
      borderRight: '3px solid var(--ink)',
      padding: '20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      overflow: 'hidden',
    }}>
      {onClose && (
        <button
          onClick={onClose}
          className="show-on-mobile"
          aria-label="close menu"
          style={{
            all: 'unset', cursor: 'pointer',
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32, borderRadius: 999,
            border: '2.5px solid var(--ink)',
            background: 'var(--paper)',
            display: 'grid', placeItems: 'center',
          }}
        >
          <Icon.Close size={14} color="var(--ink)" />
        </button>
      )}
      {/* Brand */}
      <button
        onClick={onHome}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 4px',
        }}
      >
        <div className="grainy" style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'var(--tang)', border: '3px solid var(--ink)',
          display: 'grid', placeItems: 'center', color: 'var(--paper)',
          fontWeight: 800, fontSize: 20, transform: 'rotate(-6deg)',
          boxShadow: '3px 3px 0 var(--ink)',
        }}>P</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>play<span style={{ color: 'var(--tang)' }}>.</span></div>
          <div className="mono" style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>campaign studio</div>
        </div>
      </button>

      {/* New chat — big and fun */}
      <button
        onClick={onNewChat}
        className="grainy"
        style={{
          all: 'unset',
          cursor: 'pointer',
          background: 'var(--tang)',
          color: 'var(--paper)',
          border: '3px solid var(--ink)',
          borderRadius: 18,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '5px 5px 0 var(--ink)',
          transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms',
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: '-0.02em',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-2px,-2px) rotate(-1deg)';
          e.currentTarget.style.boxShadow = '7px 7px 0 var(--ink)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0,0)';
          e.currentTarget.style.boxShadow = '5px 5px 0 var(--ink)';
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--paper)', color: 'var(--ink)',
          border: '3px solid var(--ink)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon.Plus size={18} color="var(--ink)" />
        </div>
        New jam
      </button>

      {/* Sessions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        <div className="mono" style={{ fontSize: 11, opacity: 0.6, padding: '6px 4px' }}>MY CAMPAIGNS</div>
        {sessions.length === 0 && (
          <div className="mono" style={{
            fontSize: 11, opacity: 0.55, padding: '8px 4px', lineHeight: 1.5,
          }}>
            no campaigns yet — start a new jam ↑
          </div>
        )}
        {sessions.map((s) => {
          const active = activeId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 12px',
                borderRadius: 14,
                background: active ? 'var(--paper)' : 'transparent',
                border: active ? '3px solid var(--ink)' : '3px solid transparent',
                boxShadow: active ? '4px 4px 0 var(--ink)' : 'none',
                transition: 'background 180ms, transform 180ms',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 4,
                background: s.color, border: '2.5px solid var(--ink)',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.title}
                </div>
                <div className="mono" style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>{s.when}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          background: 'var(--sun)',
          border: '3px solid var(--ink)',
          borderRadius: 16,
          padding: '14px',
          boxShadow: '4px 4px 0 var(--ink)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -10, right: -10 }} className="anim-spin-slow">
            <window.Shape.Burst color="var(--bubble)" size={36} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>
            You've got <span style={{ color: 'var(--tang)' }}>4</span> jams left this week.
          </div>
          <div className="mono" style={{ fontSize: 10, opacity: 0.7, marginTop: 6 }}>
            Resets every Monday 🌞
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px' }}>
          <div className="grainy" style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--grape)', border: '3px solid var(--ink)',
            display: 'grid', placeItems: 'center', color: 'var(--paper)',
            fontWeight: 800,
          }}>{initial}</div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="sign out"
              style={{
                all: 'unset', cursor: 'pointer',
                fontSize: 10, fontWeight: 700,
                padding: '4px 8px', borderRadius: 999,
                border: '2.5px solid var(--ink)', background: 'var(--paper)',
              }}
              className="mono"
            >
              sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function relativeTime(iso) {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');
  const diffSec = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString();
}

function pickColor(seed) {
  const colors = ['var(--tang)', 'var(--grape)', 'var(--leaf)', 'var(--ocean)', 'var(--sun)', 'var(--bubble)'];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

window.Sidebar = Sidebar;

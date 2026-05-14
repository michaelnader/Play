// Play — main app
// Manages screen state (landing -> chat), messages, mock bot responses.

function uid() { return Math.random().toString(36).slice(2, 9); }

function App() {
  const [authStatus, setAuthStatus] = React.useState('checking'); // 'checking' | 'anon' | 'authed'
  const [user, setUser] = React.useState(null);
  const [screen, setScreen] = React.useState('landing'); // 'landing' | 'chat'
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [activeSession, setActiveSession] = React.useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Close drawer when route changes
  React.useEffect(() => { setMobileSidebarOpen(false); }, [screen, activeSession]);

  // Check existing session on mount. Try /me first; if expired, try /refresh once.
  // If the backend is missing entirely (e.g. static-only deploy) drop into demo mode.
  React.useEffect(() => {
    let cancelled = false;
    const enterDemo = () => {
      window.__playDemo = true;
      setUser({ id: 'demo', email: 'guest@play.studio', name: 'Guest', plan: 'demo' });
      setAuthStatus('authed');
    };
    const restore = async () => {
      try {
        let res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        const ct = res.headers.get('content-type') || '';
        // No backend reachable: 404 / non-JSON response from the static host
        if (!res.ok && res.status !== 401) {
          if (cancelled) return;
          enterDemo();
          return;
        }
        if (res.ok && !ct.includes('application/json')) {
          if (cancelled) return;
          enterDemo();
          return;
        }
        if (res.status === 401) {
          const ref = await fetch('/api/auth/refresh', {
            method: 'POST', credentials: 'same-origin',
          });
          if (ref.ok) {
            const data = await ref.json();
            window.__playAccessToken = data.accessToken;
            res = await fetch('/api/auth/me', { credentials: 'same-origin' });
          }
        }
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAuthStatus('authed');
        } else {
          setAuthStatus('anon');
        }
      } catch {
        if (!cancelled) enterDemo();
      }
    };
    restore();
    return () => { cancelled = true; };
  }, []);

  const handleAuth = (u, accessToken) => {
    setUser(u);
    setAuthStatus('authed');
    if (accessToken) window.__playAccessToken = accessToken;
  };

  const handleLogout = async () => {
    if (window.__playDemo) { setScreen('landing'); setMessages([]); setActiveSession(null); return; }
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); } catch {}
    window.__playAccessToken = null;
    setUser(null);
    setAuthStatus('anon');
    setScreen('landing');
    setMessages([]);
    setActiveSession(null);
  };

  // Auto-scroll on new message / typing change
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, isTyping]);

  const startChat = (seed) => {
    setScreen('chat');
    setMessages([]);
    if (seed) {
      setTimeout(() => handleSend(seed), 220);
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
    setActiveSession(null);
  };

  const openChat = async (chatId) => {
    setScreen('chat');
    setActiveSession(chatId);
    setMessages([]);
    if (window.__playDemo) return;
    try {
      const res = await api(`/api/chats/${chatId}`);
      if (!res.ok) return;
      const data = await res.json();
      const next = (data.messages || []).map(m => {
        if (m.role === 'user') return { id: m.id, role: 'user', text: m.content };
        if (m.role === 'assistant') {
          const msgs = [{ id: m.id, role: 'bot', text: m.content }];
          if (Array.isArray(m.attachments) && m.attachments.length) {
            msgs.push({ id: m.id + '-att', role: 'attachments', blocks: m.attachments });
          }
          return msgs;
        }
        return null;
      }).filter(Boolean).flat();
      setMessages(next);
    } catch {}
  };

  const goHome = () => {
    setScreen('landing');
    setMessages([]);
    setInput('');
  };

  const api = async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (window.__playAccessToken) headers.Authorization = `Bearer ${window.__playAccessToken}`;
    const res = await fetch(path, { credentials: 'same-origin', ...opts, headers });
    if (res.status === 401) {
      window.__playAccessToken = null;
      setAuthStatus('anon');
    }
    return res;
  };

  const ensureActiveChat = async (firstPrompt) => {
    if (activeSession) return activeSession;
    const res = await api('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ title: firstPrompt.slice(0, 60) || 'New jam' }),
    });
    if (!res.ok) throw new Error('could not create chat');
    const data = await res.json();
    setActiveSession(data.chat.id);
    window.dispatchEvent(new CustomEvent('play:chats-updated'));
    return data.chat.id;
  };

  const handleSend = async (forcedText) => {
    const text = (forcedText ?? input).trim();
    if (!text) return;
    const userMsg = { id: uid(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (window.__playDemo) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: uid(),
          role: 'bot',
          text: "This is a frontend preview — the campaign generator runs on the backend, which isn't connected here. Ping me to wire it up!",
        }]);
        setIsTyping(false);
      }, 900);
      return;
    }

    try {
      const chatId = await ensureActiveChat(text);
      const res = await api(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: text }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText = data?.error?.message || data?.error?.code || 'something went wrong.';
        setMessages(prev => [...prev, { id: uid(), role: 'bot', text: errText }]);
        setIsTyping(false);
        return;
      }

      const assistant = (data.messages || []).find(m => m.role === 'assistant');
      if (assistant) {
        setMessages(prev => [...prev, { id: assistant.id, role: 'bot', text: assistant.content }]);
        if (Array.isArray(assistant.attachments) && assistant.attachments.length) {
          setMessages(prev => [...prev, { id: assistant.id + '-att', role: 'attachments', blocks: assistant.attachments }]);
        }
      }
      setIsTyping(false);
      window.dispatchEvent(new CustomEvent('play:chats-updated'));
    } catch (err) {
      setMessages(prev => [...prev, { id: uid(), role: 'bot', text: 'network error — is the backend running?' }]);
      setIsTyping(false);
    }
  };

  const handleSuggestion = (label) => {
    handleSend(label);
  };

  // Edit mode (Tweaks) — expose two playful theme variants
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "vibe": "carnival",
    "showSidebar": true,
    "wobble": true
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (!d) return;
      if (d.type === '__activate_edit_mode') setEditOpen(true);
      else if (d.type === '__deactivate_edit_mode') setEditOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const [editOpen, setEditOpen] = React.useState(false);

  const applyTweak = (patch) => {
    setTweaks(t => ({ ...t, ...patch }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  // Vibe variants flip CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const palettes = {
      carnival: {
        '--cream': '#F7F1E3', '--cream-2': '#EFE8D3', '--paper': '#FFFDF6',
        '--tang': '#FF5B22', '--grape': '#9B5BFF', '--leaf': '#1FB364',
        '--sun': '#FFCB2E', '--ocean': '#3D7CFF', '--bubble': '#FF7AB6',
      },
      mint: {
        '--cream': '#EAF6EE', '--cream-2': '#D7ECDD', '--paper': '#F7FFF9',
        '--tang': '#FF6E61', '--grape': '#6C4BD8', '--leaf': '#0F9F6E',
        '--sun': '#F5D547', '--ocean': '#2D6CDF', '--bubble': '#FF93C7',
      },
      sunset: {
        '--cream': '#FFEDD8', '--cream-2': '#F7DFC1', '--paper': '#FFF8EE',
        '--tang': '#E63946', '--grape': '#7B3FBF', '--leaf': '#2B9A6A',
        '--sun': '#FFB627', '--ocean': '#1F6FB2', '--bubble': '#FF6BA3',
      },
    };
    const p = palettes[tweaks.vibe] || palettes.carnival;
    Object.entries(p).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [tweaks.vibe]);

  if (authStatus === 'checking') {
    return (
      <div className="grain-bg" style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        fontFamily: 'inherit', fontWeight: 700, opacity: 0.6,
      }}>
        loading…
      </div>
    );
  }

  if (authStatus === 'anon') {
    return (
      <div className="grain-bg" style={{ minHeight: '100vh' }}>
        <window.Login onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="grain-bg" style={{ minHeight: '100vh' }}>
      {screen === 'landing' && (
        <button
          onClick={handleLogout}
          title={`signed in as ${user?.name || user?.username || ''}`}
          style={{
            all: 'unset', cursor: 'pointer',
            position: 'fixed', top: 14, right: 14, zIndex: 50,
            padding: '6px 12px', borderRadius: 999,
            border: '2.5px solid var(--ink)',
            background: 'var(--paper)',
            fontWeight: 700, fontSize: 12,
            boxShadow: '3px 3px 0 var(--ink)',
            maxWidth: 'calc(100vw - 28px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {user?.name || user?.username} · sign out
        </button>
      )}

      {screen === 'landing' ? (
        <window.Landing onStart={() => startChat()} />
      ) : (
        <div className="app-shell" style={tweaks.showSidebar ? {} : { gridTemplateColumns: '1fr' }}>
          {tweaks.showSidebar && (
            <>
              <window.Sidebar
                activeId={activeSession}
                onSelect={openChat}
                onNewChat={newChat}
                onHome={goHome}
                user={user}
                onLogout={handleLogout}
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
              />
              <div
                className={'sidebar-backdrop' + (mobileSidebarOpen ? ' open' : '')}
                onClick={() => setMobileSidebarOpen(false)}
              />
            </>
          )}
          <main style={{ minWidth: 0 }}>
            <window.ChatScreen
              messages={messages}
              isTyping={isTyping}
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              onSuggestion={handleSuggestion}
              scrollRef={scrollRef}
              onNewChat={newChat}
              onOpenSidebar={tweaks.showSidebar ? () => setMobileSidebarOpen(true) : undefined}
            />
          </main>
        </div>
      )}

      {/* Tweaks panel */}
      {editOpen && (
        <TweaksPanelInline
          tweaks={tweaks}
          setTweak={applyTweak}
          onClose={() => {
            setEditOpen(false);
            window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
          }}
        />
      )}
    </div>
  );
}

function TweaksPanelInline({ tweaks, setTweak, onClose }) {
  const { Icon } = window;
  return (
    <div style={{
      position: 'fixed',
      right: 'min(22px, 4vw)',
      bottom: 'min(22px, 4vw)',
      width: 'min(280px, calc(100vw - 32px))',
      background: 'var(--paper)',
      border: '3px solid var(--ink)',
      borderRadius: 22,
      boxShadow: '8px 8px 0 var(--ink)',
      padding: '16px 18px',
      zIndex: 100,
      fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Tweaks</div>
        <button onClick={onClose} style={{
          all: 'unset', cursor: 'pointer',
          width: 28, height: 28, borderRadius: 999, border: '2.5px solid var(--ink)',
          display: 'grid', placeItems: 'center', background: 'var(--cream-2)',
        }}><Icon.Close size={14} color="var(--ink)" /></button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>VIBE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['carnival', 'mint', 'sunset'].map(v => {
              const active = tweaks.vibe === v;
              return (
                <button key={v} onClick={() => setTweak({ vibe: v })} style={{
                  all: 'unset', cursor: 'pointer',
                  flex: 1, textAlign: 'center',
                  padding: '8px 6px',
                  border: '2.5px solid var(--ink)',
                  borderRadius: 12,
                  background: active ? 'var(--ink)' : 'var(--paper)',
                  color: active ? 'var(--paper)' : 'var(--ink)',
                  fontWeight: 700, fontSize: 13, textTransform: 'capitalize',
                }}>{v}</button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Show sidebar</span>
          <button onClick={() => setTweak({ showSidebar: !tweaks.showSidebar })} style={{
            all: 'unset', cursor: 'pointer',
            width: 44, height: 26, borderRadius: 999,
            border: '2.5px solid var(--ink)',
            background: tweaks.showSidebar ? 'var(--leaf)' : 'var(--cream-2)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 1, left: tweaks.showSidebar ? 19 : 1,
              width: 19, height: 19, borderRadius: 999,
              background: 'var(--paper)', border: '2.5px solid var(--ink)',
              transition: 'left 180ms cubic-bezier(.34,1.56,.64,1)',
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

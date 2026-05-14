// Play — chat interface
// Centered chat, playful bubbles, big inviting input, suggestion chips, typing indicator.

function MessageBubble({ m, idx }) {
  const { Icon } = window;
  if (m.role === 'user') {
    return (
      <div className="anim-bubble" style={{
        alignSelf: 'flex-end',
        maxWidth: '72%',
        background: 'var(--ink)',
        color: 'var(--paper)',
        border: '3px solid var(--ink)',
        borderRadius: '26px 26px 6px 26px',
        padding: '14px 18px',
        fontSize: 17,
        lineHeight: 1.4,
        fontWeight: 500,
        boxShadow: '5px 5px 0 var(--tang)',
        transform: 'rotate(0.3deg)',
      }}>
        {m.text}
      </div>
    );
  }
  if (m.role === 'bot') {
    return (
      <div className="anim-bubble" style={{
        alignSelf: 'flex-start',
        maxWidth: '78%',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-end',
      }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 14,
          border: '3px solid var(--ink)',
          background: 'var(--tang)',
          display: 'grid', placeItems: 'center',
          color: 'var(--paper)',
          fontWeight: 800, fontSize: 18,
          boxShadow: '3px 3px 0 var(--ink)',
          flexShrink: 0,
          transform: 'rotate(-4deg)',
        }} className="grainy">
          P
        </div>
        <div style={{
          background: 'var(--paper)',
          color: 'var(--ink)',
          border: '3px solid var(--ink)',
          borderRadius: '6px 26px 26px 26px',
          padding: '14px 18px',
          fontSize: 17,
          lineHeight: 1.4,
          fontWeight: 500,
          boxShadow: '5px 5px 0 var(--ink)',
          transform: 'rotate(-0.4deg)',
        }}>
          {m.text}
        </div>
      </div>
    );
  }
  if (m.role === 'campaign') {
    return (
      <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
        <window.CampaignDeck campaign={m.campaign} onRegenerate={m.onRegenerate} />
      </div>
    );
  }
  if (m.role === 'attachments') {
    return <AttachmentList blocks={m.blocks} />;
  }
  return null;
}

function AttachmentList({ blocks }) {
  if (!Array.isArray(blocks) || !blocks.length) return null;
  return (
    <div style={{
      alignSelf: 'stretch',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
      gap: 16,
      marginTop: 4,
    }}>
      {blocks.map((b, i) => <AttachmentCard key={i} block={b} />)}
    </div>
  );
}

const ATTACHMENT_COLORS = ['var(--bubble)', 'var(--ocean)', 'var(--leaf)', 'var(--sun)', 'var(--grape)'];

function AttachmentCard({ block }) {
  const accent = ATTACHMENT_COLORS[Math.abs(hashStr(block.kind + (block.platform || block.title || ''))) % ATTACHMENT_COLORS.length];
  return (
    <div className="anim-bubble surface" style={{
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: 999,
          border: '2.5px solid var(--ink)',
          background: accent,
          color: 'var(--paper)',
          fontWeight: 800, fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>{labelFor(block)}</span>
        {block.platform && (
          <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>
            {block.platform}
          </span>
        )}
      </div>
      {renderBody(block)}
    </div>
  );
}

function labelFor(b) {
  switch (b.kind) {
    case 'caption':  return 'caption';
    case 'hashtags': return 'hashtags';
    case 'outline':  return 'outline';
    case 'reel':     return 'reel';
    default:         return b.kind || 'block';
  }
}

function renderBody(b) {
  if (b.kind === 'caption') {
    return (
      <>
        <div style={{ fontSize: 15, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{b.text}</div>
        {Array.isArray(b.hashtags) && b.hashtags.length > 0 && (
          <div className="mono" style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>
            {b.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}
          </div>
        )}
      </>
    );
  }
  if (b.kind === 'hashtags') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(b.tags || []).map((t, i) => (
          <span key={i} className="mono" style={{
            padding: '4px 10px',
            border: '2px solid var(--ink)',
            borderRadius: 999,
            fontSize: 12, fontWeight: 600,
            background: 'var(--paper)',
          }}>{t.startsWith('#') ? t : `#${t}`}</span>
        ))}
      </div>
    );
  }
  if (b.kind === 'outline') {
    return (
      <>
        {b.title && <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>{b.title}</div>}
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(b.bullets || []).map((p, i) => (
            <li key={i} style={{ fontSize: 14, lineHeight: 1.5 }}>{p}</li>
          ))}
        </ul>
      </>
    );
  }
  if (b.kind === 'reel') {
    return (
      <>
        {b.title && <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>{b.title}</div>}
        {b.image && (
          <img
            src={b.image.startsWith('http') || b.image.startsWith('/') ? b.image : `/${b.image}`}
            alt={b.title || 'reel'}
            style={{
              width: '100%', height: 'auto',
              borderRadius: 14,
              border: '3px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {b.caption && (
          <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{b.caption}</div>
        )}
      </>
    );
  }
  return <pre style={{ fontSize: 12, overflow: 'auto' }}>{JSON.stringify(b, null, 2)}</pre>;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function TypingIndicator() {
  return (
    <div className="anim-bubble" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        border: '3px solid var(--ink)',
        background: 'var(--tang)',
        display: 'grid', placeItems: 'center',
        color: 'var(--paper)', fontWeight: 800, fontSize: 18,
        boxShadow: '3px 3px 0 var(--ink)',
        transform: 'rotate(-4deg)',
      }} className="grainy anim-wobble">P</div>
      <div style={{
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        borderRadius: '6px 26px 26px 26px',
        padding: '16px 22px',
        boxShadow: '5px 5px 0 var(--ink)',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <span className="typing-dot" style={{ background: 'var(--tang)' }} />
        <span className="typing-dot" style={{ background: 'var(--grape)' }} />
        <span className="typing-dot" style={{ background: 'var(--ocean)' }} />
      </div>
    </div>
  );
}

function SuggestionChips({ onPick }) {
  const { Icon } = window;
  const iconMap = {
    rocket: Icon.Rocket, sprout: Icon.Sprout, tag: Icon.Tag, spark: Icon.Spark, bolt: Icon.Bolt,
  };
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 14,
    }}>
      {window.PLAY_SUGGESTIONS.map((s, i) => {
        const Ic = iconMap[s.icon] || Icon.Sparkle;
        return (
          <button
            key={s.label}
            className="chip"
            onClick={() => onPick(s.label)}
            style={{ background: s.color, color: 'var(--paper)' }}
          >
            <Ic size={16} color="var(--paper)" />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function ChatInput({ value, onChange, onSend, disabled, placeholder }) {
  const { Icon } = window;
  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--paper)',
      border: '4px solid var(--ink)',
      borderRadius: 999,
      padding: '8px 8px 8px 26px',
      boxShadow: '6px 6px 0 var(--ink)',
      maxWidth: 820,
      width: '100%',
      margin: '0 auto',
      transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms',
    }}
      onFocus={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '8px 8px 0 var(--ink)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = 'translate(0,0)';
        e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink)';
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: 18,
          fontWeight: 500,
          background: 'transparent',
          fontFamily: 'inherit',
          color: 'var(--ink)',
          padding: '12px 0',
        }}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        style={{
          width: 56, height: 56, borderRadius: 999,
          border: '3px solid var(--ink)',
          background: value.trim() && !disabled ? 'var(--tang)' : 'var(--cream-2)',
          color: 'var(--paper)',
          display: 'grid', placeItems: 'center',
          cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          boxShadow: '3px 3px 0 var(--ink)',
          transition: 'transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms, background 180ms',
        }}
        onMouseEnter={(e) => {
          if (value.trim() && !disabled) {
            e.currentTarget.style.transform = 'translate(-2px, -2px) rotate(-8deg)';
            e.currentTarget.style.boxShadow = '5px 5px 0 var(--ink)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0,0)';
          e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)';
        }}
      >
        <Icon.Send size={22} color={value.trim() && !disabled ? 'var(--paper)' : 'var(--ink)'} />
      </button>
    </div>
  );
}

function EmptyChatGreeting({ onPick }) {
  const { Shape, Icon } = window;
  return (
    <div className="anim-slide" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 22,
      padding: '40px 0 14px',
      textAlign: 'center',
    }}>
      <div className="anim-float" style={{ display: 'inline-block' }}>
        <Shape.Mascot color="var(--tang)" size={140} />
      </div>
      <div>
        <div style={{
          fontSize: 'clamp(36px, 4.4vw, 56px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}>
          What are we promoting <span className="sticker-underline">today</span>?
        </div>
        <div style={{ marginTop: 14, fontSize: 18, opacity: 0.7, maxWidth: 580, marginInline: 'auto' }}>
          Tell me about the product, audience, or vibe. The more specific, the better the campaign.
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ messages, isTyping, input, setInput, onSend, onSuggestion, scrollRef, onNewChat, onOpenSidebar }) {
  const empty = messages.length === 0;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      position: 'relative',
    }}>
      {/* Top thin bar inside chat area */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12,
        padding: 'clamp(12px, 2.4vw, 18px) clamp(14px, 3vw, 36px)',
        borderBottom: '3px solid var(--ink)',
        background: 'var(--cream)',
        zIndex: 3,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              aria-label="open menu"
              className="show-on-mobile"
              style={{
                all: 'unset', cursor: 'pointer',
                width: 38, height: 38, borderRadius: 12,
                border: '3px solid var(--ink)', background: 'var(--paper)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
                boxShadow: '3px 3px 0 var(--ink)',
              }}
            >
              <window.Icon.Menu size={18} color="var(--ink)" />
            </button>
          )}
          <div className="grainy hide-on-small" style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'var(--tang)', border: '3px solid var(--ink)',
            display: 'grid', placeItems: 'center', color: 'var(--paper)',
            fontWeight: 800, fontSize: 16, transform: 'rotate(-4deg)',
            boxShadow: '3px 3px 0 var(--ink)', flexShrink: 0,
          }}>P</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>Untitled jam</div>
            <div className="mono hide-on-small" style={{ fontSize: 11, opacity: 0.6 }}>auto-saved · just now</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button className="chip" onClick={onNewChat} style={{ background: 'var(--sun)', padding: 'clamp(8px, 1.6vw, 10px) clamp(12px, 2.4vw, 16px)' }}>
            <window.Icon.Plus size={15} color="var(--ink)" />
            <span className="hide-on-small">New jam</span>
          </button>
        </div>
      </div>

      {/* Scrolling chat area */}
      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 clamp(14px, 3vw, 28px)',
      }}>
        <div style={{
          maxWidth: 980,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          paddingTop: empty ? 0 : 28,
          paddingBottom: 28,
        }}>
          {empty && <EmptyChatGreeting onPick={onSuggestion} />}
          {messages.map((m, i) => <MessageBubble key={m.id} m={m} idx={i} />)}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Input dock */}
      <div style={{
        padding: 'clamp(10px, 2.2vw, 14px) clamp(14px, 3vw, 28px) clamp(16px, 3vw, 28px)',
        background: 'linear-gradient(to top, var(--cream) 70%, rgba(247,241,227,0))',
      }}>
        {empty && <SuggestionChips onPick={onSuggestion} />}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={onSend}
          disabled={isTyping}
          placeholder={empty ? "e.g. launching a new oat milk for indie cafés…" : "keep the conversation going…"}
        />
        <div className="mono" style={{ textAlign: 'center', marginTop: 10, fontSize: 11, opacity: 0.55 }}>
          Press <kbd style={{ border: '2px solid var(--ink)', borderRadius: 6, padding: '0 6px', fontFamily: 'inherit' }}>Enter</kbd> to send · Play improvises — always double-check before posting.
        </div>
      </div>
    </div>
  );
}

window.ChatScreen = ChatScreen;

// Play — campaign output card
// Three-tab card showing Instagram / Facebook / TikTok mock post previews.

const PLATFORMS = [
  {
    key: 'instagram',
    name: 'Instagram',
    tag: '@play.studio',
    color: 'var(--bubble)',
    bg: 'linear-gradient(135deg, #FFCB2E 0%, #FF7AB6 50%, #9B5BFF 100%)',
    iconLabel: 'IG',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    tag: 'Play Studio',
    color: 'var(--ocean)',
    bg: 'var(--ocean)',
    iconLabel: 'fb',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    tag: '@playstudio',
    color: 'var(--ink)',
    bg: 'var(--ink)',
    iconLabel: 'tt',
  },
];

function PlatformBadge({ p, size = 36 }) {
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: size * 0.32,
        border: '3px solid var(--ink)',
        background: p.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--paper)',
        fontWeight: 800,
        fontSize: size * 0.42,
        letterSpacing: '-0.04em',
        boxShadow: '3px 3px 0 var(--ink)',
        flexShrink: 0,
      }}
    >
      {p.iconLabel}
    </div>
  );
}

function MockMedia({ platform, post, idx }) {
  const { Shape, Icon } = window;
  // Each platform gets a different media composition so it doesn't feel templated.
  if (platform.key === 'instagram') {
    return (
      <div style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: 'linear-gradient(140deg, #FFCB2E 0%, #FF7AB6 55%, #9B5BFF 100%)',
        borderBottom: '3px solid var(--ink)',
        overflow: 'hidden',
      }}>
        <div className="grainy" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', top: 22, left: 22, transform: 'rotate(-6deg)' }}>
          <div className="mono" style={{
            background: 'var(--paper)', border: '3px solid var(--ink)',
            padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
            boxShadow: '3px 3px 0 var(--ink)',
          }}>{post.format}</div>
        </div>
        <div style={{ position: 'absolute', top: 18, right: 22 }}>
          <Shape.Burst color="var(--paper)" size={50} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--paper)',
            border: '4px solid var(--ink)',
            borderRadius: 26,
            padding: '22px 28px',
            boxShadow: '6px 6px 0 var(--ink)',
            transform: 'rotate(-2deg)',
            maxWidth: '78%',
            textAlign: 'center',
          }}>
            <div className="mono" style={{ fontSize: 11, opacity: 0.55, marginBottom: 8 }}>HERO MOMENT</div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {post.caption.split('—')[0] || post.caption.slice(0, 60)}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 6 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: 999,
              background: i === 0 ? 'var(--paper)' : 'rgba(255,255,255,0.5)',
              border: '2px solid var(--ink)'
            }}/>
          ))}
        </div>
      </div>
    );
  }
  if (platform.key === 'facebook') {
    return (
      <div style={{
        position: 'relative',
        height: 240,
        background: 'var(--cream-2)',
        borderBottom: '3px solid var(--ink)',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ background: 'var(--ocean)', position: 'relative' }} className="grainy">
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-8deg)' }}>
              <Shape.HalfDiscs a="var(--paper)" b="var(--sun)" size={140} />
            </div>
          </div>
          <div style={{ background: 'var(--paper)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
            <div style={{ textAlign: 'left' }}>
              <div className="mono" style={{ fontSize: 11, opacity: 0.55, marginBottom: 6 }}>HEADLINE</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                {post.caption}
              </div>
              <div style={{
                marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', border: '3px solid var(--ink)', borderRadius: 999,
                fontSize: 12, fontWeight: 700, background: 'var(--sun)',
              }}>
                Learn more →
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // tiktok — vertical phone-ish
  return (
    <div style={{
      position: 'relative',
      height: 280,
      background: 'var(--ink)',
      borderBottom: '3px solid var(--ink)',
      overflow: 'hidden',
      color: 'var(--paper)',
    }}>
      <div className="grainy" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}/>
      <div style={{ position: 'absolute', top: 18, left: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{
          width: 10, height: 10, borderRadius: 999, background: 'var(--tang)',
          boxShadow: '0 0 0 3px rgba(255,91,34,0.3)'
        }} />
        <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>LIVE PREVIEW · 0:00 / 0:{(post.format.match(/(\d+)/) || ['',18])[1]}</span>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ display: 'inline-block', transform: 'rotate(-3deg)' }}>
            <div style={{
              background: 'var(--bubble)', color: 'var(--ink)',
              padding: '14px 22px', borderRadius: 18,
              border: '3px solid var(--paper)',
              fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
              boxShadow: '5px 5px 0 var(--paper)',
              lineHeight: 1.1,
            }}>
              {post.caption.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim().slice(0, 80)}
            </div>
          </div>
          <div className="mono" style={{ marginTop: 18, fontSize: 11, opacity: 0.7 }}>
            ▸ POV-style hook · trending audio
          </div>
        </div>
      </div>
      {/* right rail icons */}
      <div style={{ position: 'absolute', right: 14, bottom: 18, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {[
          { I: Icon.Heart, n: '12.4K' },
          { I: Icon.Comment, n: '482' },
          { I: Icon.Share, n: '1.1K' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <r.I size={22} color="var(--paper)" />
            <span className="mono" style={{ fontSize: 10 }}>{r.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostBody({ post }) {
  return (
    <div style={{ padding: '20px 22px 22px' }}>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35, whiteSpace: 'pre-line' }}>
        {post.body}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {post.hashtags.map((h, i) => (
          <span key={i} className="mono" style={{
            fontSize: 12, fontWeight: 700, color: 'var(--ocean)',
          }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

function CardActions({ accent, onRegenerate, regenerating }) {
  const { Icon } = window;
  const actions = [
    { I: Icon.Copy, label: 'Copy' },
    { I: Icon.Edit, label: 'Edit' },
    { I: Icon.Download, label: 'Save' },
  ];
  return (
    <div style={{
      borderTop: '3px dashed var(--ink)',
      padding: '14px 18px',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--cream)',
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {actions.map((a, i) => (
          <button key={i} className="chip" style={{ background: 'var(--paper)', padding: '8px 12px', fontSize: 13 }}>
            <a.I size={16} color="var(--ink)" />
            {a.label}
          </button>
        ))}
      </div>
      <button
        className="chip"
        onClick={onRegenerate}
        style={{
          background: accent, color: 'var(--paper)',
          padding: '8px 14px', fontSize: 13,
        }}
      >
        <span style={{ display: 'inline-flex', animation: regenerating ? 'spin-slow 0.9s linear infinite' : 'none' }}>
          <Icon.Refresh size={16} color="var(--paper)" />
        </span>
        {regenerating ? 'Re-mixing…' : 'Re-mix'}
      </button>
    </div>
  );
}

function PlatformCard({ platform, post, index, onRegenerate }) {
  const { Icon } = window;
  const [regenerating, setRegenerating] = React.useState(false);

  const handleRegen = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      onRegenerate?.();
    }, 900);
  };

  return (
    <div
      className="anim-pop"
      style={{
        animationDelay: `${260 + index * 220}ms`,
        background: 'var(--paper)',
        border: '4px solid var(--ink)',
        borderRadius: 26,
        boxShadow: '8px 8px 0 var(--ink)',
        overflow: 'hidden',
        flex: '1 1 0',
        minWidth: 280,
        transition: 'transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 220ms',
        transform: `rotate(${[-1.2, 0.5, -0.6][index] || 0}deg)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(0) translateY(-4px)`;
        e.currentTarget.style.boxShadow = '12px 12px 0 var(--ink)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${[-1.2, 0.5, -0.6][index] || 0}deg)`;
        e.currentTarget.style.boxShadow = '8px 8px 0 var(--ink)';
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '3px solid var(--ink)',
        background: 'var(--paper)',
      }}>
        <PlatformBadge p={platform} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>{platform.name}</div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{platform.tag}</div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--cream-2)',
          padding: '6px 10px', borderRadius: 999, border: '2.5px solid var(--ink)',
          fontSize: 12, fontWeight: 700,
        }}>
          <Icon.Clock size={13} color="var(--ink)" />
          {post.time}
        </div>
      </div>

      {/* Media */}
      <MockMedia platform={platform} post={post} />

      {/* Caption */}
      <PostBody post={post} />

      {/* Actions */}
      <CardActions accent={post.accent} onRegenerate={handleRegen} regenerating={regenerating} />
    </div>
  );
}

function CampaignDeck({ campaign, onRegenerate }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 1080,
      marginTop: 14,
    }}>
      {/* Brief banner */}
      <div className="anim-bubble" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'var(--sun)',
        border: '3px solid var(--ink)',
        borderRadius: 999,
        padding: '8px 16px',
        fontSize: 13, fontWeight: 700,
        boxShadow: '4px 4px 0 var(--ink)',
        marginBottom: 18,
      }}>
        <window.Icon.Sparkle size={14} color="var(--ink)" />
        Campaign · {campaign.brief}
      </div>

      <div style={{
        display: 'flex',
        gap: 22,
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}>
        {PLATFORMS.map((p, i) => (
          <PlatformCard
            key={p.key}
            platform={p}
            post={campaign.posts[p.key]}
            index={i}
            onRegenerate={() => onRegenerate?.(p.key)}
          />
        ))}
      </div>

      {/* Bottom utility row */}
      <div className="anim-slide" style={{
        animationDelay: '900ms',
        marginTop: 22,
        display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <button className="chip" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <window.Icon.Download size={15} color="var(--paper)" />
          Export all 3 as .zip
        </button>
        <button className="chip">
          <window.Icon.Refresh size={15} color="var(--ink)" />
          Re-mix the whole thing
        </button>
        <button className="chip">
          <window.Icon.Plus size={15} color="var(--ink)" />
          Add LinkedIn
        </button>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }}>
          generated in 1.8s · all copy is editable
        </span>
      </div>
    </div>
  );
}

window.CampaignDeck = CampaignDeck;
window.PLATFORMS = PLATFORMS;

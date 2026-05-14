// Play — landing screen
// Big playful wordmark, mascot, tagline, single CTA.

function Wordmark({ onLetterHover }) {
  const letters = [
    { ch: 'P', bg: 'var(--tang)', tilt: -3 },
    { ch: 'L', bg: 'var(--grape)', tilt: 2 },
    { ch: 'A', bg: 'var(--leaf)', tilt: -2 },
    { ch: 'Y', bg: 'var(--ocean)', tilt: 3 },
  ];
  const dotSize = 'clamp(28px, 6vw, 56px)';
  return (
    <div style={{
      display: 'flex',
      gap: 'clamp(6px, 1.6vw, 18px)',
      alignItems: 'flex-end',
      flexWrap: 'nowrap',
      maxWidth: '100%',
    }}>
      {letters.map((l, i) => (
        <div
          key={i}
          className="grainy"
          style={{
            background: l.bg,
            color: 'var(--paper)',
            border: '4px solid var(--ink)',
            borderRadius: 'clamp(16px, 3vw, 28px)',
            padding: '0 clamp(10px, 3.2vw, 30px)',
            fontSize: 'clamp(56px, 16vw, 200px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            transform: `rotate(${l.tilt}deg)`,
            boxShadow: 'clamp(4px, 1.2vw, 10px) clamp(4px, 1.2vw, 10px) 0 var(--ink)',
            cursor: 'pointer',
            transition: 'transform 320ms cubic-bezier(.34,1.56,.64,1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = `rotate(${-l.tilt * 1.6}deg) translateY(-10px) scale(1.04)`;
            onLetterHover?.(i);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `rotate(${l.tilt}deg) translateY(0) scale(1)`;
          }}
        >
          {l.ch}
        </div>
      ))}
      <div
        className="grainy"
        style={{
          background: 'var(--sun)',
          width: dotSize, height: dotSize, borderRadius: 999,
          border: '4px solid var(--ink)',
          alignSelf: 'flex-end',
          marginBottom: 8,
          boxShadow: '6px 6px 0 var(--ink)',
          flexShrink: 0,
        }}
      />
    </div>
  );
}

function Landing({ onStart }) {
  const { Shape } = window;

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      padding: 'clamp(20px, 4vw, 40px) clamp(20px, 5vw, 64px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        zIndex: 2,
      }}>
        <div className="mono" style={{ fontWeight: 700, fontSize: 'clamp(11px, 1.6vw, 14px)', letterSpacing: '0.04em' }}>
          PLAY<span style={{ color: 'var(--tang)' }}> ●</span>
          <span className="hide-on-small">&nbsp;&nbsp;a creative studio for campaigns</span>
        </div>
        <div className="mono hide-on-small" style={{ fontWeight: 700, fontSize: 13, opacity: 0.7 }}>
          v0.1  •  hello@play.studio
        </div>
      </div>

      {/* Decorative shapes — only on tablet+ to keep mobile clean */}
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 110, left: 60, opacity: 0.95 }}>
        <div className="anim-float"><Shape.ArrowDot color="var(--tang)" size={220} /></div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 96, right: 140 }}>
        <div className="anim-float"><Shape.DotCrossDot a="var(--ocean)" b="var(--leaf)" size={180} /></div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 380, right: 60 }}>
        <div className="anim-float" style={{ animationDuration: '5.4s' }}>
          <Shape.ChatBubble color="var(--sun)" dot="var(--tang)" size={240} />
        </div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', bottom: 80, left: 80 }}>
        <Shape.HalfDiscs a="var(--grape)" b="var(--leaf)" size={170} />
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', bottom: 60, right: 60 }}>
        <div className="anim-float"><Shape.Triangles a="var(--tang)" b="var(--ocean)" size={260} /></div>
      </div>
      <div className="hide-on-mobile" style={{ position: 'absolute', top: 280, left: '46%' }}>
        <div className="anim-spin-slow"><Shape.Burst color="var(--sun)" size={70} /></div>
      </div>

      {/* Hero — center stacked */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(24px, 4vw, 40px)',
        position: 'relative',
        zIndex: 2,
        paddingTop: 'clamp(20px, 4vw, 40px)',
        width: '100%',
      }}>
        <div className="anim-pop" style={{ animationDelay: '60ms' }}>
          <Wordmark />
        </div>

        <div className="anim-slide" style={{
          animationDelay: '280ms',
          textAlign: 'center',
          fontSize: 'clamp(18px, 3vw, 44px)',
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          maxWidth: 880,
          padding: '0 4px',
        }}>
          Describe what you want to promote.<br/>
          We'll cook up a ready-to-post campaign for Instagram, Facebook and TikTok.
        </div>

        <div className="anim-pop" style={{
          animationDelay: '500ms',
          display: 'flex',
          gap: 'clamp(10px, 2vw, 16px)',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', padding: 'clamp(14px, 2.4vw, 20px) clamp(20px, 3.6vw, 34px)' }}
            onClick={onStart}
          >
            <window.Icon.Play size={22} color="var(--paper)" fill="var(--paper)" />
            Start playing
          </button>
          <div className="mono hide-on-small" style={{ fontSize: 13, opacity: 0.6 }}>
            no sign-up · ~30 sec to first campaign
          </div>
        </div>

        {/* mini "what you get" row */}
        <div className="anim-slide" style={{ animationDelay: '700ms', display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
          {[
            { label: 'Caption + hashtags', c: 'var(--tang)' },
            { label: 'Post-time recs', c: 'var(--leaf)' },
            { label: 'Visual brief', c: 'var(--grape)' },
            { label: 'Re-mix in one click', c: 'var(--ocean)' },
          ].map((b, i) => (
            <div key={i} className="chip" style={{ background: b.c, color: 'var(--paper)' }}>
              <window.Icon.Sparkle size={12} color="var(--paper)" />
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer ticker */}
      <div className="mono" style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap',
        fontSize: 12, opacity: 0.7,
        zIndex: 2, paddingTop: 24,
      }}>
        <span>↳ built for indie brands, small studios, and people who hate corporate decks.</span>
        <span className="hide-on-small">made with too much coffee in Brooklyn ☕</span>
      </div>
    </div>
  );
}

window.Landing = Landing;

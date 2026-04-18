import { useRef, useState } from 'react'
import { T } from '../lib/designTokens'
import { useReveal } from '../hooks/useReveal'

const Contact = () => {
  const [revealRef, shown] = useReveal<HTMLElement>()
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const sRef = useRef<HTMLElement | null>(null)

  const setRef = (el: HTMLElement | null) => {
    sRef.current = el
    ;(revealRef as React.MutableRefObject<HTMLElement | null>).current = el
  }

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sRef.current?.getBoundingClientRect()
    if (!r) return
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  return (
    <section
      id="contact"
      ref={setRef}
      onMouseMove={onMove}
      style={{
        position: 'relative',
        padding: 'clamp(100px, 14vw, 160px) clamp(24px, 7vw, 120px) 60px',
        background: T.ink, color: T.cream, overflow: 'hidden',
        fontFamily: T.serif,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%`,
          width: 700, height: 700, transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(212,168,87,0.18), rgba(212,168,87,0) 65%)',
          pointerEvents: 'none',
          transition: 'left 0.8s cubic-bezier(.2,.9,.3,1), top 0.8s cubic-bezier(.2,.9,.3,1)',
        }}
      />

      <div
        style={{
          position: 'relative', maxWidth: 1040, margin: '0 auto',
          textAlign: 'center', zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: T.mono, fontSize: 12, color: T.amber,
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32,
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          04. What's next
        </div>

        <h2
          style={{
            fontSize: 'clamp(64px, 9vw, 140px)',
            lineHeight: 0.9, fontWeight: 300, letterSpacing: '-0.04em',
            margin: 0, color: T.cream,
            fontVariationSettings: `"opsz" 144, "SOFT" 40, "WONK" 1`,
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s 0.15s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          Let's make
          <br />
          <span
            style={{
              fontStyle: 'italic', fontWeight: 500, color: T.amber,
              fontVariationSettings: `"opsz" 144, "SOFT" 100, "WONK" 1`,
            }}
          >
            something
          </span>{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>together.</span>
        </h2>

        <p
          style={{
            marginTop: 44, fontSize: 19, lineHeight: 1.55, color: '#d4c5a8',
            maxWidth: 580, margin: '44px auto 0',
            fontVariationSettings: `"opsz" 18, "SOFT" 30`,
            opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s 0.3s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          I'm currently open to new opportunities — full-time, contract, or just a
          good chat. Whether you have a project idea, a question, or you just want
          to say hi, my inbox is the best way to reach me.
        </p>

        <div
          style={{
            marginTop: 52, display: 'flex', gap: 18, justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s 0.45s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          <a
            href="mailto:ab15.badar@gmail.com"
            style={{
              background: T.amber, color: T.ink, border: 'none',
              padding: '18px 36px', fontSize: 14, fontWeight: 600,
              fontFamily: T.mono, letterSpacing: 0.5, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              borderRadius: 999, textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            ab15.badar@gmail.com{' '}
            <span style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic' }}>→</span>
          </a>
        </div>

        <div
          style={{
            marginTop: 44, display: 'flex', gap: 28, justifyContent: 'center',
            fontFamily: T.mono, fontSize: 11, color: T.warmLight, letterSpacing: 0.5,
            opacity: shown ? 1 : 0,
            transition: 'all 0.9s 0.6s cubic-bezier(.2,.9,.3,1)',
            flexWrap: 'wrap',
          }}
        >
          <a href="https://github.com/AbhishekBadar" target="_blank" rel="noopener noreferrer" style={{ color: T.warmLight }}>
            github/abhishekbadar
          </a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/abhishekbadar" target="_blank" rel="noopener noreferrer" style={{ color: T.warmLight }}>
            linkedin/abhishekbadar
          </a>
          <span>·</span>
          <a href="https://medium.com/@abhishekbadar" target="_blank" rel="noopener noreferrer" style={{ color: T.warmLight }}>
            medium/@abhishekbadar
          </a>
        </div>
      </div>

      <div
        style={{
          position: 'relative', zIndex: 2,
          paddingTop: 24,
          borderTop: `1px solid rgba(212,197,168,0.12)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: T.mono, fontSize: 11, color: T.warmLight, letterSpacing: 0.5,
          maxWidth: 1280, margin: '140px auto 0',
          flexWrap: 'wrap', gap: 12,
        }}
      >
        <span>© 2026 Abhishek Badar · built with care in Pune</span>
        <span>
          design v2 · last shipped{' '}
          {new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      </div>
    </section>
  )
}

export default Contact

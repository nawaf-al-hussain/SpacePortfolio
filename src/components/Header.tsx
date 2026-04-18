import { useEffect, useState } from 'react'
import { T, scrollToId } from '../lib/designTokens'
import { useScrollProgress } from '../hooks/useReveal'

const nav = [
  { id: 'about', num: '01', label: 'About' },
  { id: 'experience', num: '02', label: 'Work' },
  { id: 'projects', num: '03', label: 'Projects' },
  { id: 'contact', num: '04', label: 'Contact' },
]

const Header = () => {
  const progress = useScrollProgress()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: scrolled ? '14px 40px' : '24px 40px',
          background: scrolled ? 'rgba(244,232,212,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(26,20,16,0.08)' : '1px solid transparent',
          transition: 'all 0.35s cubic-bezier(.2,.9,.3,1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: T.mono, fontSize: 12, color: T.warmBrown,
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: T.serif, fontStyle: 'italic', fontSize: 22,
            fontWeight: 600, color: T.ink, letterSpacing: -0.5, padding: 0,
            fontVariationSettings: `"opsz" 72, "SOFT" 80, "WONK" 1`,
          }}
        >
          ab.
        </button>

        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollToId(n.id)}
              className="hidden md:inline-flex"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: T.mono, fontSize: 12, color: T.warmBrown,
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.warmBrown)}
            >
              <span style={{ color: T.amber, marginRight: 6 }}>{n.num}</span>
              {n.label}
            </button>
          ))}
          <a
            href="/Resume_AbhishekBadar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px', border: `1px solid ${T.ink}`,
              borderRadius: 999, color: T.ink, fontSize: 11, fontWeight: 500,
              textDecoration: 'none', letterSpacing: 0.3,
            }}
          >
            Résumé ↗
          </a>
        </nav>
      </header>

      {/* Left rail */}
      <div
        className="hidden lg:block"
        style={{
          position: 'fixed', left: 24, top: '50%', zIndex: 40,
          transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center',
          fontFamily: T.mono, fontSize: 10, color: T.warmMid,
          letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        Portfolio / No. 003 / Pune, IN
      </div>

      {/* Right rail — socials */}
      <div
        className="hidden lg:flex"
        style={{
          position: 'fixed', right: 28, top: '50%', zIndex: 40,
          transform: 'translateY(-50%)',
          flexDirection: 'column', gap: 22,
          fontFamily: T.mono, fontSize: 11, color: T.warmMid,
        }}
      >
        {[
          { label: 'GitHub', href: 'https://github.com/AbhishekBadar' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhishekbadar' },
          { label: 'Medium', href: 'https://medium.com/@abhishekbadar' },
          { label: 'Email', href: 'mailto:ab15.badar@gmail.com' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              color: T.warmMid, textDecoration: 'none',
              writingMode: 'vertical-rl' as const, textOrientation: 'mixed' as const,
              letterSpacing: 2, transition: 'color 0.2s, transform 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.amber
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.warmMid
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {s.label}
          </a>
        ))}
        <div style={{ width: 1, height: 80, background: T.warmMid, margin: '8px auto 0' }} />
      </div>

      {/* Scroll progress */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 51,
          height: 2, width: `${progress * 100}%`,
          background: T.amber, transition: 'width 0.1s linear',
        }}
      />
    </>
  )
}

export default Header

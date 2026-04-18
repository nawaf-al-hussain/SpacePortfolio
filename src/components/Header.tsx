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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const goTo = (id: string) => {
    setMenuOpen(false)
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: scrolled ? '14px clamp(20px, 5vw, 40px)' : '24px clamp(20px, 5vw, 40px)',
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
            zIndex: 60, position: 'relative',
          }}
        >
          ab.
        </button>

        <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
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
            className="hidden md:inline-flex"
            style={{
              padding: '8px 16px', border: `1px solid ${T.ink}`,
              borderRadius: 999, color: T.ink, fontSize: 11, fontWeight: 500,
              textDecoration: 'none', letterSpacing: 0.3,
              alignItems: 'center', marginLeft: 8,
            }}
          >
            Résumé ↗
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: T.ink,
              padding: 8, margin: -8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 60, position: 'relative',
            }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line
                x1="1" x2="21"
                y1={menuOpen ? '1' : '2'}
                y2={menuOpen ? '15' : '2'}
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                style={{ transition: 'all 0.25s cubic-bezier(.2,.9,.3,1)' }}
              />
              <line
                x1="1" x2="21" y1="8" y2="8"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                opacity={menuOpen ? 0 : 1}
                style={{ transition: 'opacity 0.2s' }}
              />
              <line
                x1="1" x2="21"
                y1={menuOpen ? '15' : '14'}
                y2={menuOpen ? '1' : '14'}
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                style={{ transition: 'all 0.25s cubic-bezier(.2,.9,.3,1)' }}
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile nav overlay */}
      <div
        className="md:hidden"
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed', inset: 0, zIndex: 45,
          background: 'rgba(244,232,212,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 28,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.3s cubic-bezier(.2,.9,.3,1), transform 0.3s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        {nav.map((n, i) => (
          <button
            key={n.id}
            onClick={() => goTo(n.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: T.serif, fontSize: 34, fontStyle: 'italic',
              color: T.ink, letterSpacing: -0.5,
              fontVariationSettings: `"opsz" 72, "SOFT" 60, "WONK" 1`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.4s ${0.08 + i * 0.05}s cubic-bezier(.2,.9,.3,1)`,
              display: 'inline-flex', alignItems: 'baseline', gap: 12,
            }}
          >
            <span
              style={{
                color: T.amber,
                fontFamily: T.mono, fontSize: 12, fontStyle: 'normal',
                letterSpacing: 1.5,
              }}
            >
              {n.num}
            </span>
            {n.label}
          </button>
        ))}
        <a
          href="/Resume_AbhishekBadar.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          style={{
            marginTop: 16,
            padding: '12px 24px', border: `1px solid ${T.ink}`,
            borderRadius: 999, color: T.ink, fontSize: 12, fontWeight: 500,
            textDecoration: 'none', letterSpacing: 0.3,
            fontFamily: T.mono,
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
            transition: `all 0.4s ${0.08 + nav.length * 0.05}s cubic-bezier(.2,.9,.3,1)`,
          }}
        >
          Résumé ↗
        </a>
      </div>

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

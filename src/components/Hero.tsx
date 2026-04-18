import { Fragment, useEffect, useRef, useState } from 'react'
import { T, noiseBg, scrollToId } from '../lib/designTokens'

const taglines = [
  'ship AI into real products.',
  'build end-to-end systems.',
  'automate what slows teams down.',
  'fix bottlenecks and ship faster.',
  'architect it, ship it, make it fast.',
]

const words = ['Abhishek', 'Badar']
const nameLen = words.join(' ').length
const LERP = 0.22

const Hero = () => {
  const [taglineIdx, setTaglineIdx] = useState(0)
  const sectionRef = useRef<HTMLElement | null>(null)
  const spotlightRef = useRef<HTMLDivElement | null>(null)
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
  const rawMouse = useRef({ x: 0.5, y: 0.5 })
  const smoothMouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const id = setInterval(() => setTaglineIdx((i) => (i + 1) % taglines.length), 2800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const raw = rawMouse.current
      const sm = smoothMouse.current
      sm.x += (raw.x - sm.x) * LERP
      sm.y += (raw.y - sm.y) * LERP

      const rect = sectionRef.current?.getBoundingClientRect()
      if (rect && spotlightRef.current) {
        const px = sm.x * rect.width
        const py = sm.y * rect.height
        spotlightRef.current.style.transform =
          `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`
      }

      for (let i = 0; i < letterRefs.current.length; i++) {
        const el = letterRefs.current[i]
        if (!el) continue
        const letterX = (i + 0.5) / nameLen
        const dist = Math.abs(letterX - sm.x)
        const weight = Math.round(300 + (1 - Math.min(dist * 2, 1)) * 600)
        const yOff = (1 - Math.min(dist * 1.8, 1)) * -8
        el.style.fontVariationSettings =
          `"wght" ${weight}, "opsz" 144, "SOFT" 100, "WONK" 1`
        el.style.transform = `translate3d(0, ${yOff}px, 0)`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    rawMouse.current.x = (e.clientX - r.left) / r.width
    rawMouse.current.y = (e.clientY - r.top) / r.height
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={onMove}
      style={{
        position: 'relative', minHeight: '100vh', width: '100%',
        background: T.cream, color: T.ink,
        fontFamily: T.serif, overflow: 'hidden',
        paddingTop: 100,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'multiply',
          backgroundImage: noiseBg, pointerEvents: 'none',
        }}
      />

      <div
        ref={spotlightRef}
        style={{
          position: 'absolute', left: 0, top: 0,
          width: 620, height: 620,
          willChange: 'transform',
          background: 'radial-gradient(circle, rgba(212,168,87,0.42), rgba(212,168,87,0) 65%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(40px, 6vw, 80px) clamp(24px, 7vw, 120px)',
          minHeight: 'calc(100vh - 100px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: T.mono, fontSize: 13, color: T.warmMid,
            marginBottom: 28, letterSpacing: 0.3,
          }}
        >
          <span
            style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: 8,
              background: T.moss, marginRight: 10,
              boxShadow: '0 0 0 4px rgba(107,142,78,0.2)',
              animation: 'ab-pulse 2s infinite',
            }}
          />
          Software engineer · currently shipping @ Xeo
        </div>

        <h1
          className="hero-name"
          style={{
            fontSize: 'clamp(44px, 10vw, 140px)',
            lineHeight: 0.88, fontWeight: 400, letterSpacing: '-0.04em',
            margin: 0, whiteSpace: 'nowrap',
            fontVariationSettings: `"opsz" 144, "SOFT" 50, "WONK" 1`,
          }}
        >
          {(() => {
            let gi = 0
            return words.map((word, wi) => {
              const letters = word.split('').map((ch) => {
                const i = gi++
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      letterRefs.current[i] = el
                    }}
                    style={{
                      display: 'inline-block', willChange: 'font-variation-settings, transform',
                      fontVariationSettings: `"wght" 600, "opsz" 144, "SOFT" 100, "WONK" 1`,
                    }}
                  >
                    {ch}
                  </span>
                )
              })
              if (wi < words.length - 1) gi += 1
              return (
                <Fragment key={wi}>
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {letters}
                  </span>
                  {wi < words.length - 1 && '\u00A0'}
                </Fragment>
              )
            })
          })()}
        </h1>

        <div
          style={{
            marginTop: 36, display: 'flex', alignItems: 'baseline',
            gap: 16, flexWrap: 'wrap',
            fontSize: 'clamp(26px, 3.2vw, 44px)', lineHeight: 1.15,
          }}
        >
          <span
            style={{
              fontWeight: 300, fontStyle: 'italic', color: T.ink,
              fontVariationSettings: `"opsz" 72, "SOFT" 100`,
            }}
          >
            I
          </span>
          <div
            style={{
              position: 'relative', display: 'inline-block',
              minWidth: 280, flex: '1 1 280px', maxWidth: 560, overflow: 'hidden',
              verticalAlign: 'baseline',
            }}
          >
            <span aria-hidden="true" style={{ visibility: 'hidden', whiteSpace: 'nowrap' }}>
              {taglines[0]}
            </span>
            {taglines.map((t, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap',
                  fontWeight: 500,
                  color: T.amber, fontStyle: 'italic', letterSpacing: '-0.01em',
                  fontVariationSettings: `"opsz" 72, "SOFT" 100`,
                  transform:
                    i === taglineIdx
                      ? 'translateY(0)'
                      : i < taglineIdx
                      ? 'translateY(-100%)'
                      : 'translateY(100%)',
                  opacity: i === taglineIdx ? 1 : 0,
                  transition: 'all 0.7s cubic-bezier(.6,.1,.3,1)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <p
          style={{
            marginTop: 56, maxWidth: 560, fontSize: 18, lineHeight: 1.55,
            color: T.warmBrown, fontVariationSettings: `"opsz" 14, "SOFT" 30`,
          }}
        >
          I design and ship products end to end across web, mobile, backends, and
          the automation between them. At{' '}
          <span
            style={{
              color: T.ink, fontWeight: 600, fontStyle: 'italic',
              borderBottom: `1px solid ${T.amber}`,
            }}
          >
            Xeo
          </span>
          , I own the full stack: Laravel, Next.js, Flutter from zero. Plus AI in
          production: RAG with Pinecone, OCR workflows, and automation that cuts
          real operational drag.
        </p>

        <div style={{ marginTop: 40, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => scrollToId('projects')}
            style={{
              background: T.ink, color: T.cream, border: 'none',
              padding: '16px 28px', fontSize: 13, fontWeight: 500,
              fontFamily: T.mono, letterSpacing: 0.5, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, borderRadius: 2,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            See the work <span style={{ fontFamily: 'serif', fontSize: 18 }}>→</span>
          </button>
          <a
            href="/Resume_AbhishekBadar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: T.ink, padding: '16px 0', fontSize: 13,
              fontFamily: T.mono, letterSpacing: 0.5,
              textDecoration: 'underline', textUnderlineOffset: 4,
            }}
          >
            Résumé.pdf
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute', bottom: 28, right: 64,
          textAlign: 'right',
          fontFamily: T.mono, fontSize: 11, color: T.warmMid, letterSpacing: 0.5,
          zIndex: 3, pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>SCROLL ↓</div>
        <div>01 / 05 — intro</div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-name { white-space: normal; }
        }
      `}</style>
    </section>
  )
}

export default Hero

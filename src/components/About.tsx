import { T } from '../lib/designTokens'
import { useReveal } from '../hooks/useReveal'
import SectionTitle from './SectionTitle'
import AboutOrbit from './AboutOrbit'

type Cat = 'frontend' | 'backend' | 'mobile' | 'tools'

const skillGroups: { label: string; cat: Cat; items: string[] }[] = [
  { label: 'Frontend', cat: 'frontend', items: ['React', 'Next.js', 'Tailwind CSS'] },
  { label: 'Backend',  cat: 'backend',  items: ['Laravel', 'REST APIs', 'MySQL'] },
  { label: 'Mobile',   cat: 'mobile',   items: ['Flutter'] },
  { label: 'Tools',    cat: 'tools',    items: ['Firebase', 'Git', 'Deployments'] },
]

const catColors: Record<Cat, string> = {
  frontend: T.amber,
  backend:  T.clay,
  mobile:   T.moss,
  tools:    T.warmBrown,
}

const About = () => {
  const [ref, shown] = useReveal<HTMLElement>()

  return (
    <section
      id="about"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 7vw, 120px)',
        maxWidth: 1280, margin: '0 auto',
        fontFamily: T.serif,
      }}
    >
      <SectionTitle num="01" title="About" shown={shown} />

      <div className="about-grid" style={{ display: 'grid', gap: 80, alignItems: 'start' }}>
        <div
          style={{
            opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s 0.2s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          <p
            style={{
              fontSize: 22, lineHeight: 1.55, color: T.ink,
              fontVariationSettings: `"opsz" 24, "SOFT" 30`,
              marginBottom: 24, letterSpacing: -0.2,
            }}
          >
            I work across the entire stack to reduce dependencies and move faster.
            I design APIs, build frontends, and develop mobile apps so products can
            be shipped{' '}
            <span style={{ fontStyle: 'italic', color: T.amber, fontWeight: 500 }}>
              without bottlenecks
            </span>
            .
          </p>

          <p
            style={{
              fontSize: 17, lineHeight: 1.7, color: T.warmBrown, marginBottom: 18,
              fontVariationSettings: `"opsz" 14`,
            }}
          >
            At <b style={{ color: T.ink }}>Xeo</b>, I'm rebuilding a production
            Laravel system into a modern architecture while delivering a Flutter app
            from scratch — handling legacy code, performance constraints, and
            scalability challenges in real-world systems.
          </p>

          <p
            style={{
              fontSize: 17, lineHeight: 1.7, color: T.warmBrown, marginBottom: 32,
              fontVariationSettings: `"opsz" 14`,
            }}
          >
            I focus on building <b style={{ color: T.ink }}>simple, fast, and maintainable</b> systems
            — designed for actual usage, not just clean implementations.
          </p>

          <p
            style={{
              fontFamily: T.mono, fontSize: 12, color: T.warmMid,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18,
            }}
          >
            Skills
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {skillGroups.map((g, gi) => (
              <div
                key={g.cat}
                style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr', gap: 14, alignItems: 'center',
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 0.5s ${0.4 + gi * 0.08}s cubic-bezier(.2,.9,.3,1)`,
                }}
              >
                <span
                  style={{
                    fontFamily: T.mono, fontSize: 10, letterSpacing: 2,
                    textTransform: 'uppercase', color: catColors[g.cat],
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: 6,
                      background: catColors[g.cat],
                    }}
                  />
                  {g.label}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {g.items.map((name) => (
                    <span
                      key={name}
                      style={{
                        fontFamily: T.mono, fontSize: 12,
                        padding: '6px 12px',
                        background: 'rgba(26,20,16,0.04)',
                        border: `1px solid ${catColors[g.cat]}33`,
                        borderRadius: 999,
                        color: T.ink, letterSpacing: 0.2,
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s 0.35s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          <AboutOrbit />
          <p
            style={{
              marginTop: 36, fontFamily: T.mono, fontSize: 11,
              color: T.warmMid, letterSpacing: 1.5, lineHeight: 1.9,
            }}
          >
            <span style={{ color: T.amber }}>▹</span> B.Tech, IT — RCOEM (2020–2024)<br />
            <span style={{ color: T.amber }}>▹</span> AI Minor — IIT Ropar (2024–2025)<br />
            <span style={{ color: T.amber }}>▹</span> Certified: Azure · AI · Flutter<br />
            <span style={{ color: T.amber }}>▹</span> Currently @ Xeo, Pune
          </p>
        </div>
      </div>

      <style>{`
        .about-grid { grid-template-columns: 1fr; }
        @media (min-width: 900px) {
          .about-grid { grid-template-columns: 1.2fr 1fr; }
        }
      `}</style>
    </section>
  )
}

export default About

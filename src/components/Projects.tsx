import { useState } from 'react'
import { T } from '../lib/designTokens'
import { useReveal } from '../hooks/useReveal'
import SectionTitle from './SectionTitle'

type Project = {
  title: string
  year: string
  tag: string
  description: string
  tech: string[]
  href?: string
  linkLabel?: string
  featured?: boolean
  accent: string
}

const projects: Project[] = [
  {
    title: 'DoSpaces Plugin',
    year: '2025',
    tag: 'Open source',
    description:
      'osTicket plugin that offloads ticket attachments to DigitalOcean Spaces with secure public-link generation — cut agent response time by 30%.',
    tech: ['PHP', 'DigitalOcean Spaces', 'REST'],
    featured: true,
    accent: T.amber,
  },
  {
    title: 'twitter-autoposter',
    year: '2026',
    tag: 'AI · Automation',
    description:
      'End-to-end content pipeline: researches trending topics, generates posts with DeepSeek, queues them into Google Sheets, and routes through a Telegram approval bot. Runs daily on GitHub Actions.',
    tech: ['Python', 'DeepSeek', 'Telegram Bot', 'Google Sheets', 'GH Actions'],
    href: 'https://github.com/AbhishekBadar/twitter-autoposter',
    linkLabel: 'GitHub',
    accent: T.clay,
  },
  {
    title: 'Claude-Tracker',
    year: '2026',
    tag: 'macOS · Swift',
    description:
      'Native menu-bar app that tracks Claude Code usage across weekly and 5-hour rolling windows so you never blow a quota mid-flow.',
    tech: ['Swift', 'SwiftUI', 'macOS'],
    href: 'https://github.com/AbhishekBadar/Claude-Tracker',
    linkLabel: 'GitHub',
    accent: T.moss,
  },
  {
    title: 'Save Image As',
    year: '2026',
    tag: 'Chrome extension · Live',
    description:
      'Chrome extension with intelligent file-naming suggestions and streamlined download management. 2.46K+ installs, 1K+ active users, 4.36K+ store page views.',
    tech: ['JavaScript', 'Chrome APIs', 'Manifest v3'],
    href: 'https://chromewebstore.google.com/detail/save-image-as/bcngajhkkkhfalgljjjjbjacjcdlophj',
    linkLabel: 'Chrome Web Store',
    accent: T.moss,
  },
  {
    title: 'PuzzleIT',
    year: '2024',
    tag: 'Side project',
    description:
      'Web-based escape-room puzzle game with real-time collaboration. Engaged 200+ participants through challenges that tested lateral thinking.',
    tech: ['React', 'Redux', 'MongoDB', 'Node'],
    href: 'https://github.com/AbhishekBadar/puzzleIT',
    linkLabel: 'GitHub',
    accent: T.amber,
  },
  {
    title: 'Traffic Density Analyzer',
    year: '2023',
    tag: 'Research',
    description:
      'Real-time traffic management using YOLO for vehicle detection and dynamic signal timing. Reduced simulated congestion by 25%.',
    tech: ['Python', 'YOLO', 'OpenCV'],
    href: 'https://github.com/AbhishekBadar/Traffic-Density-Analyzer',
    linkLabel: 'GitHub',
    accent: T.moss,
  },
  {
    title: 'WhileGPTThinks',
    year: '2025',
    tag: 'Chrome extension',
    description:
      'Redirects you to YouTube Shorts while ChatGPT generates a reply, then brings you back when the answer is ready. A silly but useful toy.',
    tech: ['JavaScript', 'Chrome APIs'],
    href: 'https://github.com/AbhishekBadar/whilegptthinks',
    linkLabel: 'GitHub',
    accent: T.clay,
  },
]

const cardLinkProps = (href?: string) =>
  href
    ? {
        as: 'a' as const,
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : { as: 'div' as const }

const ProjectFeatured = ({ p }: { p: Project }) => {
  const [hovered, setHovered] = useState(false)
  const link = cardLinkProps(p.href)
  const Root = link.as
  return (
    <Root
      {...(link.as === 'a' ? { href: link.href, target: link.target, rel: link.rel } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="featured-grid"
      style={{
        display: 'grid', gap: 'clamp(24px, 3vw, 40px)',
        background: T.cream,
        border: `1px solid ${T.warmLight}55`, borderRadius: 6,
        padding: 'clamp(24px, 4vw, 40px)', position: 'relative', overflow: 'hidden',
        transition: 'transform 0.4s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        textDecoration: 'none', color: 'inherit',
        cursor: p.href ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: p.accent,
        }}
      />
      <div>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 24,
            fontFamily: T.mono, fontSize: 11, color: T.warmMid, letterSpacing: 2,
            textTransform: 'uppercase', flexWrap: 'wrap', gap: 8,
          }}
        >
          <span style={{ color: p.accent }}>★ Featured project</span>
          <span>{p.year} · {p.tag}</span>
        </div>
        <h3
          style={{
            fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 500, letterSpacing: -1.2, margin: 0,
            color: T.ink, lineHeight: 1.05, fontStyle: 'italic',
            fontVariationSettings: `"opsz" 72, "SOFT" 60, "WONK" 1`,
          }}
        >
          {p.title}
        </h3>
        <p
          style={{
            marginTop: 20, fontSize: 17, lineHeight: 1.6, color: T.warmBrown,
            fontVariationSettings: `"opsz" 14`, maxWidth: 480,
          }}
        >
          {p.description}
        </p>
        <div style={{ marginTop: 28, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {p.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: T.mono, fontSize: 11, padding: '5px 12px',
                background: 'rgba(26,20,16,0.05)', borderRadius: 999,
                color: T.ink, letterSpacing: 0.3,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {p.href && (
          <div style={{ marginTop: 32 }}>
            <span
              style={{
                fontFamily: T.mono, fontSize: 12, color: T.ink, letterSpacing: 0.5,
                borderBottom: `1px solid ${p.accent}`, paddingBottom: 2,
              }}
            >
              {p.linkLabel || 'GitHub'} →
            </span>
          </div>
        )}
      </div>

      <div style={{ aspectRatio: '4/3', position: 'relative', minHeight: 240 }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${p.accent}22 0%, ${p.accent}05 100%)`,
            borderRadius: 4, border: `1px solid ${p.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.mono, fontSize: 11, color: T.warmMid, letterSpacing: 2,
            textTransform: 'uppercase', overflow: 'hidden',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="p-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20" fill="none"
                  stroke={p.accent} strokeWidth="0.5" opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#p-grid)" />
            <circle cx="80" cy="80" r="40" fill={p.accent} opacity="0.15" />
            <circle cx="320" cy="220" r="60" fill={p.accent} opacity="0.1" />
            <rect x="140" y="120" width="160" height="8" fill={p.accent} opacity="0.3" rx="4" />
            <rect x="140" y="140" width="100" height="8" fill={p.accent} opacity="0.2" rx="4" />
            <rect x="140" y="160" width="140" height="8" fill={p.accent} opacity="0.2" rx="4" />
          </svg>
          <span style={{ position: 'relative', zIndex: 1 }}>{p.title.toLowerCase()}.preview</span>
        </div>
      </div>
    </Root>
  )
}

const ProjectCard = ({
  p, shown, delay,
}: { p: Project; shown: boolean; delay: number }) => {
  const [hovered, setHovered] = useState(false)
  const link = cardLinkProps(p.href)
  const Root = link.as
  return (
    <Root
      {...(link.as === 'a' ? { href: link.href, target: link.target, rel: link.rel } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.cream,
        border: `1px solid ${T.warmLight}55`, borderRadius: 6,
        padding: 28, position: 'relative', overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(.2,.9,.3,1)',
        transform: hovered ? 'translateY(-6px)' : shown ? 'translateY(0)' : 'translateY(30px)',
        opacity: shown ? 1 : 0,
        transitionDelay: shown ? `${delay}s` : '0s',
        boxShadow: hovered ? `0 20px 40px -20px ${p.accent}44` : 'none',
        cursor: p.href ? 'pointer' : 'default',
        minHeight: 260, display: 'flex', flexDirection: 'column',
        textDecoration: 'none', color: 'inherit',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, height: '100%', width: 2,
          background: p.accent, opacity: hovered ? 1 : 0.3, transition: 'opacity 0.3s',
        }}
      />

      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: T.mono, fontSize: 10, color: p.accent,
            letterSpacing: 2, textTransform: 'uppercase',
          }}
        >
          ◆ {p.tag}
        </span>
        {p.href && (
          <span
            aria-hidden="true"
            style={{
              fontSize: 14, transition: 'transform 0.3s, color 0.3s',
              transform: hovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
              color: hovered ? p.accent : T.warmMid,
            }}
          >
            ↗
          </span>
        )}
      </div>

      <h4
        style={{
          fontSize: 24, fontWeight: 500, letterSpacing: -0.5, margin: 0,
          color: T.ink, lineHeight: 1.1, fontStyle: 'italic',
          fontVariationSettings: `"opsz" 36, "SOFT" 40`,
        }}
      >
        {p.title}
      </h4>
      <p
        style={{
          marginTop: 12, fontSize: 14, lineHeight: 1.55, color: T.warmBrown,
          flex: 1,
        }}
      >
        {p.description}
      </p>
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {p.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: T.mono, fontSize: 10, color: T.warmMid, letterSpacing: 0.3,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Root>
  )
}

const Projects = () => {
  const [ref, shown] = useReveal<HTMLElement>()

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 7vw, 120px) 100px',
        maxWidth: 1280, margin: '0 auto',
        fontFamily: T.serif,
      }}
    >
      <SectionTitle num="03" title="Some things I've built" shown={shown} />

      <div
        style={{
          marginBottom: 32,
          opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s 0.2s cubic-bezier(.2,.9,.3,1)',
        }}
      >
        <ProjectFeatured p={projects[0]} />
      </div>

      <div className="projects-grid" style={{ display: 'grid', gap: 20 }}>
        {projects.slice(1).map((p, i) => (
          <ProjectCard key={p.title} p={p} shown={shown} delay={0.3 + i * 0.08} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 64 }}>
        <a
          href="https://github.com/AbhishekBadar"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 26px', border: `1px solid ${T.ink}`,
            borderRadius: 999, color: T.ink, fontFamily: T.mono, fontSize: 12,
            textDecoration: 'none', letterSpacing: 0.5,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.ink
            e.currentTarget.style.color = T.cream
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = T.ink
          }}
        >
          Explore the archive
          <span style={{ fontFamily: T.serif, fontSize: 16 }}>↗</span>
        </a>
      </div>

      <style>{`
        .featured-grid { grid-template-columns: 1fr; }
        .projects-grid { grid-template-columns: 1fr; }
        @media (min-width: 700px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1000px) {
          .featured-grid { grid-template-columns: 1.1fr 1fr; }
          .projects-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  )
}

export default Projects

import { useState } from 'react'
import { T } from '../lib/designTokens'
import { useReveal } from '../hooks/useReveal'
import SectionTitle from './SectionTitle'

type Job = {
  company: string
  title: string
  range: string
  loc: string
  color: string
  blurb: string
  points: string[]
}

const jobs: Job[] = [
  {
    company: 'Xeo Information Systems',
    title: 'Software Development Engineer I',
    range: 'Mar 2025 — Present',
    loc: 'Pune · Hybrid',
    color: '#d4a857',
    blurb:
      'Leading a frontend replatform, building a Flutter app end-to-end, and designing the Laravel backend that serves both.',
    points: [
      'Migrating web frontend from Laravel Blade → Next.js (App Router) — scalable routing, reusable component patterns',
      'Built a reusable React data table abstraction replacing legacy Yajra DataTables — standardized pagination, sorting, server-side data',
      'Shipped complex form workflows using React Hook Form + Zod for type-safe validation',
      'Designed Laravel backend architecture serving web + mobile via RESTful APIs',
      'Built a Flutter app end-to-end for students & parents — fees, events, newsletters, bookings, push notifications. 500+ users',
      'HMAC-based request auth for mobile API security',
      'Payment gateway integration + admin dashboard for tracking, dues reports, receipts',
      'FCM push notifications with deep-link routing',
    ],
  },
  {
    company: 'Refyne',
    title: 'Associate Software Engineer',
    range: 'Aug 2024 — Feb 2025',
    loc: 'Bangalore · Full-time',
    color: '#c4633f',
    blurb:
      'Built the internal CRM platform used by 150+ across sales, risk, and growth. Automated the boring parts.',
    points: [
      'Built an internal CRM on Firebase Auth + serverless architecture — 150+ active users across sales, risk, and growth',
      'Firestore data models for real-time deal tracking, activity logs, and threaded communication',
      'Two-way comment system synced with ClickUp and Postgres — bidirectional sync between CRM and task management',
      'Dashboards + search filters that cut data retrieval time by 60%; custom export-to-CSV for on-demand reports',
      'Migrated 50,000+ records from HubSpot → Firebase with validation and consistency checks (+30% query efficiency)',
      'Automated cross-platform workflows (Slack, Gmail, ClickUp) via N8N — reduced ops overhead ~40%',
      'Automated user onboarding via Slack APIs + Firebase Admin SDK — cut onboarding from 30 min → under 5 min',
      'HR chatbot using Pinecone vector DB + LLMs, integrated with Slack (+40% internal support efficiency)',
      'Resume ingestion + scoring pipeline: Google Drive, OCR, semantic matching against job descriptions',
      'Integrated Sentry for real-time error monitoring — debugging time down 50%',
    ],
  },
]

const Experience = () => {
  const [ref, shown] = useReveal<HTMLElement>()
  const [active, setActive] = useState(0)
  const job = jobs[active]

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 7vw, 120px)',
        maxWidth: 1280, margin: '0 auto',
        fontFamily: T.serif,
      }}
    >
      <SectionTitle num="02" title="Where I've worked" shown={shown} />

      <div className="exp-grid" style={{ display: 'grid', gap: 60, alignItems: 'start' }}>
        <div
          style={{
            opacity: shown ? 1 : 0, transform: shown ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.8s 0.2s cubic-bezier(.2,.9,.3,1)',
          }}
        >
          {jobs.map((j, i) => (
            <button
              key={j.company}
              onClick={() => setActive(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '20px 18px',
                borderLeft: `2px solid ${active === i ? j.color : 'rgba(26,20,16,0.1)'}`,
                transition: 'all 0.3s',
                marginBottom: 4,
                fontFamily: T.serif,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono, fontSize: 10, color: T.warmMid,
                  letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                }}
              >
                {j.range.split('—')[0].trim()}
              </div>
              <div
                style={{
                  fontSize: 20, fontWeight: 500,
                  color: active === i ? T.ink : T.warmBrown,
                  letterSpacing: -0.3,
                  fontStyle: active === i ? 'italic' : 'normal',
                  fontVariationSettings: `"opsz" 24, "SOFT" ${active === i ? 80 : 20}`,
                }}
              >
                {j.company}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.warmMid, marginTop: 3 }}>
                {j.title}
              </div>
            </button>
          ))}
        </div>

        <div
          key={active}
          style={{
            background: T.cream,
            border: `1px solid ${T.warmLight}55`,
            borderRadius: 6, padding: '40px 44px',
            animation: 'ab-fadein 0.5s cubic-bezier(.2,.9,.3,1)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: job.color,
            }}
          />
          <div
            style={{
              fontFamily: T.mono, fontSize: 11, color: T.warmMid,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14,
            }}
          >
            {job.range} · {job.loc}
          </div>
          <h3
            style={{
              fontSize: 36, fontWeight: 500, letterSpacing: -0.8, margin: 0,
              color: T.ink, lineHeight: 1.1,
              fontVariationSettings: `"opsz" 72, "SOFT" 40`,
            }}
          >
            {job.title}{' '}
            <span style={{ fontStyle: 'italic', color: job.color }}>@ {job.company}</span>
          </h3>
          <p
            style={{
              marginTop: 16, fontSize: 17, lineHeight: 1.55, color: T.warmBrown,
              fontStyle: 'italic', maxWidth: 620,
              fontVariationSettings: `"opsz" 18, "SOFT" 40`,
            }}
          >
            {job.blurb}
          </p>

          <ul
            style={{
              listStyle: 'none', padding: 0, margin: '32px 0 0',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            {job.points.map((p, i) => (
              <li
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  fontSize: 15, lineHeight: 1.55, color: T.inkSoft,
                  fontVariationSettings: `"opsz" 14`,
                  animation: `ab-fadein 0.5s ${0.05 + i * 0.06}s both cubic-bezier(.2,.9,.3,1)`,
                }}
              >
                <span
                  style={{
                    color: job.color, marginTop: 7, flexShrink: 0,
                    width: 20, height: 1, background: job.color,
                  }}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .exp-grid { grid-template-columns: 1fr; }
        @media (min-width: 900px) {
          .exp-grid { grid-template-columns: 280px 1fr; }
        }
      `}</style>
    </section>
  )
}

export default Experience

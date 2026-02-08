import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeInUp } from '../hooks/useScrollAnimation'

const Experience = () => {
  const { ref, controls } = useScrollAnimation()
  const [activeTab, setActiveTab] = useState(0)

  const jobs = [
    {
      company: 'Xeo',
      title: 'Software Development Engineer I',
      range: 'Mar 2025 — Present',
      points: [
        'Led migration of web frontend from Laravel Blade to Next.js (App Router), establishing scalable routing and reusable component patterns',
        'Built a reusable data table abstraction in React replacing legacy Yajra DataTables, standardizing pagination, sorting, and server-side data handling',
        'Implemented complex form workflows using React Hook Form and Zod for type-safe validation',
        'Designed Laravel backend architecture serving both web and mobile clients with RESTful APIs',
        'Built a Flutter mobile app end-to-end for students and parents — fee payments, events, newsletters, bookings, push notifications — serving 500+ users',
        'Developed HMAC-based request authentication for mobile API security',
        'Integrated payment gateway with admin dashboard for tracking, dues reports, and receipt generation',
        'Implemented FCM push notifications with deep-link routing',
      ],
    },
    {
      company: 'Refyne',
      title: 'Associate Software Engineer',
      range: 'Aug 2024 — Feb 2025',
      points: [
        'Built and maintained an internal CRM platform serving 150+ active users across sales, risk, and growth teams',
        'Automated cross-platform workflows using N8N (Slack, Gmail, ClickUp) — reduced operational overhead by 40%',
        'Designed Firestore data models for real-time deal tracking, activity logs, and threaded communication',
        'Migrated and normalized 50,000+ records with validation and consistency checks',
        'Built automated user onboarding via Slack APIs and Firebase Admin SDK — reduced manual effort by 80%',
        'Developed an HR chatbot using vector search and LLMs for querying policies in Slack',
        'Created resume ingestion and scoring pipeline with Google Drive, OCR, and semantic matching',
      ],
    },
  ]

  return (
    <section id="experience" className="section">
      <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
        <h2 className="numbered-heading" data-num="02.">Where I've Worked</h2>

        <div className="flex flex-col md:flex-row gap-0 md:gap-8 max-w-2xl">
          {/* Tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b-2 md:border-b-0 border-navy-lighter mb-6 md:mb-0 shrink-0">
            {jobs.map((job, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`tab-btn ${activeTab === i ? 'active' : ''} md:w-40`}
              >
                {job.company}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[360px]">
            <h3 className="text-slate-lightest text-lg font-semibold mb-0.5">
              {jobs[activeTab].title}{' '}
              <span className="text-green-accent">@ {jobs[activeTab].company}</span>
            </h3>
            <p className="mono text-xs text-slate mb-6">{jobs[activeTab].range}</p>
            <ul className="space-y-3">
              {jobs[activeTab].points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="text-green-accent mt-1.5 shrink-0 text-xs">▹</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Experience

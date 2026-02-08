import { Github, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../hooks/useScrollAnimation'

const Projects = () => {
  const { ref, controls } = useScrollAnimation()

  const projects = [
    {
      title: 'DoSpaces Plugin',
      description: 'An open-source plugin that offloads osTicket attachments to DigitalOcean Spaces, generating secure public links for agents and improving response efficiency by 30%.',
      tech: ['PHP', 'DigitalOcean Spaces', 'REST API'],
      github: 'https://github.com/AbhishekBadar',
      featured: true,
    },
    {
      title: 'PuzzleIT',
      description: 'A web-based escape-room-themed puzzle game with real-time collaboration. Engaged 200+ participants in solving challenges testing critical thinking.',
      tech: ['React', 'Redux', 'MongoDB', 'Node.js'],
      github: 'https://github.com/AbhishekBadar/puzzleIT',
    },
    {
      title: 'Save Image As',
      description: 'A Chrome extension that transforms how users save images online. Provides intelligent naming suggestions and streamlined download management with 100+ active users.',
      tech: ['JavaScript', 'Chrome APIs'],
      external: 'https://chromewebstore.google.com/detail/save-image-as/bcngajhkkkhfalgljjjjbjacjcdlophj',
    },
    {
      title: 'WhileGPTThinks',
      description: 'A lighthearted Chrome extension that redirects you to YouTube Shorts while ChatGPT generates a reply, then brings you back when the response is ready.',
      tech: ['JavaScript', 'Chrome APIs'],
      external: 'https://chromewebstore.google.com/detail/whilegptthinks/kfednbiimichdighcalhmahdnijkmaia',
    },
    {
      title: 'Copy URL & QR Code Generator',
      description: 'The ultimate URL copying tool with instant QR code generation for cross-device sharing. Supports plain text, Markdown, and HTML formats with a draggable floating button.',
      tech: ['JavaScript', 'Chrome APIs'],
      external: 'https://chromewebstore.google.com/detail/copy-url-qr-code-generato/jpkhnbfgihcimdcalonoagmfonegpmcd',
    },
    {
      title: 'Traffic Density Analyzer',
      description: 'Real-time traffic management system using YOLO for vehicle detection and dynamic signal timing, reducing congestion by 25%.',
      tech: ['Python', 'YOLO', 'OpenCV', 'ML'],
      github: 'https://github.com/AbhishekBadar/Traffic-Density-Analyzer',
    },
  ]

  return (
    <section id="projects" className="section">
      <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
        <h2 className="numbered-heading" data-num="03.">Some Things I've Built</h2>
      </motion.div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="grid md:grid-cols-2 gap-4"
      >
        {projects.map((project, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="project-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-green-accent">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-light hover:text-green-accent transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-light hover:text-green-accent transition-colors"
                    aria-label="External Link"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            <h3 className="text-slate-lightest text-lg font-semibold mb-2 hover:text-green-accent transition-colors">
              {project.title}
            </h3>

            <p className="text-slate text-sm leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {project.tech.map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Projects

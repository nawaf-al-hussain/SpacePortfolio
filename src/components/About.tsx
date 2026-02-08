import { motion } from 'framer-motion'
import { useScrollAnimation, fadeInUp } from '../hooks/useScrollAnimation'

const About = () => {
  const { ref, controls } = useScrollAnimation()

  const skills = [
    'JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js',
    'PHP', 'Laravel', 'Dart', 'Flutter',
    'Python', 'MySQL', 'Firebase', 'Docker',
  ]

  return (
    <section id="about" className="section">
      <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
        <h2 className="numbered-heading" data-num="01.">About Me</h2>

        <div className="max-w-2xl">
          <div className="space-y-4 text-slate leading-relaxed">
            <p>
              Hello! I'm Abhishek, a software engineer based in Nagpur, India.
              I enjoy building things that live on the internet — whether that's websites,
              mobile applications, or anything in between.
            </p>
            <p>
              I graduated from{' '}
              <span className="text-slate-lightest">RCOEM</span> with a B.Tech in IT
              (8.48/10) and completed an{' '}
              <span className="text-slate-lightest">AI/ML Minor from IIT Ropar</span>.
              My professional journey has taken me from building internal CRMs at a fintech
              startup to shipping production mobile apps serving hundreds of users.
            </p>
            <p>Here are a few technologies I've been working with recently:</p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
              {skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-sm">
                  <span className="text-green-accent text-xs">▹</span>
                  <span className="font-mono text-xs">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default About

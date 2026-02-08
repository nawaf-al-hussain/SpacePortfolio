import { motion } from 'framer-motion'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

const Hero = () => {
  const { scrollToElement } = useSmoothScroll()

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="mono mb-5">Hi, my name is</p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-lightest font-bold text-[clamp(2.5rem,7vw,5rem)] leading-[1.1] mb-2"
      >
        Abhishek Badar.
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-slate font-bold text-[clamp(2rem,5.5vw,4rem)] leading-[1.1] mb-6"
      >
        I craft digital experiences.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-xl text-slate leading-relaxed mb-12"
      >
        I'm a software engineer specializing in building scalable web and mobile applications.
        Currently at Xeo Information Systems
        , where I'm leading frontend migrations, building Flutter apps, and designing backend architectures.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button
          onClick={() => scrollToElement('projects')}
          className="btn-outline"
        >
          Check out my work
        </button>
      </motion.div>
    </section>
  )
}

export default Hero

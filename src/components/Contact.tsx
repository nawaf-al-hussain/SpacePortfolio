import { motion } from 'framer-motion'
import { useScrollAnimation, fadeInUp } from '../hooks/useScrollAnimation'

const Contact = () => {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="contact" className="section py-32">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="max-w-xl mx-auto text-center"
      >
        <p className="mono mb-4">04. What's Next?</p>
        <h2 className="text-slate-lightest font-bold text-[clamp(2rem,5vw,3.5rem)] mb-4">
          Get In Touch
        </h2>
        <p className="text-slate leading-relaxed mb-10">
          I'm currently open to new opportunities and my inbox is always open.
          Whether you have a question, a project idea, or just want to say hi — I'll
          do my best to get back to you.
        </p>
        <a href="mailto:ab15.badar@gmail.com" className="btn-outline">
          Say Hello
        </a>
      </motion.div>
    </section>
  )
}

export default Contact

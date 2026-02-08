import { Github, Linkedin, BookOpen } from 'lucide-react'

const SocialSidebar = () => {
  const links = [
    { icon: Github, href: 'https://github.com/abhishekbadar', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/abhishekbadar', label: 'LinkedIn' },
    { icon: BookOpen, href: 'https://medium.com/@abhishekbadar', label: 'Medium' },
  ]

  return (
    <>
      {/* Left — social icons */}
      <div className="hidden lg:flex fixed bottom-0 left-8 flex-col items-center gap-5 after:content-[''] after:w-px after:h-24 after:bg-slate/30">
        {links.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate hover:text-green-accent hover:-translate-y-0.5 transition-all"
            aria-label={label}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      {/* Right — email */}
      <div className="hidden lg:flex fixed bottom-0 right-8 flex-col items-center gap-5 after:content-[''] after:w-px after:h-24 after:bg-slate/30">
        <a
          href="mailto:ab15.badar@gmail.com"
          className="text-slate hover:text-green-accent transition-colors font-mono text-xs tracking-widest"
          style={{ writingMode: 'vertical-rl' }}
        >
          ab15.badar@gmail.com
        </a>
      </div>
    </>
  )
}

export default SocialSidebar

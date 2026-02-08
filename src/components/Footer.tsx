import { Github, Linkedin, BookOpen } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-6 text-center">
      {/* Mobile social links */}
      <div className="flex justify-center gap-5 mb-4 lg:hidden">
        {[
          { icon: Github, href: 'https://github.com/abhishekbadar', label: 'GitHub' },
          { icon: Linkedin, href: 'https://linkedin.com/in/abhishekbadar', label: 'LinkedIn' },
          { icon: BookOpen, href: 'https://medium.com/@abhishekbadar', label: 'Medium' },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate hover:text-green-accent transition-colors"
            aria-label={label}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      <a
        href="https://github.com/AbhishekBadar"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate text-xs font-mono hover:text-green-accent transition-colors leading-relaxed"
      >
        Built by Abhishek Badar
      </a>
    </footer>
  )
}

export default Footer

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollToElement, scrollToTop } = useSmoothScroll()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'about', num: '01', label: 'About' },
    { id: 'experience', num: '02', label: 'Experience' },
    { id: 'projects', num: '03', label: 'Projects' },
    { id: 'contact', num: '04', label: 'Contact' },
  ]

  const handleNavClick = (id: string) => {
    scrollToElement(id)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-navy/90 backdrop-blur-md shadow-lg shadow-navy/50 py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="container flex items-center justify-between">
          <button
            onClick={() => scrollToTop()}
            className="text-green-accent font-mono text-sm hover:opacity-70 transition-opacity"
          >
            AB
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-slate-light hover:text-green-accent transition-colors text-sm"
              >
                <span className="mono mr-1">{item.num}.</span>
                {item.label}
              </button>
            ))}
            <a
              href="/Resume_AbhishekBadar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-4"
            >
              Resume
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-green-accent"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-light/95 backdrop-blur-lg md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-slate-lightest text-lg"
              >
                <span className="mono block text-center mb-1">{item.num}.</span>
                {item.label}
              </button>
            ))}
            <a
              href="/Resume_AbhishekBadar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-4"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header

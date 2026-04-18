import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import EasterEggs from './components/EasterEggs'

function App() {
  return (
    <>
      <Header />
      <Hero />
      <div className="ab-divider" />
      <About />
      <div style={{ background: '#ecdcc0' }}>
        <Experience />
      </div>
      <Projects />
      <Contact />
      <EasterEggs />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App

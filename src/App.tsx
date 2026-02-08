import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import SocialSidebar from './components/SocialSidebar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import EasterEggs from './components/EasterEggs'

function App() {
  return (
    <>
      <div className="min-h-screen bg-navy text-slate">
        <Header />
        <SocialSidebar />
        <main className="container">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <EasterEggs />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App

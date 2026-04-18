import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, shown] as const
}

export function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(Math.min(1, Math.max(0, window.scrollY / h)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return p
}

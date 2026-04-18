export const T = {
  cream: '#f4e8d4',
  creamDeep: '#ecdcc0',
  ink: '#1a1410',
  inkSoft: '#3a2e22',
  warmBrown: '#5a4a38',
  warmMid: '#7a6f5c',
  warmLight: '#a89478',
  amber: '#d4a857',
  amberDeep: '#b8914a',
  moss: '#6b8e4e',
  clay: '#c4633f',
  serif: "'Fraunces', Georgia, serif",
  mono: "'JetBrains Mono', monospace",
} as const

export const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' })
}

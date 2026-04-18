import { useEffect, useRef, useState } from 'react'
import { T } from '../lib/designTokens'

type Planet = {
  r: number
  speed: number
  size: number
  label: string
  color: string
  phase: number
  captured: boolean
  capturedAngle: number
  capturedRadius: number
  hitFlash: number
  _x: number
  _y: number
}

type Bullet = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }

const AboutOrbit = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [captured, setCaptured] = useState<string[]>([])
  const [total, setTotal] = useState(8)
  const [resetTick, setResetTick] = useState(0)

  const reset = () => {
    setScore(0)
    setCombo(0)
    setCaptured([])
    setResetTick((t) => t + 1)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.max(1, window.devicePixelRatio || 1)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const planetDefs = [
      { r: 0.22, speed: 0.00055, size: 8, label: 'React', color: '#d4a857', phase: 0.0 },
      { r: 0.22, speed: 0.00055, size: 6, label: 'Next.js', color: '#d4a857', phase: Math.PI },
      { r: 0.34, speed: -0.00038, size: 9, label: 'Flutter', color: '#c4633f', phase: 0.7 },
      { r: 0.34, speed: -0.00038, size: 6, label: 'Dart', color: '#c4633f', phase: 0.7 + Math.PI * 0.9 },
      { r: 0.46, speed: 0.00026, size: 8, label: 'Laravel', color: '#6b8e4e', phase: 0.3 },
      { r: 0.46, speed: 0.00026, size: 6, label: 'PHP', color: '#6b8e4e', phase: 0.3 + Math.PI * 1.2 },
      { r: 0.58, speed: -0.00018, size: 7, label: 'Firebase', color: '#d4a857', phase: 1.1 },
      { r: 0.58, speed: -0.00018, size: 7, label: 'Python', color: '#6b8e4e', phase: 1.1 + Math.PI },
    ]
    const planets: Planet[] = planetDefs.map((p) => ({
      ...p,
      captured: false,
      capturedAngle: 0,
      capturedRadius: 0,
      hitFlash: 0,
      _x: 0,
      _y: 0,
    }))
    setTotal(planets.length)

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.2 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }))

    const bullets: Bullet[] = []
    const particles: Particle[] = []

    const start = performance.now()
    let localScore = 0
    let localCombo = 0
    let capturedLocal: string[] = []

    const fire = (cx: number, cy: number) => {
      const m = mouseRef.current
      if (!m.active) return
      const dx = m.x - cx
      const dy = m.y - cy
      const dist = Math.hypot(dx, dy) || 1
      const sp = 0.5
      bullets.push({
        x: cx, y: cy,
        vx: (dx / dist) * sp, vy: (dy / dist) * sp,
        life: 0, maxLife: 1600,
      })
    }

    const onClick = () => {
      const r = canvas.getBoundingClientRect()
      fire(r.width / 2, r.height / 2)
    }
    canvas.addEventListener('click', onClick)

    const spawnBurst = (x: number, y: number, color: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.5
        const sp = 0.06 + Math.random() * 0.14
        particles.push({
          x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: 0, maxLife: 600 + Math.random() * 400,
          color, size: 1 + Math.random() * 2,
        })
      }
    }

    let raf = 0
    const draw = (now: number) => {
      const t = now - start
      const dt = 16.67
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cx = w / 2
      const cy = h / 2
      const minDim = Math.min(w, h)

      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.55)
      grad.addColorStop(0, 'rgba(212,168,87,0.12)')
      grad.addColorStop(1, 'rgba(212,168,87,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      stars.forEach((s) => {
        const alpha = 0.15 + 0.15 * Math.sin(t * 0.001 + s.tw)
        ctx.fillStyle = `rgba(122,111,92,${alpha})`
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2)
        ctx.fill()
      })

      const rings = [0.22, 0.34, 0.46, 0.58]
      rings.forEach((ratio) => {
        ctx.strokeStyle = 'rgba(122,111,92,0.18)'
        ctx.setLineDash([2, 4])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(cx, cy, minDim * ratio, 0, Math.PI * 2)
        ctx.stroke()
      })
      ctx.setLineDash([])

      const m = mouseRef.current
      if (m.active) {
        ctx.strokeStyle = 'rgba(212,168,87,0.35)'
        ctx.setLineDash([3, 5])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(m.x, m.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.strokeStyle = '#d4a857'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(m.x, m.y, 10, 0, Math.PI * 2)
        ctx.moveTo(m.x - 14, m.y); ctx.lineTo(m.x - 6, m.y)
        ctx.moveTo(m.x + 6, m.y); ctx.lineTo(m.x + 14, m.y)
        ctx.moveTo(m.x, m.y - 14); ctx.lineTo(m.x, m.y - 6)
        ctx.moveTo(m.x, m.y + 6); ctx.lineTo(m.x, m.y + 14)
        ctx.stroke()
      }

      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60)
      sunGlow.addColorStop(0, 'rgba(212,168,87,0.45)')
      sunGlow.addColorStop(1, 'rgba(212,168,87,0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(cx, cy, 60, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#1a1410'
      ctx.beginPath()
      ctx.arc(cx, cy, 30, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#d4a857'
      ctx.font = `italic 600 22px 'Fraunces', serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('ab.', cx, cy + 1)

      planets.forEach((p) => {
        let px: number
        let py: number
        if (p.captured) {
          const ang = p.capturedAngle + t * 0.0008
          px = cx + Math.cos(ang) * p.capturedRadius
          py = cy + Math.sin(ang) * p.capturedRadius
        } else {
          const angle = p.phase + t * p.speed
          const orbitR = minDim * p.r
          px = cx + Math.cos(angle) * orbitR
          py = cy + Math.sin(angle) * orbitR
        }
        p._x = px
        p._y = py

        if (p.hitFlash > 0) {
          ctx.strokeStyle = `rgba(255,255,255,${p.hitFlash})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(px, py, p.size + 6 * (1 - p.hitFlash), 0, Math.PI * 2)
          ctx.stroke()
          p.hitFlash -= 0.04
        }

        const trailGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3)
        trailGrad.addColorStop(0, p.color + (p.captured ? 'ff' : 'aa'))
        trailGrad.addColorStop(1, p.color + '00')
        ctx.fillStyle = trailGrad
        ctx.beginPath()
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.captured) {
          ctx.strokeStyle = '#d4a857'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(px, py, p.size + 3, 0, Math.PI * 2)
          ctx.stroke()
        }

        const showLabel = p.size >= 8 || m.active || p.captured
        if (showLabel) {
          ctx.fillStyle = p.captured ? '#d4a857' : '#1a1410'
          ctx.font = `500 10px 'JetBrains Mono', monospace`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          const lx = px + p.size + 6
          ctx.strokeStyle = 'rgba(26,20,16,0.25)'
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(px + p.size + 1, py)
          ctx.lineTo(lx + 2, py)
          ctx.stroke()
          ctx.fillText(p.label, lx + 5, py)
        }
      })

      for (let b = bullets.length - 1; b >= 0; b--) {
        const bul = bullets[b]
        bul.x += bul.vx * dt
        bul.y += bul.vy * dt
        bul.life += dt

        ctx.strokeStyle = 'rgba(212,168,87,0.5)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(bul.x - bul.vx * 8, bul.y - bul.vy * 8)
        ctx.lineTo(bul.x, bul.y)
        ctx.stroke()

        ctx.fillStyle = '#d4a857'
        ctx.beginPath()
        ctx.arc(bul.x, bul.y, 2.5, 0, Math.PI * 2)
        ctx.fill()

        if (bul.life > bul.maxLife || bul.x < -20 || bul.x > w + 20 || bul.y < -20 || bul.y > h + 20) {
          bullets.splice(b, 1)
          if (bul.life > bul.maxLife) {
            localCombo = 0
            setCombo(0)
          }
          continue
        }

        for (let i = 0; i < planets.length; i++) {
          const p = planets[i]
          if (p.captured) continue
          const dx = p._x - bul.x
          const dy = p._y - bul.y
          const rr = p.size + 3
          if (dx * dx + dy * dy <= rr * rr) {
            p.captured = true
            p.capturedAngle = Math.random() * Math.PI * 2
            p.capturedRadius = 44 + Math.random() * 8
            p.hitFlash = 1
            spawnBurst(p._x, p._y, p.color, 18)
            bullets.splice(b, 1)
            localCombo++
            localScore += 100 * Math.max(1, localCombo)
            capturedLocal = [...capturedLocal, p.label]
            setScore(localScore)
            setCombo(localCombo)
            setCaptured(capturedLocal)
            break
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life += dt
        const a = Math.max(0, 1 - p.life / p.maxLife)
        ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, '0')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2)
        ctx.fill()
        if (p.life > p.maxLife) particles.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        active: true,
      }
    }
    const onLeave = () => {
      mouseRef.current.active = false
    }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [resetTick])

  const allCaptured = captured.length === total && total > 0

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
      <div
        style={{
          position: 'absolute', top: 16, left: 16, right: -16, bottom: -16,
          border: `1.5px solid ${T.amber}`, borderRadius: 6, zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative', zIndex: 1,
          background: T.cream,
          border: `1px solid ${T.warmLight}66`,
          borderRadius: 6, overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(26,20,16,0.04)',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `1px dashed ${T.warmLight}66`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: T.mono, fontSize: 10, color: T.warmMid,
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}
        >
          <span style={{ color: T.ink }}>◆ stack.shooter</span>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span>
              score{' '}
              <b
                style={{
                  color: T.ink, fontFamily: T.serif, fontSize: 14, fontStyle: 'italic',
                  marginLeft: 4,
                }}
              >
                {score}
              </b>
            </span>
            <span style={{ color: combo >= 2 ? T.clay : T.warmMid }}>×{combo}</span>
            <span>
              {captured.length}/{total}
            </span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            key={resetTick}
            style={{ display: 'block', width: '100%', height: 420, cursor: 'crosshair' }}
          />
          {allCaptured && (
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(26,20,16,0.78)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: T.cream, textAlign: 'center', padding: 20,
              }}
            >
              <div
                style={{
                  fontFamily: T.serif, fontSize: 34, fontStyle: 'italic',
                  color: T.amber, letterSpacing: -0.5,
                  fontVariationSettings: `"opsz" 72, "SOFT" 80`,
                }}
              >
                Full stack captured.
              </div>
              <div
                style={{
                  fontFamily: T.mono, fontSize: 11, marginTop: 8, letterSpacing: 2,
                  textTransform: 'uppercase', color: T.warmLight,
                }}
              >
                score {score}
              </div>
              <button
                onClick={reset}
                style={{
                  marginTop: 18, padding: '10px 22px',
                  background: T.amber, color: T.ink, border: 'none', borderRadius: 999,
                  fontFamily: T.mono, fontSize: 11, letterSpacing: 1,
                  cursor: 'pointer', textTransform: 'uppercase',
                }}
              >
                play again →
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px dashed ${T.warmLight}66`,
            fontFamily: T.mono, fontSize: 10, color: T.warmMid,
            letterSpacing: 1, minHeight: 36,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span>
            {captured.length === 0 ? (
              <>
                aim &amp; <b style={{ color: T.ink }}>click</b> to capture skills
              </>
            ) : (
              <span style={{ color: T.ink }}>
                captured: {captured.slice(-3).join(' · ')}
                {captured.length > 3 && ` +${captured.length - 3}`}
              </span>
            )}
          </span>
          <button
            onClick={reset}
            style={{
              background: 'transparent', border: `1px solid ${T.warmLight}66`,
              color: T.warmMid, padding: '4px 10px', borderRadius: 999,
              fontFamily: T.mono, fontSize: 9, letterSpacing: 1, cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutOrbit

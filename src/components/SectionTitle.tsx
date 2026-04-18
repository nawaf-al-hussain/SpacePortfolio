import { T } from '../lib/designTokens'

type Props = {
  num: string
  title: string
  shown: boolean
}

const SectionTitle = ({ num, title, shown }: Props) => (
  <div
    style={{
      display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 48,
      opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(.2,.9,.3,1)',
    }}
  >
    <span style={{ fontFamily: T.mono, fontSize: 14, color: T.amber, letterSpacing: 0.3 }}>
      {num}.
    </span>
    <h2
      style={{
        fontFamily: T.serif, fontSize: 'clamp(40px, 5.5vw, 72px)',
        fontWeight: 500, fontStyle: 'italic', color: T.ink,
        letterSpacing: -1.5, margin: 0, lineHeight: 1,
        fontVariationSettings: `"opsz" 144, "SOFT" 60, "WONK" 1`,
      }}
    >
      {title}
    </h2>
    <div
      style={{
        flex: 1, height: 1, background: T.warmMid, opacity: 0.3,
        marginLeft: 12, transform: shown ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform 1s 0.3s',
      }}
    />
  </div>
)

export default SectionTitle

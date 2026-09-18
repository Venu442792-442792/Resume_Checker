/**
 * "Match Compass" — the signature visual of the dashboard.
 * A circular dial that reads the resume-to-job match percentage,
 * colored by the same teal / amber / crimson signal scale used
 * for skill chips, so the whole score story reads at a glance.
 */
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function toneFor(score) {
  if (score >= 75) return { stroke: '#0E7C6B', text: 'text-teal', label: 'Strong match' }
  if (score >= 50) return { stroke: '#C77D22', text: 'text-amber', label: 'Partial match' }
  return { stroke: '#B23A3A', text: 'text-crimson', label: 'Weak match' }
}

export default function ScoreGauge({ score = 0, size = 140, strokeWidth = 10 }) {
  const clamped = Math.max(0, Math.min(100, score))
  const tone = toneFor(clamped)
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE
  const viewBoxSize = (RADIUS + strokeWidth) * 2

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="-rotate-90"
      >
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={RADIUS}
          fill="none"
          stroke="#E3E4E0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={RADIUS}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold text-ink">{Math.round(clamped)}%</span>
        <span className={`text-xs font-semibold mt-0.5 ${tone.text}`}>{tone.label}</span>
      </div>
    </div>
  )
}

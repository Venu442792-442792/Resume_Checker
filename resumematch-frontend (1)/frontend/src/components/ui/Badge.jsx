const VARIANTS = {
  teal: 'bg-teal-soft text-teal border-teal/20',
  amber: 'bg-amber-soft text-amber border-amber/20',
  crimson: 'bg-crimson-soft text-crimson border-crimson/20',
  indigo: 'bg-indigo/8 text-indigo border-indigo/20',
  neutral: 'bg-ink/5 text-ink-soft border-ink/10'
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

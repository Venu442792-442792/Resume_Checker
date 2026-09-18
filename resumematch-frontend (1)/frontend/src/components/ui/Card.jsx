export default function Card({ children, className = '', padded = true, hover = false }) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl shadow-card
        ${padded ? 'p-6' : ''}
        ${hover ? 'transition-shadow hover:shadow-raised' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo mb-1">
            {eyebrow}
          </p>
        )}
        {title && <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

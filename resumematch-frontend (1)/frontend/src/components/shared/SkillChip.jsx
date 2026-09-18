import { Check, X, Tag } from 'lucide-react'

/**
 * Renders a skill as a "highlighter mark" — filled teal for matched,
 * dashed crimson outline for missing, neutral for a plain skill tag.
 * variant: 'matched' | 'missing' | 'neutral'
 */
export default function SkillChip({ label, variant = 'neutral' }) {
  if (variant === 'matched') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-teal-soft border border-teal/25 px-2.5 py-1 text-xs font-medium text-teal">
        <Check className="h-3 w-3" strokeWidth={3} />
        {label}
      </span>
    )
  }

  if (variant === 'missing') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-crimson-soft border border-dashed border-crimson/40 px-2.5 py-1 text-xs font-medium text-crimson">
        <X className="h-3 w-3" strokeWidth={3} />
        {label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-ink/5 border border-line px-2.5 py-1 text-xs font-medium text-ink-soft">
      <Tag className="h-3 w-3" />
      {label}
    </span>
  )
}

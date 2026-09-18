import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-indigo text-white hover:bg-indigo-deep disabled:bg-indigo/50',
  secondary: 'bg-surface text-ink border border-line hover:bg-paper disabled:opacity-50',
  outline: 'bg-transparent text-indigo border border-indigo hover:bg-indigo/5 disabled:opacity-50',
  danger: 'bg-crimson text-white hover:bg-crimson/90 disabled:opacity-50',
  ghost: 'bg-transparent text-ink-soft hover:bg-ink/5 disabled:opacity-50'
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors
        disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

import { Loader2 } from 'lucide-react'

export default function Loader({ label = 'Loading…', fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-ink-soft">
      <Loader2 className="h-6 w-6 animate-spin text-indigo" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )

  if (fullscreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>
  }
  return <div className="py-10">{content}</div>
}

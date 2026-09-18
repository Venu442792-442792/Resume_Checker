import { LogOut, ScanSearch } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-line bg-surface flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo flex items-center justify-center">
          <ScanSearch className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">ResumeMatch</span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-ink leading-tight">{user.name}</p>
            <p className="text-xs text-ink-faint leading-tight">{user.role === 'ADMIN' ? 'Admin' : 'Candidate'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-paper hover:text-crimson transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      )}
    </header>
  )
}

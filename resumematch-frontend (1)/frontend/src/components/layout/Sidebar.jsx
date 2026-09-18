import { NavLink } from 'react-router-dom'
import { UploadCloud, ListChecks, Briefcase, PlusCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const candidateLinks = [
  { to: '/candidate/upload', label: 'Upload & Apply', icon: UploadCloud },
  { to: '/candidate/applications', label: 'My Applications', icon: ListChecks }
]

const adminLinks = [
  { to: '/admin/jobs', label: 'Job Descriptions', icon: Briefcase },
  { to: '/admin/jobs/create', label: 'Create Job', icon: PlusCircle }
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'ADMIN' ? adminLinks : candidateLinks

  return (
    <aside className="w-60 shrink-0 border-r border-line bg-surface min-h-[calc(100vh-64px)] py-6 px-3 hidden md:block">
      <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {user?.role === 'ADMIN' ? 'Admin Console' : 'Candidate Portal'}
      </p>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo/8 text-indigo'
                  : 'text-ink-soft hover:bg-paper hover:text-ink'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

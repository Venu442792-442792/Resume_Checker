import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ScanSearch, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      const redirectTo =
        location.state?.from?.pathname ||
        (user.role === 'ADMIN' ? '/admin/jobs' : '/candidate/upload')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to log in. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-11 w-11 rounded-xl bg-indigo flex items-center justify-center mb-3">
            <ScanSearch className="h-5.5 w-5.5 text-white" size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="text-sm text-ink-faint mt-1">Sign in to ResumeMatch</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl shadow-card p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-crimson-soft border border-crimson/20 px-3 py-2.5 text-sm text-crimson">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="label-text" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="label-text" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-ink-faint mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

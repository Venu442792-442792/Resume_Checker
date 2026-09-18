import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ScanSearch, AlertCircle, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' })
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
      const user = await register(form)
      navigate(user.role === 'ADMIN' ? '/admin/jobs' : '/candidate/upload', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-11 w-11 rounded-xl bg-indigo flex items-center justify-center mb-3">
            <ScanSearch className="h-5.5 w-5.5 text-white" size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="text-sm text-ink-faint mt-1">Join ResumeMatch</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl shadow-card p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-crimson-soft border border-crimson/20 px-3 py-2.5 text-sm text-crimson">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="label-text" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Jordan Lee"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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

          <div className="mb-4">
            <label className="label-text" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input-field"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="label-text">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'CANDIDATE' }))}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  form.role === 'CANDIDATE'
                    ? 'border-indigo bg-indigo/8 text-indigo'
                    : 'border-line text-ink-soft hover:bg-paper'
                }`}
              >
                <User className="h-4 w-4" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'ADMIN' }))}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  form.role === 'ADMIN'
                    ? 'border-indigo bg-indigo/8 text-indigo'
                    : 'border-line text-ink-soft hover:bg-paper'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-ink-faint mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

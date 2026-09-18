import { useEffect, useState } from 'react'
import { Inbox } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import * as applicationService from '../../services/applicationService'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    applicationService
      .getMyApplications()
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const scoreTone = (score) => {
    if (score >= 75) return 'teal'
    if (score >= 50) return 'amber'
    return 'crimson'
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">My Applications</h1>
        <p className="text-sm text-ink-faint mt-1">Track every role you've matched your resume against.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading your applications…" />
      ) : applications.length === 0 ? (
        <Card className="text-center py-14">
          <Inbox className="h-8 w-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm font-semibold text-ink">No applications yet</p>
          <p className="text-sm text-ink-faint mt-1">
            Head to Upload &amp; Apply to match your resume against a job.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <Card key={app.id} padded={false} hover className="p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-ink">{app.jobTitle}</p>
                  <p className="text-xs text-ink-faint mt-0.5">
                    Applied {new Date(app.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink">
                    {Math.round(app.matchScore)}%
                  </span>
                  <Badge variant={scoreTone(app.matchScore)}>
                    {app.matchScore >= 75 ? 'Strong' : app.matchScore >= 50 ? 'Partial' : 'Weak'}
                  </Badge>
                  <Badge variant={app.recommendation === 'SHORTLIST' ? 'teal' : 'neutral'}>
                    {app.recommendation === 'SHORTLIST' ? 'Shortlisted' : 'Not shortlisted'}
                  </Badge>
                </div>
              </div>

              {(app.matchedSkills?.length > 0 || app.missingSkills?.length > 0) && (
                <div className="mt-3 pt-3 border-t border-line text-xs text-ink-faint">
                  <span className="text-teal font-medium">{app.matchedSkills?.length || 0} matched</span>
                  {' · '}
                  <span className="text-crimson font-medium">{app.missingSkills?.length || 0} missing</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

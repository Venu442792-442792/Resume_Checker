import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import * as jobService from '../../services/jobService'

export default function ApplicantsForJob() {
  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    jobService
      .getApplicantsForJob(jobId)
      .then((data) => {
        // Rank by match score, highest first — makes shortlisting decisions immediate.
        const ranked = [...data].sort((a, b) => b.matchScore - a.matchScore)
        setApplicants(ranked)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [jobId])

  const scoreTone = (score) => {
    if (score >= 75) return 'teal'
    if (score >= 50) return 'amber'
    return 'crimson'
  }

  return (
    <DashboardLayout>
      <Link
        to="/admin/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-indigo mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Applicants</h1>
        <p className="text-sm text-ink-faint mt-1">Ranked by match score, highest first.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading applicants…" />
      ) : applicants.length === 0 ? (
        <Card className="text-center py-14">
          <Users className="h-8 w-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm font-semibold text-ink">No applicants yet</p>
          <p className="text-sm text-ink-faint mt-1">Candidates who apply to this role will appear here.</p>
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Match score</th>
                <th className="px-5 py-3">Skills matched</th>
                <th className="px-5 py-3">Recommendation</th>
                <th className="px-5 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-5 py-4 font-medium text-ink">{app.candidateName}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-ink">
                        {Math.round(app.matchScore)}%
                      </span>
                      <Badge variant={scoreTone(app.matchScore)}>
                        {app.matchScore >= 75 ? 'Strong' : app.matchScore >= 50 ? 'Partial' : 'Weak'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {app.matchedSkills?.length || 0} / {(app.matchedSkills?.length || 0) + (app.missingSkills?.length || 0)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={app.recommendation === 'SHORTLIST' ? 'teal' : 'neutral'}>
                      {app.recommendation === 'SHORTLIST' ? 'Shortlist' : 'Reject'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/admin/applications/${app.id}`}
                      className="text-xs font-semibold text-indigo hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </DashboardLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import ScoreGauge from '../../components/ui/ScoreGauge'
import SkillChip from '../../components/shared/SkillChip'
import * as applicationService from '../../services/applicationService'

export default function ApplicantDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    applicationService
      .getApplicationById(id)
      .then(setApplication)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <DashboardLayout>
      <Link
        to="/admin/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-indigo mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      {error && (
        <div className="mb-6 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading application…" />
      ) : application ? (
        <Card className="max-w-3xl">
          <CardHeader
            eyebrow={application.jobTitle}
            title={application.candidateName}
            action={
              <Badge variant={application.recommendation === 'SHORTLIST' ? 'teal' : 'crimson'}>
                {application.recommendation === 'SHORTLIST' ? 'Recommended to shortlist' : 'Not recommended'}
              </Badge>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
            <ScoreGauge score={application.matchScore} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="label-text">Matched skills ({application.matchedSkills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {application.matchedSkills?.length ? (
                    application.matchedSkills.map((skill) => (
                      <SkillChip key={skill} label={skill} variant="matched" />
                    ))
                  ) : (
                    <p className="text-sm text-ink-faint">No overlapping skills found.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="label-text">Missing skills ({application.missingSkills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {application.missingSkills?.length ? (
                    application.missingSkills.map((skill) => (
                      <SkillChip key={skill} label={skill} variant="missing" />
                    ))
                  ) : (
                    <p className="text-sm text-ink-faint">No gaps — great fit!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </DashboardLayout>
  )
}

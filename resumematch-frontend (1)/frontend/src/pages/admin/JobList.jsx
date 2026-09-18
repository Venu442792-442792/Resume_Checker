import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, PlusCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import SkillChip from '../../components/shared/SkillChip'
import * as jobService from '../../services/jobService'

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    jobService
      .getAllJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Job Descriptions</h1>
          <p className="text-sm text-ink-faint mt-1">Manage roles and review ranked applicants.</p>
        </div>
        <Link to="/admin/jobs/create">
          <Button>
            <PlusCircle className="h-4 w-4" />
            New job
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading job descriptions…" />
      ) : jobs.length === 0 ? (
        <Card className="text-center py-14">
          <Briefcase className="h-8 w-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm font-semibold text-ink">No job descriptions yet</p>
          <p className="text-sm text-ink-faint mt-1">Create your first role to start screening resumes.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} hover>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display text-lg font-semibold text-ink">{job.title}</h3>
              </div>
              <p className="text-sm text-ink-soft line-clamp-3 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.requiredSkills?.slice(0, 6).map((skill) => (
                  <SkillChip key={skill} label={skill} variant="neutral" />
                ))}
                {job.requiredSkills?.length > 6 && (
                  <span className="text-xs text-ink-faint self-center">
                    +{job.requiredSkills.length - 6} more
                  </span>
                )}
              </div>

              <Link to={`/admin/jobs/${job.id}/applicants`}>
                <Button variant="secondary" size="sm">
                  <Users className="h-3.5 w-3.5" />
                  View applicants
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

import { useEffect, useState } from 'react'
import { UploadCloud, FileText, CheckCircle2, Send, RefreshCcw } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import Badge from '../../components/ui/Badge'
import ScoreGauge from '../../components/ui/ScoreGauge'
import SkillChip from '../../components/shared/SkillChip'
import * as jobService from '../../services/jobService'
import * as resumeService from '../../services/resumeService'
import * as applicationService from '../../services/applicationService'

export default function UploadResume() {
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState('')

  const [file, setFile] = useState(null)
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    jobService
      .getAllJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setJobsLoading(false))
  }, [])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setError('')
    setFile(selected)
    setResume(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const uploaded = await resumeService.uploadResume(file)
      setResume(uploaded)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleApply = async () => {
    if (!resume || !selectedJobId) return
    setError('')
    setApplying(true)
    try {
      const application = await applicationService.applyToJob({
        resumeId: resume.id,
        jobId: Number(selectedJobId)
      })
      setResult(application)
    } catch (err) {
      setError(err.message)
    } finally {
      setApplying(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResume(null)
    setResult(null)
    setSelectedJobId('')
    setError('')
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Upload & Apply</h1>
        <p className="text-sm text-ink-faint mt-1">
          Upload your resume, choose a role, and see your match instantly.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Upload */}
        <Card>
          <CardHeader eyebrow="Step 1" title="Upload your resume" />

          {!resume ? (
            <div>
              <label
                htmlFor="resume-file"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-10 px-4 cursor-pointer hover:border-indigo/40 hover:bg-indigo/[0.03] transition-colors"
              >
                <UploadCloud className="h-7 w-7 text-indigo" />
                <span className="text-sm font-semibold text-ink">
                  {file ? file.name : 'Click to select a PDF resume'}
                </span>
                <span className="text-xs text-ink-faint">PDF only, up to 5MB</span>
              </label>
              <input
                id="resume-file"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <Button
                className="w-full mt-4"
                disabled={!file}
                loading={uploading}
                onClick={handleUpload}
              >
                <FileText className="h-4 w-4" />
                Extract & analyze resume
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 rounded-xl bg-teal-soft border border-teal/20 px-4 py-3 mb-4">
                <CheckCircle2 className="h-4.5 w-4.5 text-teal shrink-0" />
                <span className="text-sm font-medium text-teal">
                  {resume.fileName} processed successfully
                </span>
              </div>

              <p className="label-text">Skills detected in your resume</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {resume.extractedSkills?.length ? (
                  resume.extractedSkills.map((skill) => (
                    <SkillChip key={skill} label={skill} variant="neutral" />
                  ))
                ) : (
                  <p className="text-sm text-ink-faint">No specific skills detected.</p>
                )}
              </div>

              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-indigo"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Upload a different resume
              </button>
            </div>
          )}
        </Card>

        {/* Step 2: Choose job & apply */}
        <Card>
          <CardHeader eyebrow="Step 2" title="Choose a job & get your score" />

          {jobsLoading ? (
            <Loader label="Loading job descriptions…" />
          ) : jobs.length === 0 ? (
            <p className="text-sm text-ink-faint">No job descriptions have been posted yet.</p>
          ) : (
            <div>
              <label className="label-text" htmlFor="job-select">Job description</label>
              <select
                id="job-select"
                className="input-field mb-4"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                disabled={!resume}
              >
                <option value="">Select a role…</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>

              <Button
                className="w-full"
                disabled={!resume || !selectedJobId}
                loading={applying}
                onClick={handleApply}
              >
                <Send className="h-4 w-4" />
                Calculate match score
              </Button>

              {!resume && (
                <p className="text-xs text-ink-faint mt-2">Upload a resume first (Step 1).</p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Result */}
      {result && (
        <Card className="mt-6">
          <CardHeader
            eyebrow="Match result"
            title={result.jobTitle}
            action={
              <Badge variant={result.recommendation === 'SHORTLIST' ? 'teal' : 'crimson'}>
                {result.recommendation === 'SHORTLIST' ? 'Recommended to shortlist' : 'Not recommended'}
              </Badge>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
            <ScoreGauge score={result.matchScore} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="label-text">Matched skills ({result.matchedSkills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.length ? (
                    result.matchedSkills.map((skill) => (
                      <SkillChip key={skill} label={skill} variant="matched" />
                    ))
                  ) : (
                    <p className="text-sm text-ink-faint">No overlapping skills found.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="label-text">Missing skills ({result.missingSkills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length ? (
                    result.missingSkills.map((skill) => (
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
      )}
    </DashboardLayout>
  )
}

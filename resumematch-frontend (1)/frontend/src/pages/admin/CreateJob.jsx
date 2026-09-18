import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, PlusCircle, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import * as jobService from '../../services/jobService'

export default function CreateJob() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput('')
      return
    }
    setSkills((prev) => [...prev, trimmed])
    setSkillInput('')
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
  }

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }
    if (skills.length === 0) {
      setError('Add at least one required skill.')
      return
    }

    setLoading(true)
    try {
      await jobService.createJob({ title, description, requiredSkills: skills })
      setSuccess(true)
      setTimeout(() => navigate('/admin/jobs'), 900)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Create Job Description</h1>
        <p className="text-sm text-ink-faint mt-1">
          Define the role and required skills used to score incoming resumes.
        </p>
      </div>

      <Card className="max-w-2xl">
        {error && (
          <div className="mb-4 rounded-xl bg-crimson-soft border border-crimson/20 px-4 py-3 text-sm text-crimson">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-teal-soft border border-teal/20 px-4 py-3 text-sm text-teal">
            <CheckCircle2 className="h-4 w-4" />
            Job created. Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label-text" htmlFor="title">Job title</label>
            <input
              id="title"
              className="input-field"
              placeholder="e.g. Backend Engineer (Java)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label-text" htmlFor="description">Job description</label>
            <textarea
              id="description"
              rows={6}
              className="input-field resize-none"
              placeholder="Describe the responsibilities, requirements, and context of this role…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="label-text" htmlFor="skills">Required skills</label>
            <div className="flex gap-2">
              <input
                id="skills"
                className="input-field"
                placeholder="Type a skill and press Enter (e.g. Java, Spring Boot)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <Button type="button" variant="secondary" onClick={addSkill}>
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo/8 text-indigo border border-indigo/20 px-3 py-1.5 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-crimson"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" loading={loading}>
            Publish job description
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  )
}

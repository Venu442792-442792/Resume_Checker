import axiosClient from '../api/axiosClient'

/**
 * Fetch all job descriptions (visible to candidates and admins).
 */
export async function getAllJobs() {
  const { data } = await axiosClient.get('/jobs')
  return data
}

/**
 * Fetch a single job description by id.
 * @param {string|number} jobId
 */
export async function getJobById(jobId) {
  const { data } = await axiosClient.get(`/jobs/${jobId}`)
  return data
}

/**
 * Create a new job description. Admin only.
 * @param {{ title: string, description: string, requiredSkills: string[] }} payload
 */
export async function createJob(payload) {
  const { data } = await axiosClient.post('/jobs', payload)
  return data
}

/**
 * Fetch all applicants (applications) for a given job, ranked by match score.
 * Admin only.
 * @param {string|number} jobId
 */
export async function getApplicantsForJob(jobId) {
  const { data } = await axiosClient.get(`/jobs/${jobId}/applicants`)
  return data
}

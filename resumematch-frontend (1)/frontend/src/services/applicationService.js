import axiosClient from '../api/axiosClient'

/**
 * Submit a resume against a job description to compute a match score.
 * @param {{ resumeId: number, jobId: number }} payload
 */
export async function applyToJob(payload) {
  const { data } = await axiosClient.post('/applications', payload)
  return data
}

/**
 * Fetch all applications submitted by the currently logged-in candidate.
 */
export async function getMyApplications() {
  const { data } = await axiosClient.get('/applications/my')
  return data
}

/**
 * Fetch a single application (with full match detail) by id.
 * @param {string|number} applicationId
 */
export async function getApplicationById(applicationId) {
  const { data } = await axiosClient.get(`/applications/${applicationId}`)
  return data
}

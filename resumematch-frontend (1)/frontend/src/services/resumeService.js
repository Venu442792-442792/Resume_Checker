import axiosClient from '../api/axiosClient'

/**
 * Upload a candidate's resume PDF. Triggers text + skill extraction on the backend.
 * @param {File} file
 * @returns {Promise<{id: number, fileName: string, uploadedAt: string, extractedSkills: string[]}>}
 */
export async function uploadResume(file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await axiosClient.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

/**
 * Fetch all resumes uploaded by the current candidate.
 */
export async function getMyResumes() {
  const { data } = await axiosClient.get('/resumes/my')
  return data
}

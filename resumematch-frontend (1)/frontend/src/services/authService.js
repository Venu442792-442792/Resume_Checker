import axiosClient from '../api/axiosClient'

/**
 * @param {{ name: string, email: string, password: string, role: 'ADMIN'|'CANDIDATE' }} payload
 */
export async function register(payload) {
  const { data } = await axiosClient.post('/auth/register', payload)
  return data
}

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  const { data } = await axiosClient.post('/auth/login', credentials)
  return data
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('rs_user')
    const token = localStorage.getItem('rs_token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const persistSession = (authResponse) => {
    const { token, name, email, role } = authResponse
    const sessionUser = { name, email, role }
    localStorage.setItem('rs_token', token)
    localStorage.setItem('rs_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    return persistSession(response)
  }, [])

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload)
    return persistSession(response)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('rs_token')
    localStorage.removeItem('rs_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Loader from './components/ui/Loader'

import Login from './pages/Login'
import Register from './pages/Register'
import UploadResume from './pages/candidate/UploadResume'
import MyApplications from './pages/candidate/MyApplications'
import CreateJob from './pages/admin/CreateJob'
import JobList from './pages/admin/JobList'
import ApplicantsForJob from './pages/admin/ApplicantsForJob'
import ApplicantDetail from './pages/admin/ApplicantDetail'

function HomeRedirect() {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullscreen label="Loading ResumeMatch…" />

  if (!user) return <Navigate to="/login" replace />
  return (
    <Navigate to={user.role === 'ADMIN' ? '/admin/jobs' : '/candidate/upload'} replace />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Candidate routes */}
      <Route
        path="/candidate/upload"
        element={
          <ProtectedRoute allowedRole="CANDIDATE">
            <UploadResume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute allowedRole="CANDIDATE">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <JobList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs/create"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <CreateJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs/:jobId/applicants"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <ApplicantsForJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applications/:id"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <ApplicantDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

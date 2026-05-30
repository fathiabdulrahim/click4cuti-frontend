import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { AuthGuard } from './components/auth/AuthGuard'
import { RoleGuard } from './components/auth/RoleGuard'
import { AppLayout } from './components/layout/AppLayout'

import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MyLeavesPage from './pages/leaves/MyLeavesPage'
import ApplyLeavePage from './pages/leaves/ApplyLeavePage'
import EditLeavePage from './pages/leaves/EditLeavePage'
import TeamRequestsPage from './pages/leaves/TeamRequestsPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminAgenciesPage from './pages/admin/AdminAgenciesPage'
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage'
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage'
import AdminDesignationsPage from './pages/admin/AdminDesignationsPage'
import AdminLeavePoliciesPage from './pages/admin/AdminLeavePoliciesPage'
import AdminLeaveTypesPage from './pages/admin/AdminLeaveTypesPage'
import AdminWorkSchedulesPage from './pages/admin/AdminWorkSchedulesPage'
import AdminPublicHolidaysPage from './pages/admin/AdminPublicHolidaysPage'
import AdminWarningLettersPage from './pages/admin/AdminWarningLettersPage'
import AdminLeaveApplicationsPage from './pages/admin/AdminLeaveApplicationsPage'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected employee routes */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaves" element={<MyLeavesPage />} />
          <Route path="/leaves/apply" element={<ApplyLeavePage />} />
          <Route path="/leaves/:id/edit" element={<EditLeavePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleGuard allowedRoles={['MANAGER', 'ADMIN']} />}>
            <Route path="/approvals" element={<TeamRequestsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<AuthGuard />}>       
        <Route path="/admin" element={<AppLayout isAdmin />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="agencies" element={<AdminAgenciesPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="designations" element={<AdminDesignationsPage />} />
          <Route path="leave-policies" element={<AdminLeavePoliciesPage />} />
          <Route path="leave-types" element={<AdminLeaveTypesPage />} />
          <Route path="work-schedules" element={<AdminWorkSchedulesPage />} />
          <Route path="public-holidays" element={<AdminPublicHolidaysPage />} />
          <Route path="warning-letters" element={<AdminWarningLettersPage />} />
          <Route path="leave-applications" element={<AdminLeaveApplicationsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
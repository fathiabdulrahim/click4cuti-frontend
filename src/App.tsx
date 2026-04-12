import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './router/AuthGuard'
import { AdminAuthGuard } from './router/AdminAuthGuard'
import { RoleGuard } from './router/RoleGuard'
import { ScopeGuard } from './router/ScopeGuard'
import { AppLayout } from './components/layout/AppLayout'
import { Toaster } from './components/ui/toaster'

import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MyLeavesPage from './pages/leaves/MyLeavesPage'
import ApplyLeavePage from './pages/leaves/ApplyLeavePage'
import TeamRequestsPage from './pages/leaves/TeamRequestsPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CompanyManagementPage from './pages/admin/CompanyManagementPage'
import AgencyManagementPage from './pages/admin/AgencyManagementPage'
import PolicyManagementPage from './pages/admin/PolicyManagementPage'
import HolidayManagementPage from './pages/admin/HolidayManagementPage'
import LeaveApplicationsPage from './pages/admin/LeaveApplicationsPage'
import AgencyDetailPage from './pages/admin/AgencyDetailPage'
import CompanyDetailPage from './pages/admin/CompanyDetailPage'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Employee/Manager/CompanyUser portal */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leaves" element={<MyLeavesPage />} />
            <Route path="/leaves/apply" element={<ApplyLeavePage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<RoleGuard allowedRoles={['MANAGER', 'ADMIN']} />}>
              <Route path="/leaves/team" element={<TeamRequestsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Admin portal (AdminUser — SuperAdmin / Agency / Company scope) */}
        <Route element={<AdminAuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/leaves" element={<LeaveApplicationsPage />} />
            <Route path="/admin/policies" element={<PolicyManagementPage />} />
            <Route path="/admin/holidays" element={<HolidayManagementPage />} />

            {/* Agency + SuperAdmin only */}
            <Route element={<ScopeGuard allowedScopes={['AGENCY', 'SUPER_ADMIN']} />}>
              <Route path="/admin/companies" element={<CompanyManagementPage />} />
              <Route path="/admin/companies/:id" element={<CompanyDetailPage />} />
            </Route>

            {/* SuperAdmin only */}
            <Route element={<ScopeGuard allowedScopes={['SUPER_ADMIN']} />}>
              <Route path="/admin/agencies" element={<AgencyManagementPage />} />
              <Route path="/admin/agencies/:id" element={<AgencyDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

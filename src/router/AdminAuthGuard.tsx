import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function AdminAuthGuard() {
  const adminUser = useAuthStore((s) => s.adminUser)

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

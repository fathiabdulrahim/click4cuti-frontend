import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { AdminScope } from '@/lib/types'

interface ScopeGuardProps {
  allowedScopes: AdminScope[]
}

export function ScopeGuard({ allowedScopes }: ScopeGuardProps) {
  const adminUser = useAuthStore((s) => s.adminUser)

  if (!adminUser || !allowedScopes.includes(adminUser.scope)) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

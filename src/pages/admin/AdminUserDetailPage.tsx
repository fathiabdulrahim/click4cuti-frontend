import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { AdminUserHeader } from '@/components/admin/AdminUserHeader'
import { AdminUserTabs } from '@/components/admin/AdminUserTabs'
import { useAdminUser } from '@/hooks/useAdminUser'

export default function AdminUserDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: user, isLoading } = useAdminUser(id)

  if (isLoading) return <LoadingSpinner className="py-12" />
  if (!user) return <EmptyState title="User not found" message="This employee may have been removed." />

  return (
    <div>
      <AdminUserHeader user={user} />
      <AdminUserTabs userId={id} />
    </div>
  )
}

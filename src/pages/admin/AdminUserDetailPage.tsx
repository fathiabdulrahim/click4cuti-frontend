import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminUserTabs } from '@/components/admin/AdminUserTabs'
import { useAdminUser } from '@/hooks/useAdminUser'

export default function AdminUserDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: user, isLoading } = useAdminUser(id)

  if (isLoading) return <LoadingSpinner className="py-12" />
  if (!user) return <p className="text-sm text-muted-foreground">User not found.</p>

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-3">
        <Link to="/admin/users"><ArrowLeft className="mr-1 h-4 w-4" /> Back to users</Link>
      </Button>
      <PageHeader
        title={user.full_name}
        description={`${user.employee_id ?? '—'} · ${user.role} · ${user.is_active ? 'Active' : 'Inactive'}`}
        action={
          <Badge variant={user.is_active ? 'default' : 'secondary'}>
            {user.is_active ? 'Employed' : 'Inactive'}
          </Badge>
        }
      />
      <AdminUserTabs userId={id} />
    </div>
  )
}

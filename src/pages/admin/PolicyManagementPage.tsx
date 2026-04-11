import { useAdminLeavePolicies } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PolicyManagementPage() {
  const { data: policies, isLoading } = useAdminLeavePolicies()

  return (
    <div>
      <PageHeader title="Leave Policies" description="Configure company leave policies and types" />
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !policies?.length ? (
        <EmptyState title="No policies found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{policy.name}</CardTitle>
                  <Badge variant={policy.is_active ? 'success' : 'secondary'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {policy.description && <p className="text-sm text-muted-foreground">{policy.description}</p>}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advance notice: {policy.advance_notice_days} days
                </p>
                {policy.leave_types && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {policy.leave_types.map((lt) => (
                      <Badge key={lt.id} variant="outline" className="text-xs">{lt.name}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

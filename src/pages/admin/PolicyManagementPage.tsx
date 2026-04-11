import { useAdminLeavePolicies } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Clock } from 'lucide-react'

export default function PolicyManagementPage() {
  const { data: policies, isLoading } = useAdminLeavePolicies()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Policies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure company leave policies and types
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !policies?.length ? (
        <EmptyState title="No policies found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy.id} className="border-0 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F766E]/10">
                      <FileText className="h-5 w-5 text-[#0F766E]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{policy.name}</h3>
                      {policy.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {policy.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={policy.is_active ? 'success' : 'secondary'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  {policy.advance_notice_days} days advance notice required
                </div>

                {policy.leave_types && policy.leave_types.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t">
                    {policy.leave_types.map((lt) => (
                      <Badge key={lt.id} variant="outline" className="text-[11px] font-normal">
                        {lt.name}
                      </Badge>
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

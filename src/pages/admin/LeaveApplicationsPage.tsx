import { useAdminLeaveApplications, useUpdateLeaveApplication } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notificationStore'
import type { LeaveStatus } from '@/lib/types'

export default function LeaveApplicationsPage() {
  const { data: applications, isLoading } = useAdminLeaveApplications()
  const update = useUpdateLeaveApplication()
  const addToast = useNotificationStore((s) => s.addToast)

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    update.mutate({ id, status }, {
      onSuccess: () => addToast({ title: `Leave ${status.toLowerCase()}` }),
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  return (
    <div>
      <PageHeader title="Leave Applications" description="All company leave applications" />
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !applications?.length ? (
        <EmptyState title="No applications found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.user.full_name}</TableCell>
                <TableCell>{app.leave_type.name}</TableCell>
                <TableCell className="text-xs">
                  {formatDate(app.start_date)} — {formatDate(app.end_date)}
                </TableCell>
                <TableCell>{formatDays(app.total_days)}</TableCell>
                <TableCell><StatusBadge status={app.status as LeaveStatus} /></TableCell>
                <TableCell>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAction(app.id, 'APPROVED')} disabled={update.isPending}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(app.id, 'REJECTED')} disabled={update.isPending}>
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

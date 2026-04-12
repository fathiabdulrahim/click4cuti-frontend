import { useState } from 'react'
import { useTeamRequests, useUpdateTeamRequest } from '@/hooks/useTeamRequests'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notificationStore'
import type { LeaveStatus } from '@/lib/types'

export default function TeamRequestsPage() {
  const { data: requests, isLoading } = useTeamRequests()
  const updateRequest = useUpdateTeamRequest()
  const addToast = useNotificationStore((s) => s.addToast)
  const [remarks] = useState<Record<string, string>>({})

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateRequest.mutate(
      { id, status, reviewer_remarks: remarks[id] },
      {
        onSuccess: () =>
          addToast({ title: `Leave ${status.toLowerCase()}`, description: `Application has been ${status.toLowerCase()}.`, variant: 'success' }),
        onError: () =>
          addToast({ title: 'Error', description: 'Failed to update request.', variant: 'destructive' }),
      }
    )
  }

  return (
    <div>
      <PageHeader title="Team Leave Requests" description="Approve or reject pending team requests" />

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !requests?.length ? (
        <EmptyState title="No pending requests" description="Your team has no pending leave requests." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.user.full_name}</TableCell>
                <TableCell>{req.leave_type.name}</TableCell>
                <TableCell className="text-xs">
                  {formatDate(req.start_date)} — {formatDate(req.end_date)}
                </TableCell>
                <TableCell>{formatDays(req.total_days)}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">{req.reason}</TableCell>
                <TableCell><StatusBadge status={req.status as LeaveStatus} /></TableCell>
                <TableCell>
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req.id, 'APPROVED')}
                        disabled={updateRequest.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        disabled={updateRequest.isPending}
                      >
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

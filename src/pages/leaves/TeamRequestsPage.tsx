import { useState } from 'react'
import { useTeamRequests, useUpdateTeamRequest } from '@/hooks/useTeamRequests'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notificationStore'
import { Loader2 } from 'lucide-react'
import type { LeaveApplication, LeaveStatus } from '@/lib/types'

function errorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { error?: string; messages?: string[] } } })?.response?.data
  return data?.messages?.[0] || data?.error || fallback
}

export default function TeamRequestsPage() {
  const { data: requests, isLoading } = useTeamRequests()
  const updateRequest = useUpdateTeamRequest()
  const addToast = useNotificationStore((s) => s.addToast)

  const [rejectTarget, setRejectTarget] = useState<LeaveApplication | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    updateRequest.mutate(
      { id, status: 'APPROVED' },
      {
        onSuccess: () =>
          addToast({ title: 'Leave approved', description: 'Application has been approved.', variant: 'success' }),
        onError: (error) =>
          addToast({ title: 'Error', description: errorMessage(error, 'Failed to approve request.'), variant: 'destructive' }),
      }
    )
  }

  const openReject = (req: LeaveApplication) => {
    setRejectTarget(req)
    setRejectReason('')
    setRejectError(null)
  }

  const closeReject = () => setRejectTarget(null)

  const submitReject = () => {
    if (!rejectTarget) return
    if (rejectReason.trim().length === 0) {
      setRejectError('Please provide a reason for rejection')
      return
    }
    updateRequest.mutate(
      { id: rejectTarget.id, status: 'REJECTED', reviewer_remarks: rejectReason.trim() },
      {
        onSuccess: () => {
          addToast({ title: 'Leave rejected', description: 'Application has been rejected.', variant: 'success' })
          closeReject()
        },
        onError: (error) => setRejectError(errorMessage(error, 'Failed to reject request.')),
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
                        onClick={() => handleApprove(req.id)}
                        disabled={updateRequest.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openReject(req)}
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

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && closeReject()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject leave request</DialogTitle>
            <DialogDescription>
              {rejectTarget && (
                <>
                  <strong>{rejectTarget.user.full_name}</strong> · {rejectTarget.leave_type.name} ·{' '}
                  {formatDate(rejectTarget.start_date)} — {formatDate(rejectTarget.end_date)} ·{' '}
                  {formatDays(rejectTarget.total_days)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Reason for rejection <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value)
                if (rejectError) setRejectError(null)
              }}
              placeholder="Explain why this leave is being rejected..."
              rows={4}
            />
            {rejectError && <p className="text-xs text-destructive">{rejectError}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={closeReject}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReject} disabled={updateRequest.isPending}>
              {updateRequest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject leave'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

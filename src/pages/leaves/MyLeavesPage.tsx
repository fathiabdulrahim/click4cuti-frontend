import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { useLeavesList, useCancelLeave } from '@/hooks/useLeaves'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate, formatDays } from '@/lib/utils'
import type { LeaveApplication, LeaveStatus } from '@/lib/types'

function errorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { error?: string; messages?: string[] } } })?.response?.data
  return data?.messages?.[0] || data?.error || fallback
}

export default function MyLeavesPage() {
  const { data: leaves, isLoading } = useLeavesList()
  const cancelLeave = useCancelLeave()
  const addToast = useNotificationStore((s) => s.addToast)

  const [statusFilter, setStatusFilter] = useState<'ALL' | LeaveStatus>('ALL')
  const [cancelTarget, setCancelTarget] = useState<LeaveApplication | null>(null)

  const filtered =
    statusFilter === 'ALL' ? leaves : leaves?.filter((l) => l.status === statusFilter)

  const confirmCancel = () => {
    if (!cancelTarget) return
    cancelLeave.mutate(cancelTarget.id, {
      onSuccess: () => {
        addToast({ title: 'Leave cancelled', description: 'Your application has been cancelled.', variant: 'success' })
        setCancelTarget(null)
      },
      onError: (error) =>
        addToast({ title: 'Error', description: errorMessage(error, 'Failed to cancel leave.'), variant: 'destructive' }),
    })
  }

  return (
    <div>
      <PageHeader
        title="My Leave Applications"
        description="View and manage your leave applications"
        action={
          <Button asChild size="sm">
            <Link to="/leaves/apply">
              <Plus className="h-4 w-4" />
              Apply Leave
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !leaves?.length ? (
        <EmptyState
          title="No leave applications"
          description="You haven't applied for any leave yet."
        />
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'ALL' | LeaveStatus)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!filtered?.length ? (
            <EmptyState title="No matching applications" description="Try a different status filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.leave_type.name}</TableCell>
                    <TableCell>{formatDate(leave.start_date)}</TableCell>
                    <TableCell>{formatDate(leave.end_date)}</TableCell>
                    <TableCell>{formatDays(leave.total_days)}</TableCell>
                    <TableCell><StatusBadge status={leave.status as LeaveStatus} /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(leave.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {leave.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelTarget(leave)}
                          disabled={cancelLeave.isPending}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel leave application?</DialogTitle>
            <DialogDescription>
              {cancelTarget && (
                <>
                  This cancels your <strong>{cancelTarget.leave_type.name}</strong> from{' '}
                  {formatDate(cancelTarget.start_date)} to {formatDate(cancelTarget.end_date)} and
                  releases the reserved balance. This cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Keep application
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={cancelLeave.isPending}>
              {cancelLeave.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, cancel'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

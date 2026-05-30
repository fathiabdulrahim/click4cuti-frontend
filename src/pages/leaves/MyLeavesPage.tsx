import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLeavesList, useCancelLeave } from '@/hooks/useLeaves'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import type { LeaveApplication, LeaveStatus } from '@/lib/types'

type Filter = 'ALL' | LeaveStatus

const FILTERS: Filter[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function MyLeavesPage() {
  const { data: leaves, isLoading } = useLeavesList()
  const cancelLeave = useCancelLeave()
  const [filter, setFilter] = useState<Filter>('ALL')

  const filtered = useMemo(() => {
    if (!leaves) return []
    if (filter === 'ALL') return leaves
    return leaves.filter((l: LeaveApplication) => l.status === filter)
  }, [leaves, filter])

  const counts = useMemo(() => {
    if (!leaves) return { ALL: 0 } as Record<string, number>
    const c: Record<string, number> = { ALL: leaves.length }
    for (const l of leaves) {
      c[l.status] = (c[l.status] ?? 0) + 1
    }
    return c
  }, [leaves])

  return (
    <div>
      <PageHeader
        title="My Leave Applications"
        description="View and manage your leave applications"
        action={
          <Button asChild size="sm">
            <Link to="/leaves/apply">Apply for Leave</Link>
          </Button>
        }
      />

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !filtered.length ? (
        <EmptyState
          title="No leave applications"
          description={
            filter === 'ALL'
              ? "You haven't applied for any leave yet."
              : `No ${filter.toLowerCase()} leave applications.`
          }
        />
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
            {filtered.map((leave: LeaveApplication) => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium">{leave.leave_type.name}</TableCell>
                <TableCell>{formatDate(leave.start_date)}</TableCell>
                <TableCell>{formatDate(leave.end_date)}</TableCell>
                <TableCell>{formatDays(leave.total_days)}</TableCell>
                <TableCell><StatusBadge status={leave.status as LeaveStatus} /></TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(leave.created_at)}</TableCell>
                <TableCell className="text-right">
                  {leave.status === 'PENDING' && (
                    <div className="flex items-center gap-2 justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/leaves/${leave.id}/edit`}>Edit</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Cancel ${leave.leave_type?.name ?? 'leave'} from ${formatDate(leave.start_date)} to ${formatDate(leave.end_date)}?`)) {
                            cancelLeave.mutate(leave.id)
                          }
                        }}
                        disabled={cancelLeave.isPending}
                      >
                        Cancel
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
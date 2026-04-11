import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useLeavesList } from '@/hooks/useLeaves'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import type { LeaveStatus } from '@/lib/types'

export default function MyLeavesPage() {
  const { data: leaves, isLoading } = useLeavesList()

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium">{leave.leave_type.name}</TableCell>
                <TableCell>{formatDate(leave.start_date)}</TableCell>
                <TableCell>{formatDate(leave.end_date)}</TableCell>
                <TableCell>{formatDays(leave.total_days)}</TableCell>
                <TableCell><StatusBadge status={leave.status as LeaveStatus} /></TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(leave.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

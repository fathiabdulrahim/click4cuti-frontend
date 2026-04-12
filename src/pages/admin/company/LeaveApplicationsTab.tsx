import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, getInitials } from '@/lib/utils'
import { FileCheck } from 'lucide-react'
import { EmptyTab } from './shared'
import type { LeaveApplication, LeaveStatus } from '@/lib/types'

interface LeaveApplicationsTabProps {
  leaveApps: LeaveApplication[]
  search: string
}

export function LeaveApplicationsTab({ leaveApps, search }: LeaveApplicationsTabProps) {
  const q = search.toLowerCase()
  const filtered = leaveApps.filter((la) => la.user?.full_name?.toLowerCase().includes(q) || la.leave_type?.name?.toLowerCase().includes(q))

  if (leaveApps.length === 0) {
    return <EmptyTab icon={FileCheck} message="No leave applications" sub="Leave applications will appear here" />
  }

  if (filtered.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="pl-4">Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((la) => (
            <TableRow key={la.id}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {la.user ? getInitials(la.user.full_name) : '?'}
                  </div>
                  <span className="font-medium">{la.user?.full_name ?? 'Unknown'}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {la.leave_type?.name ?? '\u2014'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(la.start_date)}
                {la.end_date !== la.start_date && ` - ${formatDate(la.end_date)}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {la.total_days} {la.total_days === 1 ? 'day' : 'days'}
              </TableCell>
              <TableCell>
                <StatusBadge status={la.status as LeaveStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

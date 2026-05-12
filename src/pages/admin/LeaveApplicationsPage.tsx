import { useState } from 'react'
import { useAdminLeaveApplications } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatDays } from '@/lib/utils'
import { Check, X, Search } from 'lucide-react'
import { ApproveLeaveDialog } from '@/components/admin/ApproveLeaveDialog'
import { LeaveDetailDialog } from '@/components/admin/LeaveDetailDialog'
import type { LeaveStatus, LeaveApplication } from '@/lib/types'

export default function LeaveApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const queryParams = statusFilter === 'ALL' ? undefined : { status: statusFilter }
  const { data: applications, isLoading } = useAdminLeaveApplications(queryParams)
  const [search, setSearch] = useState('')
  const [pendingAction, setPendingAction] = useState<{
    application: LeaveApplication
    action: 'APPROVED' | 'REJECTED'
  } | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const filtered = applications?.filter(
    (a) =>
      a.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.leave_type.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">All company leave applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee or leave type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !filtered?.length ? (
        <EmptyState
          title={search ? 'No results found' : 'No applications found'}
          description={search ? 'Try a different search term' : undefined}
        />
      ) : (
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() => setDetailId(app.id)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {app.user.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="font-medium">{app.user.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.leave_type.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(app.start_date)} — {formatDate(app.end_date)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDays(app.total_days)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status as LeaveStatus} />
                    </TableCell>
                    <TableCell
                      className="pr-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.status === 'PENDING' && (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => setPendingAction({ application: app, action: 'APPROVED' })}
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setPendingAction({ application: app, action: 'REJECTED' })}
                            className="h-8 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ApproveLeaveDialog
        application={pendingAction?.application ?? null}
        action={pendingAction?.action ?? null}
        onClose={() => setPendingAction(null)}
      />

      <LeaveDetailDialog
        applicationId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  )
}

import { useAdminLeaveApplication } from '@/hooks/useAdmin'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { formatDate, formatDays } from '@/lib/utils'
import type { DayType, LeaveStatus } from '@/lib/types'

interface Props {
  applicationId: string | null
  onClose: () => void
}

const dayTypeLabel: Record<DayType, string> = {
  FULL_DAY: 'Full day',
  HALF_DAY_AM: 'Half day (AM)',
  HALF_DAY_PM: 'Half day (PM)',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

export function LeaveDetailDialog({ applicationId, onClose }: Props) {
  const open = !!applicationId
  const { data: app, isLoading } = useAdminLeaveApplication(applicationId ?? '')

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Leave Application Details</DialogTitle>
          <DialogDescription>
            {app
              ? `${app.user.full_name} · ${app.leave_type.name}`
              : 'Loading...'}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !app ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <Row label="Status">
              <div className="flex items-center gap-2">
                <StatusBadge status={app.status as LeaveStatus} />
                {app.requires_ceo_approval && (
                  <Badge variant="warning">CEO approval required</Badge>
                )}
              </div>
            </Row>
            <Row label="Dates">
              {formatDate(app.start_date)} — {formatDate(app.end_date)}
            </Row>
            <Row label="Duration">{formatDays(app.total_days)}</Row>
            <Row label="Reason">
              <p className="whitespace-pre-wrap">{app.reason || <span className="text-muted-foreground">—</span>}</p>
            </Row>
            {app.extended_reason && (
              <Row label="Extended reason">
                <p className="whitespace-pre-wrap">{app.extended_reason}</p>
              </Row>
            )}

            {app.leave_day_details && app.leave_day_details.length > 0 && (
              <Row label="Day breakdown">
                <ul className="space-y-1">
                  {app.leave_day_details.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm">
                      <span>{formatDate(d.leave_date)}</span>
                      <Badge variant="outline">{dayTypeLabel[d.day_type]}</Badge>
                    </li>
                  ))}
                </ul>
              </Row>
            )}

            {(app.status === 'APPROVED' || app.status === 'REJECTED') && (
              <>
                <Row label="Reviewer">
                  {app.approver?.full_name ?? <span className="text-muted-foreground italic">Not recorded</span>}
                </Row>
                <Row label="Reviewer remarks">
                  <p className="whitespace-pre-wrap">
                    {app.reviewer_remarks ?? <span className="text-muted-foreground">—</span>}
                  </p>
                </Row>
              </>
            )}

            <Row label="Submitted">{formatDate(app.created_at)}</Row>
            <Row label="Last updated">{formatDate(app.updated_at)}</Row>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

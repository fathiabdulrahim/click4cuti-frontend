import { Badge } from '@/components/ui/badge'
import type { LeaveStatus } from '@/lib/types'

const statusConfig: Record<LeaveStatus, { label: string; variant: 'default' | 'success' | 'destructive' | 'secondary' | 'warning' | 'outline' }> = {
  PENDING:   { label: 'Pending',   variant: 'warning' },
  APPROVED:  { label: 'Approved',  variant: 'success' },
  REJECTED:  { label: 'Rejected',  variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'secondary' },
}

export function StatusBadge({ status }: { status: LeaveStatus }) {
  const config = statusConfig[status] ?? {
    label: typeof status === 'string' && status.length > 0 ? status : 'Unknown',
    variant: 'secondary' as const,
  }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

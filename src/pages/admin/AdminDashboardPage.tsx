import { useAdminDashboard } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Users, Clock, CalendarCheck, CalendarX } from 'lucide-react'
import type { LeaveStatus } from '@/lib/types'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard()

  if (isLoading) return <LoadingSpinner className="py-12" />

  const kpis = [
    { label: 'Total Employees',   value: stats?.total_employees ?? 0,   icon: Users },
    { label: 'Pending Approvals', value: stats?.pending_approvals ?? 0,  icon: Clock },
    { label: 'On Leave Today',    value: stats?.on_leave_today ?? 0,     icon: CalendarCheck },
    { label: 'Approved YTD',      value: stats?.approved_ytd ?? 0,       icon: CalendarX },
  ]

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Company-wide leave overview" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Applications</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recent_applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{app.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {app.leave_type} · {formatDate(app.start_date)} · {app.total_days} days
                  </p>
                </div>
                <StatusBadge status={app.status as LeaveStatus} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

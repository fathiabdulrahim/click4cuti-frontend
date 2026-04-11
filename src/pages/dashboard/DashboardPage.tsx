import { useDashboard } from '@/hooks/useDashboard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatDays } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import type { LeaveStatus } from '@/lib/types'

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboard()
  const user = useAuthStore((s) => s.user)

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0]}`}
        description="Here's your leave overview"
      />

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        {stats?.leave_balances.map((balance) => (
          <Card key={balance.leave_type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {balance.leave_type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance.remaining}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {balance.used} used · {balance.pending} pending
              </p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_requests ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent applications</p>
            ) : (
              <div className="space-y-3">
                {stats?.recent_applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{app.leave_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(app.start_date)} — {formatDate(app.end_date)} · {formatDays(app.total_days)}
                      </p>
                    </div>
                    <StatusBadge status={app.status as LeaveStatus} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Public Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.upcoming_holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming holidays</p>
            ) : (
              <div className="space-y-2">
                {stats?.upcoming_holidays.map((ph, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ph.name}</span>
                    <span className="text-muted-foreground">{formatDate(ph.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

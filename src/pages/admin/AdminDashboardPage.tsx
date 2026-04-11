import { useAdminDashboard } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import {
  Users,
  Clock,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LeaveStatus } from '@/lib/types'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard()

  if (isLoading) return <LoadingSpinner className="py-12" />

  const kpis = [
    {
      label: 'Total Employees',
      value: stats?.total_employees ?? 0,
      icon: Users,
      color: 'bg-[#0F766E]/10 text-[#0F766E]',
    },
    {
      label: 'Pending Approvals',
      value: stats?.pending_approvals ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'On Leave Today',
      value: stats?.on_leave_today ?? 0,
      icon: CalendarCheck,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Approved YTD',
      value: stats?.approved_ytd ?? 0,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Company-wide leave overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold tracking-tight">{value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
          <Link
            to="/admin/leaves"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0F766E] hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {stats?.recent_applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No recent applications
            </p>
          ) : (
            <div className="space-y-3">
              {stats?.recent_applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {app.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{app.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.leave_type} &middot; {formatDate(app.start_date)} &middot;{' '}
                        {app.total_days} {app.total_days === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={app.status as LeaveStatus} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

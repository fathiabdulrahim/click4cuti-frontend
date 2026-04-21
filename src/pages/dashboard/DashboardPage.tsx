import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDays } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import type { LeaveStatus } from '@/lib/types'
import {
  CalendarPlus,
  TreePalm,
  Clock,
  CalendarCheck2,
  PartyPopper,
  ArrowRight,
  CalendarDays,
} from 'lucide-react'

const balanceIcons: Record<string, React.ElementType> = {
  Annual: TreePalm,
  Medical: CalendarCheck2,
  Emergency: Clock,
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboard()
  const user = useAuthStore((s) => s.user)

  if (isLoading) return <LoadingSpinner className="py-12" />

  const firstName = user?.full_name?.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FE4E01] to-[#0D9488] p-6 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-16 bottom-0 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/70">{greeting}</p>
            <h1 className="text-2xl font-bold tracking-tight">{firstName}</h1>
            <p className="text-sm text-white/70">Here is your leave overview for today</p>
          </div>
          <Button
            asChild
            className="bg-white text-[#FE4E01] hover:bg-white/90 font-medium cursor-pointer"
          >
            <Link to="/leaves/apply">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Apply Leave
            </Link>
          </Button>
        </div>
      </div>

      {/* Balance cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats?.leave_balances.map((balance) => {
          const Icon = balanceIcons[balance.leave_type] || CalendarDays
          return (
            <Card key={balance.leave_type} className="border-0 shadow-sm bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {balance.leave_type}
                    </p>
                    <div>
                      <p className="text-3xl font-bold tracking-tight">{balance.remaining}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        days remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FE4E01]/10">
                    <Icon className="h-5 w-5 text-[#FE4E01]" />
                  </div>
                </div>
                {/* Usage bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{balance.used} used</span>
                    <span>{balance.pending} pending</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FE4E01] transition-all"
                      style={{
                        width: `${balance.total > 0 ? ((balance.used / balance.total) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Pending requests card */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </p>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{stats?.pending_requests ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    awaiting approval
                  </p>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent applications */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
            <Link
              to="/leaves"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FE4E01] hover:underline"
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
              <div className="space-y-4">
                {stats?.recent_applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{app.leave_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(app.start_date)} — {formatDate(app.end_date)} &middot;{' '}
                        {formatDays(app.total_days)}
                      </p>
                    </div>
                    <StatusBadge status={app.status as LeaveStatus} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming holidays */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.upcoming_holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No upcoming holidays
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.upcoming_holidays.map((ph, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <PartyPopper className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ph.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(ph.date)}</p>
                    </div>
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

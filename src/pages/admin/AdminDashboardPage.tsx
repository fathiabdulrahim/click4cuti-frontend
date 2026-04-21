import {
  useAdminDashboard,
  useAdminAgencies,
  useAdminCompanies,
  useAdminUsers,
} from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Users,
  Clock,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Shield,
  Building2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LeaveStatus } from '@/lib/types'
import { useAuthStore } from '@/stores/authStore'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard()
  const { data: agencies } = useAdminAgencies()
  const { data: companies } = useAdminCompanies()
  const { data: users } = useAdminUsers()
  const adminUser = useAuthStore((s) => s.adminUser)

  if (isLoading) return <LoadingSpinner className="py-12" />

  const isSuperAdmin = adminUser?.scope === 'SUPER_ADMIN'

  const kpis = [
    {
      label: 'Total Employees',
      value: stats?.total_employees ?? 0,
      icon: Users,
      color: 'bg-[#FE4E01]/10 text-[#FE4E01]',
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
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] px-6 py-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#FE4E01]/15" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-20 w-20 rounded-full bg-[#FE4E01]/10" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative">
          <p className="text-sm text-white/50">Administration Panel</p>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Welcome back, {adminUser?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Here is your system overview for today
          </p>
        </div>
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

      {/* Agencies & Companies overview */}
      {isSuperAdmin && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agencies */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FE4E01]/10">
                  <Shield className="h-4 w-4 text-[#FE4E01]" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Agencies</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {agencies?.length ?? 0} total
                  </p>
                </div>
              </div>
              <Link
                to="/admin/agencies"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#FE4E01] hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {!agencies?.length ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No agencies yet
                </p>
              ) : (
                <div className="space-y-2">
                  {agencies.slice(0, 5).map((agency) => {
                    const companyCount = companies?.filter(
                      (c) => c.agency_id === agency.id
                    ).length ?? 0
                    const employeeCount = users?.filter((u) =>
                      companies
                        ?.filter((c) => c.agency_id === agency.id)
                        .some((c) => c.id === u.company_id)
                    ).length ?? 0

                    return (
                      <Link
                        key={agency.id}
                        to={`/admin/agencies/${agency.id}`}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FE4E01]/10">
                            <Shield className="h-4 w-4 text-[#FE4E01]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{agency.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {companyCount} {companyCount === 1 ? 'company' : 'companies'} &middot;{' '}
                              {employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={agency.is_active ? 'success' : 'secondary'}>
                          {agency.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Companies */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Companies</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {companies?.length ?? 0} total
                  </p>
                </div>
              </div>
              <Link
                to="/admin/companies"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#FE4E01] hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {!companies?.length ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No companies yet
                </p>
              ) : (
                <div className="space-y-2">
                  {companies.slice(0, 5).map((company) => {
                    const employeeCount = users?.filter(
                      (u) => u.company_id === company.id
                    ).length ?? 0
                    const agencyName = agencies?.find(
                      (a) => a.id === company.agency_id
                    )?.name

                    return (
                      <Link
                        key={company.id}
                        to={`/admin/companies/${company.id}`}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{company.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {agencyName ? `${agencyName} · ` : ''}
                              {employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={company.is_active ? 'success' : 'secondary'}>
                          {company.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Applications */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
          <Link
            to="/admin/leaves"
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

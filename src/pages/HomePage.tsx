import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  ShieldCheck,
  BarChart3,
  Clock,
  ArrowRight,
  Building2,
  UserCog,
  Sparkles,
  Zap,
  Globe,
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Leave Tracking',
    description:
      'Apply, track, and manage leave requests with real-time balance updates and calendar views.',
    span: 'lg:col-span-2',
  },
  {
    icon: Users,
    title: 'Team Management',
    description:
      'Managers can review and approve team leave requests with a clear overview of availability.',
    span: '',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Compliance',
    description:
      'Configure leave policies, public holidays, and work schedules per company and department.',
    span: '',
  },
  {
    icon: BarChart3,
    title: 'HR Analytics',
    description:
      'Comprehensive dashboards with insights on leave trends, utilization, and workforce planning.',
    span: 'lg:col-span-2',
  },
  {
    icon: Clock,
    title: 'Quick Approvals',
    description:
      'Streamlined approval workflows that keep your team moving without delays.',
    span: '',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant',
    description:
      'Support for multiple agencies and companies with hierarchical access control.',
    span: '',
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description:
      'Responsive design works seamlessly on desktop, tablet, and mobile devices.',
    span: 'lg:col-span-2',
  },
]

const stats = [
  { label: 'Faster Approvals', value: '3x', icon: Zap },
  { label: 'Time Saved Monthly', value: '40hrs', icon: Clock },
  { label: 'Policy Compliance', value: '100%', icon: ShieldCheck },
  { label: 'Team Visibility', value: 'Real-time', icon: Globe },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Animated aurora background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0F766E]/20 blur-[120px] animate-pulse" />
        <div
          className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#5EEAD4]/10 blur-[100px]"
          style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-[#0F766E]/15 blur-[140px]"
          style={{ animation: 'pulse 5s ease-in-out infinite 2s' }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
          <div className="max-w-7xl mx-auto bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] flex items-center justify-center">
                <CalendarDays className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Click4Cuti
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer px-4 py-2 rounded-lg hover:bg-white/[0.06]"
              >
                Employee
              </Link>
              <Link
                to="/admin/login"
                className="text-sm font-medium text-white bg-white/[0.1] hover:bg-white/[0.15] transition-all cursor-pointer px-4 py-2 rounded-lg border border-white/[0.08]"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#5EEAD4]/10 border border-[#5EEAD4]/20 text-[#5EEAD4] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Modern Leave Management Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Manage Leave
            <br />
            <span className="bg-gradient-to-r from-[#5EEAD4] via-[#0F766E] to-[#5EEAD4] bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Streamline leave applications, approvals, and tracking for your
            entire organization. Built for modern teams.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-2xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] text-white shadow-[0_0_30px_rgba(15,118,110,0.3)] hover:shadow-[0_0_40px_rgba(15,118,110,0.5)] hover:scale-[1.02]"
            >
              <UserCog className="w-5 h-5" />
              Employee Login
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/admin/login"
              className="group inline-flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Portal
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-1 overflow-hidden">
              <div className="rounded-xl bg-[#0A0F1A] p-4 sm:p-6">
                {/* Fake dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="h-4 w-48 bg-white/[0.06] rounded-full" />
                  <div className="flex gap-2">
                    <div className="h-6 w-6 bg-white/[0.06] rounded" />
                    <div className="h-6 w-6 bg-white/[0.06] rounded" />
                  </div>
                </div>
                {/* Fake stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {['Annual Leave', 'Sick Leave', 'Pending', 'Approved'].map(
                    (label, i) => (
                      <div
                        key={label}
                        className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4"
                      >
                        <div className="text-[10px] sm:text-xs text-white/40 mb-1">
                          {label}
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-white/80">
                          {[12, 8, 3, 24][i]}
                        </div>
                        <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#5EEAD4]"
                            style={{ width: `${[65, 40, 25, 85][i]}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                {/* Fake table rows */}
                <div className="space-y-2">
                  {[1, 2, 3].map((row) => (
                    <div
                      key={row}
                      className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-4 py-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-white/[0.08]" />
                      <div className="flex-1 flex items-center gap-4">
                        <div className="h-3 w-24 bg-white/[0.06] rounded" />
                        <div className="h-3 w-16 bg-white/[0.04] rounded hidden sm:block" />
                        <div className="h-3 w-20 bg-white/[0.04] rounded hidden sm:block" />
                      </div>
                      <div
                        className={`h-5 w-16 rounded-full ${
                          row === 1
                            ? 'bg-[#5EEAD4]/15'
                            : row === 2
                              ? 'bg-yellow-500/15'
                              : 'bg-[#5EEAD4]/10'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative group text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#5EEAD4]/20 transition-all duration-300"
              >
                <stat.icon className="w-5 h-5 text-[#5EEAD4]/60 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/40 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="mt-4 text-white/40 max-w-lg mx-auto">
              A complete leave management platform built for modern teams.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#5EEAD4]/20 hover:bg-white/[0.05] transition-all duration-300 ${feature.span}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#5EEAD4]/10 border border-[#5EEAD4]/10 flex items-center justify-center mb-4 group-hover:bg-[#5EEAD4]/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#5EEAD4]" />
                </div>
                <h3 className="text-base font-semibold text-white/90">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/40 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/20 to-[#5EEAD4]/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-white/40 max-w-xl mx-auto">
              Choose your portal below. Employees apply for leave, admins manage
              the entire system.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] text-white font-semibold px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(15,118,110,0.3)] hover:shadow-[0_0_40px_rgba(15,118,110,0.5)] transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              >
                <UserCog className="w-5 h-5" />
                Employee Login
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/admin/login"
                className="group inline-flex items-center gap-2.5 bg-white/[0.06] text-white font-semibold px-8 py-4 rounded-2xl border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin Portal
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/70">
              Click4Cuti
            </span>
          </div>
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Click4Cuti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

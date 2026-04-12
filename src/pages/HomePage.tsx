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
  CheckCircle2,
  Briefcase,
  CalendarCheck,
  FileCheck,
} from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Leave Tracking',
    description:
      'Apply, track, and manage leave requests with real-time balance updates and calendar views.',
    colSpan: 'sm:col-span-2',
    accent: 'bg-[#0F766E]',
  },
  {
    icon: Users,
    title: 'Team Management',
    description:
      'Review and approve team leave requests with a clear overview of availability.',
    colSpan: '',
    accent: 'bg-[#0369A1]',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Compliance',
    description:
      'Configure leave policies, public holidays, and work schedules per company.',
    colSpan: '',
    accent: 'bg-[#0F766E]',
  },
  {
    icon: BarChart3,
    title: 'HR Analytics',
    description:
      'Dashboards with insights on leave trends, utilization, and workforce planning.',
    colSpan: '',
    accent: 'bg-[#0369A1]',
  },
  {
    icon: Clock,
    title: 'Quick Approvals',
    description:
      'Streamlined approval workflows that keep your team moving without delays.',
    colSpan: '',
    accent: 'bg-[#0F766E]',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant',
    description:
      'Support for multiple agencies and companies with hierarchical access control.',
    colSpan: 'sm:col-span-2',
    accent: 'bg-[#0369A1]',
  },
]

const steps = [
  {
    icon: Briefcase,
    step: '01',
    title: 'Employee Applies',
    description: 'Submit leave requests in seconds with an intuitive form.',
  },
  {
    icon: FileCheck,
    step: '02',
    title: 'Manager Reviews',
    description: 'Managers get notified and approve or reject with one click.',
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'Everyone Stays Synced',
    description:
      'Balances update automatically. The team calendar reflects changes instantly.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E8EDED]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#134E4A] tracking-tight">
              Click4Cuti
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-[#134E4A]/70 hover:text-[#0F766E] transition-colors cursor-pointer px-4 py-2 rounded-lg"
            >
              Employee Login
            </Link>
            <Link
              to="/admin/login"
              className="text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#0D6B63] transition-colors cursor-pointer px-5 py-2 rounded-lg shadow-sm"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Split Layout */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F766E] bg-[#0F766E]/8 px-3 py-1 rounded-full mb-6">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Leave Management System
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#134E4A] tracking-tight leading-[1.15]">
                Leave management
                <br />
                your team can
                <br />
                <span className="text-[#0F766E]">rely on.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#134E4A]/60 leading-relaxed max-w-md">
                Click4Cuti streamlines leave applications, approvals, and
                tracking for organizations of every size. Built for HR teams that
                value clarity.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0D6B63] transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <UserCog className="w-4.5 h-4.5" />
                  Employee Login
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/admin/login"
                  className="group inline-flex items-center justify-center gap-2 bg-[#134E4A]/5 text-[#134E4A] font-semibold px-6 py-3 rounded-xl border border-[#134E4A]/10 hover:border-[#134E4A]/20 hover:bg-[#134E4A]/8 transition-all duration-200 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  Admin Portal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Trust signal */}
              <div className="mt-8 flex items-center gap-4 text-xs text-[#134E4A]/40">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]/50" />
                  Multi-tenant ready
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]/50" />
                  Role-based access
                </span>
                <span className="flex items-center gap-1.5 hidden sm:flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]/50" />
                  Real-time sync
                </span>
              </div>
            </div>

            {/* Right — Product Preview Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-[#0F766E]/[0.04] rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl border border-[#E8EDED] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFA] border-b border-[#E8EDED]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8EDED]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8EDED]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8EDED]" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="h-5 bg-white rounded-md border border-[#E8EDED] flex items-center px-3">
                      <span className="text-[10px] text-[#134E4A]/30 font-medium">
                        click4cuti.app/dashboard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: 'Annual Leave',
                        value: '12',
                        sub: '/ 16 days',
                        color: 'bg-[#0F766E]',
                        pct: 75,
                      },
                      {
                        label: 'Sick Leave',
                        value: '8',
                        sub: '/ 14 days',
                        color: 'bg-[#0369A1]',
                        pct: 57,
                      },
                      {
                        label: 'Pending',
                        value: '2',
                        sub: 'requests',
                        color: 'bg-amber-500',
                        pct: 100,
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-xl bg-[#F8FAFA] border border-[#E8EDED] p-3"
                      >
                        <div className="text-[10px] font-medium text-[#134E4A]/40 mb-1">
                          {card.label}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-[#134E4A]">
                            {card.value}
                          </span>
                          <span className="text-[10px] text-[#134E4A]/30">
                            {card.sub}
                          </span>
                        </div>
                        <div className="mt-2 h-1 bg-[#E8EDED] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${card.color}`}
                            style={{ width: `${card.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent activity */}
                  <div>
                    <div className="text-[10px] font-semibold text-[#134E4A]/40 uppercase tracking-wider mb-2">
                      Recent Applications
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          name: 'Ahmad R.',
                          type: 'Annual Leave',
                          days: '3 days',
                          status: 'Approved',
                          statusColor:
                            'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/10',
                        },
                        {
                          name: 'Siti N.',
                          type: 'Medical Leave',
                          days: '1 day',
                          status: 'Pending',
                          statusColor:
                            'bg-amber-50 text-amber-700 border-amber-100',
                        },
                        {
                          name: 'Farid K.',
                          type: 'Annual Leave',
                          days: '5 days',
                          status: 'Approved',
                          statusColor:
                            'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/10',
                        },
                      ].map((row) => (
                        <div
                          key={row.name}
                          className="flex items-center gap-3 rounded-lg bg-white border border-[#E8EDED] px-3 py-2.5"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#0F766E]/10 flex items-center justify-center text-[10px] font-bold text-[#0F766E]">
                            {row.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-[#134E4A]">
                              {row.name}
                            </div>
                            <div className="text-[10px] text-[#134E4A]/40">
                              {row.type} &middot; {row.days}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${row.statusColor}`}
                          >
                            {row.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#134E4A] tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-[#134E4A]/50 max-w-md mx-auto">
              Three simple steps to streamline your leave process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((item, i) => (
              <div key={item.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-[#0F766E]/15" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#E8EDED] shadow-sm mb-4">
                    <item.icon className="w-7 h-7 text-[#0F766E]" />
                  </div>
                  <div className="text-[10px] font-bold text-[#0F766E]/40 uppercase tracking-widest mb-1.5">
                    Step {item.step}
                  </div>
                  <h3 className="text-base font-semibold text-[#134E4A] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#134E4A]/50 leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#134E4A] tracking-tight">
              Built for Every Role
            </h2>
            <p className="mt-3 text-[#134E4A]/50 max-w-md mx-auto">
              A complete platform from individual employees to super admins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl bg-[#F8FAFA] border border-[#E8EDED] p-6 hover:border-[#0F766E]/20 hover:shadow-[0_4px_16px_rgba(15,118,110,0.06)] transition-all duration-200 ${feature.colSpan}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${feature.accent} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#134E4A]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#134E4A]/45 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#134E4A] tracking-tight">
              Choose Your Portal
            </h2>
            <p className="mt-3 text-[#134E4A]/50 max-w-md mx-auto">
              Select the right entry point based on your role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Employee Card */}
            <Link
              to="/login"
              className="group relative rounded-2xl bg-white border border-[#E8EDED] p-8 hover:border-[#0F766E]/30 hover:shadow-[0_8px_32px_rgba(15,118,110,0.08)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F766E] flex items-center justify-center mb-5">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A] mb-2">
                Employee Portal
              </h3>
              <p className="text-sm text-[#134E4A]/50 leading-relaxed mb-6">
                Apply for leave, check your balances, view team calendars, and
                track request status.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  'Apply & track leave requests',
                  'View leave balances',
                  'Team availability calendar',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#134E4A]/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] group-hover:gap-2.5 transition-all">
                Sign in as Employee
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Admin Card */}
            <Link
              to="/admin/login"
              className="group relative rounded-2xl bg-white border border-[#E8EDED] p-8 hover:border-[#0369A1]/30 hover:shadow-[0_8px_32px_rgba(3,105,161,0.08)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0369A1] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A] mb-2">
                Admin Portal
              </h3>
              <p className="text-sm text-[#134E4A]/50 leading-relaxed mb-6">
                Manage users, configure policies, oversee all leave applications
                across the organization.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  'User & role management',
                  'Leave policy configuration',
                  'Company & agency oversight',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#134E4A]/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0369A1] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0369A1] group-hover:gap-2.5 transition-all">
                Sign in as Admin
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E8EDED]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#134E4A]">Click4Cuti</span>
          </div>
          <p className="text-xs text-[#134E4A]/35">
            &copy; {new Date().getFullYear()} Click4Cuti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

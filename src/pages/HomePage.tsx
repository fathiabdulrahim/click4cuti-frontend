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
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Leave Tracking',
    description:
      'Apply, track, and manage leave requests with real-time balance updates and calendar views.',
    colSpan: 'sm:col-span-2',
  },
  {
    icon: Users,
    title: 'Team Management',
    description:
      'Review and approve team leave requests with a clear overview of availability.',
    colSpan: '',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Compliance',
    description:
      'Configure leave policies, public holidays, and work schedules per company.',
    colSpan: '',
  },
  {
    icon: BarChart3,
    title: 'HR Analytics',
    description:
      'Dashboards with insights on leave trends, utilization, and workforce planning.',
    colSpan: '',
  },
  {
    icon: Clock,
    title: 'Quick Approvals',
    description:
      'Streamlined approval workflows that keep your team moving without delays.',
    colSpan: '',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant',
    description:
      'Support for multiple agencies and companies with hierarchical access control.',
    colSpan: 'sm:col-span-2',
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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo-navbar.svg"
              alt="Click4Cuti"
              className="h-8 sm:h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#FE4E01] transition-colors cursor-pointer px-4 py-2 rounded-lg"
            >
              Employee Login
            </Link>
            <Link
              to="/admin/login"
              className="text-sm font-semibold text-white bg-[#FE4E01] hover:bg-[#E54400] transition-colors cursor-pointer px-5 py-2 rounded-lg"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FE4E01]/[0.03] via-transparent to-[#FE4E01]/[0.02]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FE4E01] bg-[#FE4E01]/8 px-3 py-1.5 rounded-full mb-6">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Leave Management System
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Leave management
                <br />
                your team can
                <br />
                <span className="text-[#FE4E01]">rely on.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-md">
                Click4Cuti streamlines leave applications, approvals, and
                tracking for organizations of every size. Built for HR teams that
                value clarity.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-[#FE4E01] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#E54400] transition-colors duration-200 cursor-pointer"
                >
                  <UserCog className="w-4.5 h-4.5" />
                  Employee Login
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/admin/login"
                  className="group inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  Admin Portal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex items-center gap-5 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FE4E01]/60" />
                  Multi-tenant ready
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FE4E01]/60" />
                  Role-based access
                </span>
                <span className="flex items-center gap-1.5 hidden sm:flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FE4E01]/60" />
                  Real-time sync
                </span>
              </div>
            </div>

            {/* Right — Product Preview */}
            <div className="relative">
              <div className="absolute -inset-6 bg-[#FE4E01]/[0.04] rounded-[2rem] blur-3xl" />
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="h-5 bg-white rounded-md border border-gray-200 flex items-center px-3">
                      <span className="text-[10px] text-gray-400 font-medium">
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
                        color: 'bg-[#FE4E01]',
                        pct: 75,
                      },
                      {
                        label: 'Sick Leave',
                        value: '8',
                        sub: '/ 14 days',
                        color: 'bg-gray-900',
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
                        className="rounded-xl bg-gray-50 border border-gray-100 p-3"
                      >
                        <div className="text-[10px] font-medium text-gray-400 mb-1">
                          {card.label}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-gray-900">
                            {card.value}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {card.sub}
                          </span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
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
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                            'bg-emerald-50 text-emerald-700 border-emerald-100',
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
                            'bg-emerald-50 text-emerald-700 border-emerald-100',
                        },
                      ].map((row) => (
                        <div
                          key={row.name}
                          className="flex items-center gap-3 rounded-lg bg-white border border-gray-100 px-3 py-2.5"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#FE4E01]/10 flex items-center justify-center text-[10px] font-bold text-[#FE4E01]">
                            {row.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-900">
                              {row.name}
                            </div>
                            <div className="text-[10px] text-gray-400">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#FE4E01] uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Three simple steps to streamline
              <br className="hidden sm:block" />
              your leave process
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((item, i) => (
              <div key={item.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px border-t-2 border-dashed border-[#FE4E01]/20" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-[#FE4E01]/10 mb-4">
                    <item.icon className="w-7 h-7 text-[#FE4E01]" />
                  </div>
                  <div className="text-[10px] font-bold text-[#FE4E01]/50 uppercase tracking-widest mb-1.5">
                    Step {item.step}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#FE4E01] uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Built for Every Role
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              A complete platform from individual employees to super admins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl bg-white border border-gray-200 p-6 hover:border-[#FE4E01]/30 hover:shadow-[0_4px_20px_rgba(254,78,1,0.06)] transition-all duration-200 cursor-pointer ${feature.colSpan}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FE4E01] flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#FE4E01] uppercase tracking-wider mb-3">
              Get Started
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Choose Your Portal
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Select the right entry point based on your role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Employee Card */}
            <Link
              to="/login"
              className="group relative rounded-2xl bg-white border border-gray-200 p-8 hover:border-[#FE4E01]/40 hover:shadow-[0_8px_32px_rgba(254,78,1,0.08)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FE4E01] flex items-center justify-center mb-5">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Employee Portal
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
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
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FE4E01] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FE4E01] group-hover:gap-2.5 transition-all">
                Sign in as Employee
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Admin Card */}
            <Link
              to="/admin/login"
              className="group relative rounded-2xl bg-gray-900 border border-gray-800 p-8 hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FE4E01] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Admin Portal
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
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
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FE4E01] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FE4E01] group-hover:gap-2.5 transition-all">
                Sign in as Admin
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo-icon.svg"
              alt="Click4Cuti"
              className="w-7 h-7 rounded-md"
            />
            <span className="text-sm font-bold text-gray-900">Click4Cuti</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Click4Cuti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

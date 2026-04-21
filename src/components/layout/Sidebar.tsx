import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Building2, Shield,
  CalendarDays, FileText, Settings, LogOut, Menu, ChevronLeft,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useLogout, useAdminLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const employeeLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leaves', icon: Calendar, label: 'My Leaves' },
  { to: '/leaves/apply', icon: FileText, label: 'Apply Leave' },
  { to: '/profile', icon: Settings, label: 'Profile' },
]

const managerLinks = [
  { to: '/leaves/team', icon: Users, label: 'Team Requests' },
]

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { to: '/admin/agencies', icon: Shield, label: 'Agencies' },
  { to: '/admin/companies', icon: Building2, label: 'Companies' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/policies', icon: FileText, label: 'Leave Policies' },
  { to: '/admin/holidays', icon: CalendarDays, label: 'Public Holidays' },
  { to: '/admin/leaves', icon: Calendar, label: 'Leave Applications' },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const adminUser = useAuthStore((s) => s.adminUser)
  const { isOpen, toggle } = useSidebarStore()
  const logout = useLogout()
  const adminLogout = useAdminLogout()

  const role = user?.role
  const isAdmin = !!adminUser

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r bg-white transition-all duration-200 ease-in-out',
        isOpen ? 'w-60' : 'w-[68px]'
      )}
    >
      {/* Brand header */}
      <div className="flex items-center h-16 px-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="shrink-0 cursor-pointer hover:bg-muted"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        {isOpen && (
          <div className="ml-2 flex items-center">
            <img src="/logo-navbar.svg" alt="Click4Cuti" className="h-[22px]" />
          </div>
        )}
        {!isOpen && (
          <img src="/logo-icon.svg" alt="Click4Cuti" className="h-6 w-6 ml-2" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {isAdmin ? (
          adminLinks.map((link) => (
            <SidebarLink key={link.to} {...link} isOpen={isOpen} />
          ))
        ) : (
          <>
            {isOpen && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Main
              </p>
            )}
            {employeeLinks.map((link) => (
              <SidebarLink key={link.to} {...link} isOpen={isOpen} />
            ))}

            {(role === 'MANAGER' || role === 'ADMIN') && (
              <>
                {isOpen && (
                  <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Management
                  </p>
                )}
                {!isOpen && <div className="my-2 mx-2 border-t" />}
                {managerLinks.map((link) => (
                  <SidebarLink key={link.to} {...link} isOpen={isOpen} />
                ))}
              </>
            )}

            {role === 'ADMIN' && (
              <>
                {isOpen && (
                  <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Administration
                  </p>
                )}
                {!isOpen && <div className="my-2 mx-2 border-t" />}
                {adminLinks.map((link) => (
                  <SidebarLink key={link.to} {...link} isOpen={isOpen} />
                ))}
              </>
            )}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={() => isAdmin ? adminLogout.mutate() : logout.mutate()}
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer',
            !isOpen && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  isOpen,
}: {
  to: string
  icon: React.ElementType
  label: string
  isOpen: boolean
}) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard' || to === '/admin'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-[#FE4E01]/10 text-[#FE4E01] font-medium'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          !isOpen && 'justify-center px-0'
        )
      }
      title={!isOpen ? label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {isOpen && <span>{label}</span>}
    </NavLink>
  )
}

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Building2, Shield,
  CalendarDays, FileText, Settings, LogOut, Menu,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/companies', icon: Building2, label: 'Companies' },
  { to: '/admin/agencies', icon: Shield, label: 'Agencies' },
  { to: '/admin/policies', icon: FileText, label: 'Leave Policies' },
  { to: '/admin/holidays', icon: CalendarDays, label: 'Public Holidays' },
  { to: '/admin/leaves', icon: Calendar, label: 'Leave Applications' },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const { isOpen, toggle } = useSidebarStore()
  const logout = useLogout()

  const role = user?.role

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-background border-r transition-all duration-200',
        isOpen ? 'w-56' : 'w-14'
      )}
    >
      {/* Toggle */}
      <div className="flex items-center h-14 px-3 border-b">
        <Button variant="ghost" size="icon" onClick={toggle}>
          <Menu className="h-5 w-5" />
        </Button>
        {isOpen && <span className="ml-2 font-bold text-primary">Click4Cuti</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {employeeLinks.map((link) => (
          <SidebarLink key={link.to} {...link} isOpen={isOpen} />
        ))}

        {(role === 'MANAGER' || role === 'ADMIN') && (
          <>
            <Separator className="my-2" />
            {managerLinks.map((link) => (
              <SidebarLink key={link.to} {...link} isOpen={isOpen} />
            ))}
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <Separator className="my-2" />
            {adminLinks.map((link) => (
              <SidebarLink key={link.to} {...link} isOpen={isOpen} />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-2 w-full rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
          'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {isOpen && <span>{label}</span>}
    </NavLink>
  )
}

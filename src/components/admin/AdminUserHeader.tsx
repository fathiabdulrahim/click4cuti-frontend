import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Building2, Briefcase, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import type { User } from '@/lib/types'

interface Props {
  user: User
}

export function AdminUserHeader({ user }: Props) {
  return (
    <div className="space-y-4 pb-6 mb-6 border-b">
      <Button variant="ghost" size="sm" asChild className="-ml-3">
        <Link to="/admin/users">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to users
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FE4E01]/20 to-[#FE4E01]/5 text-lg font-semibold text-[#FE4E01] ring-1 ring-[#FE4E01]/10">
          {getInitials(user.full_name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight truncate">
                  {user.full_name}
                </h1>
                <Badge
                  variant={user.is_active ? 'default' : 'secondary'}
                  className={
                    user.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      : ''
                  }
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {user.role && (
                  <Badge
                    variant="outline"
                    className={
                      user.role === 'ADMIN'
                        ? 'border-[#FE4E01]/30 text-[#FE4E01] bg-[#FE4E01]/5'
                        : user.role === 'MANAGER'
                          ? 'border-blue-200 text-blue-700 bg-blue-50'
                          : ''
                    }
                  >
                    {user.role}
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {user.designation?.title ?? '—'}
                {user.employee_id && (
                  <span className="ml-2">
                    · <span className="font-mono text-xs">{user.employee_id}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact strip */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {user.email && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${user.email}`} className="hover:text-foreground hover:underline">
                  {user.email}
                </a>
              </span>
            )}
            {user.phone && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {user.phone}
              </span>
            )}
            {user.department?.name && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {user.department.name}
              </span>
            )}
            {user.manager?.full_name && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                Manager: {user.manager.full_name}
              </span>
            )}
            {user.branch_id && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Branch
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

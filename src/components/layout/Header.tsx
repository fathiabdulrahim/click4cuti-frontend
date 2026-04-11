import { Bell, ChevronDown, Search } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const adminUser = useAuthStore((s) => s.adminUser)

  const displayName = adminUser?.full_name ?? user?.full_name
  const displayRole = adminUser?.scope ?? user?.role

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-white">
      {/* Search (placeholder) */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Search className="h-4 w-4" />
        <span className="text-sm hidden sm:inline">Search...</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative cursor-pointer hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#0F766E]" />
        </Button>

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-[#0F766E]/10 text-[#0F766E] font-medium">
              {displayName ? getInitials(displayName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{displayRole}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </header>
  )
}

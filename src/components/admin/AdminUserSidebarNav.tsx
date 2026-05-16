import { cn } from '@/lib/utils'
import { ADMIN_USER_NAV } from './adminUserNav'

interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function AdminUserSidebarNav({ value, onChange, className }: Props) {
  return (
    <nav className={cn('w-56 shrink-0', className)} aria-label="Employee sections">
      <div className="sticky top-4 space-y-4">
        {ADMIN_USER_NAV.map((group) => (
          <div key={group.label}>
            <h4 className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = item.value === value
                return (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => onChange(item.value)}
                      className={cn(
                        'group w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors text-left',
                        isActive
                          ? 'bg-[#FE4E01]/10 text-[#FE4E01] font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-[#FE4E01]' : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}

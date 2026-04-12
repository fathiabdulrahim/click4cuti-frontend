import { formatDate } from '@/lib/utils'

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function safeFormatDate(value?: string | null): string | undefined {
  if (!value) return undefined
  try {
    return formatDate(value)
  } catch {
    return undefined
  }
}

export function InfoTile({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: string
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium truncate">{value || '\u2014'}</p>
      </div>
    </div>
  )
}

export function EmptyTab({ icon: Icon, message, sub }: { icon: React.ComponentType<{ className?: string }>; message: string; sub: string }) {
  return (
    <div className="text-center py-10">
      <Icon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">{sub}</p>
    </div>
  )
}

import { cn } from '@/lib/utils'

interface DataFieldProps {
  label: string
  value?: React.ReactNode
  /** Render a placeholder when the value is null/undefined/empty. */
  fallback?: string
  className?: string
}

/** A clean label + value row for read-only data display.
 *  Renders the label in a small uppercase muted style and the value below in body weight. */
export function DataField({ label, value, fallback = '—', className }: DataFieldProps) {
  const isEmpty = value === null || value === undefined || value === ''
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={cn('text-sm', isEmpty && 'text-muted-foreground')}>
        {isEmpty ? fallback : value}
      </dd>
    </div>
  )
}

interface DataGridProps {
  children: React.ReactNode
  className?: string
  /** Number of columns at the md breakpoint. */
  cols?: 2 | 3 | 4
}

export function DataGrid({ children, className, cols = 3 }: DataGridProps) {
  const colsCls = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <dl className={cn('grid grid-cols-1 gap-x-6 gap-y-4', colsCls, className)}>{children}</dl>
  )
}

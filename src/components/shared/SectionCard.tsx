import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Remove inner padding from CardContent (useful when child is a table). */
  flush?: boolean
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  flush,
}: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden border-border/60', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 py-4 border-b bg-muted/30">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-none tracking-tight">{title}</h3>
          {description && (
            <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </CardHeader>
      <CardContent className={cn(flush ? 'p-0' : 'p-6')}>{children}</CardContent>
    </Card>
  )
}

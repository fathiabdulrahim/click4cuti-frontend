import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({
  title = 'No data',
  description,
  message,
  icon,
  action,
}: EmptyStateProps) {
  const text = description ?? message ?? 'Nothing to display here.'
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

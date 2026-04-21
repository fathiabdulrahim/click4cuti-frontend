import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useNotificationStore } from '@/stores/notificationStore'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

const variantIcon = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
  warning: AlertTriangle,
} as const

const variantIconColor = {
  default: 'text-[#FE4E01]',
  success: 'text-emerald-600',
  destructive: 'text-red-600',
  warning: 'text-amber-600',
} as const

export function Toaster() {
  const { toasts, removeToast } = useNotificationStore()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant = 'default' }) => {
        const Icon = variantIcon[variant]
        const iconColor = variantIconColor[variant]

        return (
          <Toast key={id} variant={variant} onOpenChange={(open) => !open && removeToast(id)}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              variant === 'success' ? 'bg-emerald-100' :
              variant === 'destructive' ? 'bg-red-100' :
              variant === 'warning' ? 'bg-amber-100' :
              'bg-[#FE4E01]/10'
            }`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div className="grid gap-0.5 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

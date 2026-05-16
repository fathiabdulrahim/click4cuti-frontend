import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAppSettings, useUpdateAppSettings } from '@/hooks/useAppSettings'
import { useNotificationStore } from '@/stores/notificationStore'
import type { AppSettings } from '@/lib/types'

const TOGGLES: { key: keyof AppSettings; label: string; help: string }[] = [
  {
    key: 'notifications_enabled',
    label: 'Notifications',
    help: 'Receive email notifications for leave applications, approvals, and warnings.',
  },
  {
    key: 'clock_in_selfie_enabled',
    label: 'Clock-in selfie',
    help: 'Require a selfie photo when clocking in/out.',
  },
  {
    key: 'early_late_indicator_enabled',
    label: 'Early & late indicator',
    help: 'Show an indicator in the dashboard for early or late attendance.',
  },
  {
    key: 'attendance_confirmation_enabled',
    label: 'Attendance confirmation',
    help: 'Display a confirmation step before submitting attendance.',
  },
]

export default function PreferencesTab() {
  const { data, isLoading } = useAppSettings()
  const update = useUpdateAppSettings()
  const addToast = useNotificationStore((s) => s.addToast)

  if (isLoading || !data) return <LoadingSpinner className="py-12" />

  function setToggle(key: keyof AppSettings, value: boolean) {
    update.mutate(
      { [key]: value },
      {
        onSuccess: () => addToast({ title: 'Preference saved', variant: 'success' }),
        onError: () => addToast({ title: 'Error', variant: 'destructive' }),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">App Setting</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Personal preferences (saved instantly)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {TOGGLES.map((t) => (
          <div key={t.key} className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
            <div className="flex-1">
              <div className="font-medium">{t.label}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.help}</p>
            </div>
            <Switch
              checked={!!data[t.key]}
              onCheckedChange={(v) => setToggle(t.key, v)}
              disabled={update.isPending}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

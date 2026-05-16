import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { UserCombobox } from '@/components/shared/UserCombobox'
import {
  useUserSupervisors,
  useCreateSupervisor,
  useDeleteSupervisor,
} from '@/hooks/useSupervisors'
import { useNotificationStore } from '@/stores/notificationStore'
import type { SupervisorCategory, UserSupervisor } from '@/lib/types'

const CATEGORIES: { value: SupervisorCategory; label: string }[] = [
  { value: 'LEAVE', label: 'Leave' },
  { value: 'CLAIM', label: 'Claim' },
  { value: 'OVERTIME', label: 'Overtime' },
  { value: 'TIMEOFF', label: 'Time-off' },
]

export default function ApprovalMatrixTab({ userId }: { userId: string }) {
  const { data: assignments = [], isLoading } = useUserSupervisors(userId)
  const create = useCreateSupervisor(userId)
  const remove = useDeleteSupervisor(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  // Build lookup: category x level -> assignment
  const map = new Map<string, UserSupervisor>()
  for (const a of assignments) {
    map.set(`${a.category.toUpperCase()}|${a.level}`, a)
  }

  function setSupervisor(category: SupervisorCategory, level: 1 | 2, newId: string | null) {
    const existing = map.get(`${category}|${level}`)
    const after = () => addToast({ title: 'Approval updated', variant: 'success' })

    if (!newId && existing) {
      remove.mutate(existing.id, { onSuccess: after })
      return
    }
    if (newId) {
      if (existing) {
        // Replace: delete then create
        remove.mutate(existing.id, {
          onSuccess: () => {
            create.mutate({ supervisor_id: newId, category, level }, { onSuccess: after })
          },
        })
      } else {
        create.mutate({ supervisor_id: newId, category, level }, { onSuccess: after })
      }
    }
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Approval Hierarchy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure first &amp; second level approvers per category. Changes affect pending applications.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 items-center">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            First Level
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Second Level
          </div>

          {CATEGORIES.map((cat) => {
            const l1 = map.get(`${cat.value}|1`)
            const l2 = map.get(`${cat.value}|2`)
            return (
              <div key={cat.value} className="contents">
                <div className="text-sm font-medium">{cat.label}</div>
                <UserCombobox
                  admin
                  excludeIds={[userId]}
                  value={l1?.supervisor_id ?? null}
                  onChange={(id) => setSupervisor(cat.value, 1, id)}
                  placeholder="Select level 1 approver"
                />
                <UserCombobox
                  admin
                  excludeIds={[userId, ...(l1 ? [l1.supervisor_id] : [])]}
                  value={l2?.supervisor_id ?? null}
                  onChange={(id) => setSupervisor(cat.value, 2, id)}
                  placeholder="Select level 2 approver"
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

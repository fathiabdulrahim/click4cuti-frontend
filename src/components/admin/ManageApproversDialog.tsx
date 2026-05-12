import { useEffect, useMemo, useState } from 'react'
import { useAdminUser, useUpdateUser } from '@/hooks/useAdmin'
import { useNotificationStore } from '@/stores/notificationStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Search, Loader2 } from 'lucide-react'
import type { User } from '@/lib/types'

interface Props {
  user: User
  candidates: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageApproversDialog({ user, candidates, open, onOpenChange }: Props) {
  const { data: detail, isLoading } = useAdminUser(open ? user.id : '')
  const updateUser = useUpdateUser()
  const addToast = useNotificationStore((s) => s.addToast)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (detail?.leave_approver_ids) setSelected(new Set(detail.leave_approver_ids))
  }, [detail?.leave_approver_ids])

  const eligible = useMemo(
    () =>
      candidates
        .filter((c) => c.id !== user.id && c.is_active)
        .filter((c) => c.full_name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())),
    [candidates, user.id, query]
  )

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = () => {
    updateUser
      .mutateAsync({ id: user.id, leave_approver_ids: Array.from(selected) })
      .then(() => {
        addToast({ title: 'Approvers updated', variant: 'success' })
        onOpenChange(false)
      })
      .catch(() => addToast({ title: 'Failed to update approvers', variant: 'destructive' }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Approvers</DialogTitle>
          <DialogDescription>
            Select who can approve <strong>{user.full_name}</strong>'s leave requests. If none are
            selected, the system falls back to their reporting manager.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-64 overflow-y-auto rounded-md border">
              {eligible.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No eligible candidates
                </p>
              ) : (
                <ul className="divide-y">
                  {eligible.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggle(c.id)}
                          className="h-4 w-4 accent-[#FE4E01] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{c.full_name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {c.email} · {c.role}
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs text-muted-foreground">{selected.size} selected</p>
          </>
        )}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateUser.isPending || isLoading}
            className="cursor-pointer"
          >
            {updateUser.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

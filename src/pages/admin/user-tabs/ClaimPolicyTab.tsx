import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useUserClaimPolicies,
  useUpdateUserClaimPolicy,
} from '@/hooks/useClaims'
import { useNotificationStore } from '@/stores/notificationStore'
import type { UserClaimPolicy } from '@/lib/types'

export default function ClaimPolicyTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useUserClaimPolicies(userId)
  const update = useUpdateUserClaimPolicy(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const [edits, setEdits] = useState<Record<string, Partial<UserClaimPolicy>>>({})

  function patch(id: string, change: Partial<UserClaimPolicy>) {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...change } }))
  }

  function save(row: UserClaimPolicy) {
    const e = edits[row.id]
    if (!e) return
    update.mutate(
      {
        id: row.id,
        payload: {
          application_limit: e.application_limit ?? row.application_limit,
          annual_limit: e.annual_limit ?? row.annual_limit,
          is_unlimited_application: e.is_unlimited_application ?? row.is_unlimited_application,
          is_unlimited_annual: e.is_unlimited_annual ?? row.is_unlimited_annual,
          is_included: e.is_included ?? row.is_included,
        },
      },
      {
        onSuccess: () => {
          addToast({ title: 'Policy updated', variant: 'success' })
          setEdits((prev) => {
            const next = { ...prev }
            delete next[row.id]
            return next
          })
        },
      },
    )
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Claim Policy</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Per-user limits for each claim type. Toggle Included to opt this user in/out.
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No claim types configured" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Per claim (RM)</TableHead>
                <TableHead>Unlimited?</TableHead>
                <TableHead>Annual (RM)</TableHead>
                <TableHead>Unlimited?</TableHead>
                <TableHead>Included</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => {
                const e = edits[row.id] ?? {}
                const dirty = Object.keys(e).length > 0
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.claim_type?.name ?? '—'}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={e.application_limit ?? row.application_limit ?? ''}
                        onChange={(ev) =>
                          patch(row.id, {
                            application_limit:
                              ev.target.value === '' ? null : Number(ev.target.value),
                          })
                        }
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={e.is_unlimited_application ?? row.is_unlimited_application}
                        onCheckedChange={(v) =>
                          patch(row.id, { is_unlimited_application: v })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={e.annual_limit ?? row.annual_limit ?? ''}
                        onChange={(ev) =>
                          patch(row.id, {
                            annual_limit:
                              ev.target.value === '' ? null : Number(ev.target.value),
                          })
                        }
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={e.is_unlimited_annual ?? row.is_unlimited_annual}
                        onCheckedChange={(v) => patch(row.id, { is_unlimited_annual: v })}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={e.is_included ?? row.is_included}
                        onCheckedChange={(v) => patch(row.id, { is_included: v })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={dirty ? 'default' : 'ghost'}
                        disabled={!dirty || update.isPending}
                        onClick={() => save(row)}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

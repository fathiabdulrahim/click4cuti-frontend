import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CrudListPage } from '@/components/shared/CrudListPage'
import { EnumSelect } from '@/components/shared/EnumSelect'
import {
  useUserClaimApplications,
  useCreateClaimApplication,
  useUpdateClaimApplication,
  useDeleteClaimApplication,
  useClaimTypes,
} from '@/hooks/useClaims'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import type { ClaimApplication, ClaimStatus } from '@/lib/types'

const schema = z.object({
  claim_type_id: z.string().min(1, 'Required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  claim_date: z.string().min(1, 'Required'),
  reason: z.string().min(1, 'Required'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  reviewer_remarks: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function ClaimHistoryTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useUserClaimApplications(userId)
  const { data: types = [] } = useClaimTypes()
  const create = useCreateClaimApplication(userId)
  const update = useUpdateClaimApplication(userId)
  const remove = useDeleteClaimApplication(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ClaimApplication | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { status: 'PENDING' } })

  useEffect(() => {
    if (open) {
      reset({
        claim_type_id: editing?.claim_type_id ?? '',
        amount: editing?.amount ?? 0,
        claim_date: editing?.claim_date ?? new Date().toISOString().slice(0, 10),
        reason: editing?.reason ?? '',
        status: upperEnum<ClaimStatus>(editing?.status) ?? 'PENDING',
        reviewer_remarks: editing?.reviewer_remarks ?? '',
      })
    }
  }, [editing, open, reset])

  function onSubmit(values: FormValues) {
    const payload = { ...values, reviewer_remarks: values.reviewer_remarks || null }
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: after })
    } else {
      create.mutate(payload, { onSuccess: after })
    }
  }

  const typeOptions = Object.fromEntries(types.map((t) => [t.id, t.name])) as Record<string, string>

  return (
    <>
      <CrudListPage<ClaimApplication>
        title="Claim History"
        description="Manually recorded claim applications. No approval workflow in this build."
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'date', header: 'Date', render: (r) => formatDate(r.claim_date) },
          { key: 'type', header: 'Type', render: (r) => r.claim_type?.name ?? '—' },
          {
            key: 'amount',
            header: 'Amount',
            render: (r) => `RM ${Number(r.amount).toFixed(2)}`,
          },
          { key: 'reason', header: 'Reason', render: (r) => r.reason },
          {
            key: 'status',
            header: 'Status',
            render: (r) => {
              const s = upperEnum<ClaimStatus>(r.status) ?? 'PENDING'
              return <Badge variant={s === 'APPROVED' ? 'default' : 'secondary'}>{ENUM_LABELS.claim_status[s]}</Badge>
            },
          },
        ]}
        onCreate={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={(row) => {
          if (confirm('Delete this claim record?')) remove.mutate(row.id)
        }}
        emptyMessage="No claim records yet"
      />
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit claim' : 'Add claim record'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Claim Type</Label>
              <EnumSelect
                options={typeOptions}
                value={watch('claim_type_id') || null}
                onChange={(v) => setValue('claim_type_id', v ?? '')}
              />
              {errors.claim_type_id && <p className="text-xs text-destructive">{errors.claim_type_id.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Amount (RM)</Label>
                <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
                {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Claim Date</Label>
                <Input type="date" {...register('claim_date')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Reason</Label>
              <Textarea rows={2} {...register('reason')} />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <EnumSelect
                options={ENUM_LABELS.claim_status}
                value={watch('status') ?? null}
                onChange={(v) => setValue('status', (v as ClaimStatus) ?? 'PENDING')}
              />
            </div>
            <div className="space-y-1">
              <Label>Reviewer Remarks</Label>
              <Textarea rows={2} {...register('reviewer_remarks')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {create.isPending || update.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

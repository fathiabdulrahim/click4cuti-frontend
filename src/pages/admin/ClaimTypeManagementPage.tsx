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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { CrudListPage } from '@/components/shared/CrudListPage'
import {
  useClaimTypes,
  useCreateClaimType,
  useUpdateClaimType,
  useDeleteClaimType,
} from '@/hooks/useClaims'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ClaimType } from '@/lib/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  default_application_limit: z.coerce.number().nonnegative().nullable().optional(),
  default_annual_limit: z.coerce.number().nonnegative().nullable().optional(),
  requires_document: z.boolean(),
})
type FormValues = z.infer<typeof schema>

export default function ClaimTypeManagementPage() {
  const { data, isLoading } = useClaimTypes()
  const create = useCreateClaimType()
  const update = useUpdateClaimType()
  const remove = useDeleteClaimType()
  const addToast = useNotificationStore((s) => s.addToast)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ClaimType | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { requires_document: false } })

  useEffect(() => {
    reset({
      name: editing?.name ?? '',
      code: editing?.code ?? '',
      description: editing?.description ?? '',
      default_application_limit: editing?.default_application_limit ?? null,
      default_annual_limit: editing?.default_annual_limit ?? null,
      requires_document: !!editing?.requires_document,
    })
  }, [editing, open, reset])

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      code: values.code || null,
      description: values.description || null,
    }
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

  return (
    <div>
      <PageHeader title="Claim Types" description="Company-wide catalog of claim categories" />
      <CrudListPage<ClaimType>
        title="All claim types"
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'name', header: 'Name', render: (r) => r.name },
          {
            key: 'app-limit',
            header: 'Per claim',
            render: (r) =>
              r.default_application_limit != null ? `RM ${r.default_application_limit}` : '—',
          },
          {
            key: 'ann-limit',
            header: 'Per year',
            render: (r) =>
              r.default_annual_limit != null ? `RM ${r.default_annual_limit}` : '—',
          },
          {
            key: 'doc',
            header: 'Requires doc',
            render: (r) => (r.requires_document ? <Badge>Yes</Badge> : '—'),
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge variant={r.is_active ? 'default' : 'secondary'}>
                {r.is_active ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
        ]}
        onCreate={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={(row) => {
          if (confirm(`Deactivate "${row.name}"?`)) remove.mutate(row.id)
        }}
        emptyMessage="No claim types yet"
      />
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit claim type' : 'Add claim type'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Code</Label>
              <Input {...register('code')} placeholder="MEAL, TOLL, …" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={2} {...register('description')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Default per-claim limit (RM)</Label>
                <Input type="number" step="0.01" {...register('default_application_limit', { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label>Default annual limit (RM)</Label>
                <Input type="number" step="0.01" {...register('default_annual_limit', { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={!!watch('requires_document')}
                onCheckedChange={(v) => setValue('requires_document', v)}
              />
              <Label>Requires supporting document</Label>
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
    </div>
  )
}

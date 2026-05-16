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
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { CrudListPage } from '@/components/shared/CrudListPage'
import {
  useBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from '@/hooks/useBranches'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Branch } from '@/lib/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function BranchManagementPage() {
  const { data, isLoading } = useBranches()
  const create = useCreateBranch()
  const update = useUpdateBranch()
  const remove = useDeleteBranch()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({
      name: editing?.name ?? '',
      address: editing?.address ?? '',
      state: editing?.state ?? '',
    })
  }, [editing, dialogOpen, reset])

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      address: values.address || null,
      state: values.state || null,
    }
    const after = () => {
      addToast({ title: editing ? 'Branch updated' : 'Branch added', variant: 'success' })
      setDialogOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: after })
    } else {
      create.mutate(payload, { onSuccess: after })
    }
  }

  function handleDelete(row: Branch) {
    if (!confirm(`Deactivate "${row.name}"?`)) return
    remove.mutate(row.id, {
      onSuccess: () => addToast({ title: 'Deactivated', variant: 'success' }),
    })
  }

  return (
    <div>
      <PageHeader title="Branches" description="Manage company branch locations" />
      <CrudListPage<Branch>
        title="All branches"
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'name', header: 'Name', render: (r) => r.name },
          { key: 'state', header: 'State', render: (r) => r.state ?? '—' },
          { key: 'address', header: 'Address', render: (r) => r.address ?? '—' },
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
        onCreate={() => {
          setEditing(null)
          setDialogOpen(true)
        }}
        onEdit={(row) => {
          setEditing(row)
          setDialogOpen(true)
        }}
        onDelete={handleDelete}
        emptyMessage="No branches yet"
      />
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit branch' : 'Add branch'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <Input {...register('state')} />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input {...register('address')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
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

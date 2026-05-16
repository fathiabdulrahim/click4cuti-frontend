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
import { FileUploadField } from '@/components/shared/FileUploadField'
import {
  useEquipmentAssignments,
  useCreateEquipmentAssignment,
  useUpdateEquipmentAssignment,
  useDeleteEquipmentAssignment,
} from '@/hooks/useEquipmentAssignments'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import type { EquipmentAssignment } from '@/lib/types'

const schema = z.object({
  equipment_type: z.string().min(1, 'Required'),
  equipment_details: z.string().min(1, 'Required'),
  date_received: z.string().min(1, 'Required'),
  date_return: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function EquipmentTab() {
  const { data, isLoading } = useEquipmentAssignments()
  const create = useCreateEquipmentAssignment()
  const update = useUpdateEquipmentAssignment()
  const remove = useDeleteEquipmentAssignment()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EquipmentAssignment | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (dialogOpen) {
      reset({
        equipment_type: editing?.equipment_type ?? '',
        equipment_details: editing?.equipment_details ?? '',
        date_received: editing?.date_received ?? '',
        date_return: editing?.date_return ?? '',
      })
      setFile(null)
    }
  }, [editing, dialogOpen, reset])

  function onSubmit(values: FormValues) {
    const payload = { ...values, date_return: values.date_return || null }
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setDialogOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload, file }, { onSuccess: after })
    } else {
      create.mutate({ payload, file }, { onSuccess: after })
    }
  }

  return (
    <>
      <CrudListPage<EquipmentAssignment>
        title="Assets"
        description="Equipment issued to you"
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'type', header: 'Type', render: (r) => r.equipment_type },
          { key: 'details', header: 'Details', render: (r) => r.equipment_details },
          { key: 'received', header: 'Received', render: (r) => formatDate(r.date_received) },
          {
            key: 'status',
            header: 'Status',
            render: (r) =>
              r.is_returned ? (
                <Badge variant="secondary">Returned {formatDate(r.date_return)}</Badge>
              ) : (
                <Badge variant="default">Outstanding</Badge>
              ),
          },
        ]}
        onCreate={() => { setEditing(null); setDialogOpen(true) }}
        onEdit={(row) => { setEditing(row); setDialogOpen(true) }}
        onDelete={(row) => {
          if (confirm(`Delete "${row.equipment_type}"?`)) {
            remove.mutate(row.id, { onSuccess: () => addToast({ title: 'Removed', variant: 'success' }) })
          }
        }}
        emptyMessage="No assets assigned yet"
      />
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit asset' : 'Assign asset'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Equipment Type</Label>
              <Input {...register('equipment_type')} placeholder="Laptop, Monitor, Access Card…" />
              {errors.equipment_type && <p className="text-xs text-destructive">{errors.equipment_type.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Details</Label>
              <Textarea rows={2} {...register('equipment_details')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Date Received</Label>
                <Input type="date" {...register('date_received')} />
              </div>
              <div className="space-y-1">
                <Label>Date Returned</Label>
                <Input type="date" {...register('date_return')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Supporting Document</Label>
              <FileUploadField
                value={file}
                onChange={setFile}
                existingFileUrl={editing?.supporting_document_url ?? null}
              />
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
    </>
  )
}

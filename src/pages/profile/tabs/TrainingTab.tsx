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
  useTrainings,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
} from '@/hooks/useTrainings'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import type { Training } from '@/lib/types'

const schema = z.object({
  title: z.string().min(1, 'Required'),
  start_date: z.string().min(1, 'Required'),
  end_date: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  received_date: z.string().min(1, 'Required'),
  expired_date: z.string().min(1, 'Required'),
})
type FormValues = z.infer<typeof schema>

export default function TrainingTab() {
  const { data, isLoading } = useTrainings()
  const create = useCreateTraining()
  const update = useUpdateTraining()
  const remove = useDeleteTraining()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Training | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (dialogOpen) {
      reset({
        title: editing?.title ?? '',
        start_date: editing?.start_date ?? '',
        end_date: editing?.end_date ?? '',
        description: editing?.description ?? '',
        received_date: editing?.received_date ?? '',
        expired_date: editing?.expired_date ?? '',
      })
      setFile(null)
    }
  }, [editing, dialogOpen, reset])

  function onSubmit(values: FormValues) {
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setDialogOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload: values, file }, { onSuccess: after })
    } else {
      create.mutate({ payload: values, file }, { onSuccess: after })
    }
  }

  return (
    <>
      <CrudListPage<Training>
        title="Training & Certificate"
        description="Training events and certifications"
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'title', header: 'Title', render: (r) => r.title },
          { key: 'period', header: 'Period', render: (r) => `${formatDate(r.start_date)} – ${formatDate(r.end_date)}` },
          { key: 'expired', header: 'Expiry', render: (r) => formatDate(r.expired_date) },
          {
            key: 'status',
            header: 'Status',
            render: (r) =>
              r.is_expired ? (
                <Badge variant="destructive">Expired</Badge>
              ) : (
                <Badge variant="default">Active</Badge>
              ),
          },
          {
            key: 'cert',
            header: 'Cert',
            render: (r) =>
              r.certification_url ? (
                <a href={r.certification_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  View
                </a>
              ) : (
                '—'
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
        onDelete={(row) => {
          if (confirm(`Delete "${row.title}"?`)) {
            remove.mutate(row.id, { onSuccess: () => addToast({ title: 'Removed', variant: 'success' }) })
          }
        }}
        emptyMessage="No training records yet"
      />
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit training' : 'Add training'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date</Label>
                <Input type="date" {...register('start_date')} />
              </div>
              <div className="space-y-1">
                <Label>End Date</Label>
                <Input type="date" {...register('end_date')} />
              </div>
              <div className="space-y-1">
                <Label>Received Date</Label>
                <Input type="date" {...register('received_date')} />
              </div>
              <div className="space-y-1">
                <Label>Expired Date</Label>
                <Input type="date" {...register('expired_date')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={2} {...register('description')} />
            </div>
            <div className="space-y-1">
              <Label>Certification</Label>
              <FileUploadField
                value={file}
                onChange={setFile}
                existingFileUrl={editing?.certification_url ?? null}
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

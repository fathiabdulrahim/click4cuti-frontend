import { useState } from 'react'
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
  useAdminWarningLettersForUser,
  useCreateWarningLetter,
} from '@/hooks/useAdminWarningLetters'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import type { WarningLetter } from '@/lib/types'

const schema = z.object({
  reason: z.string().min(1, 'Required'),
  details: z.string().optional().or(z.literal('')),
  action_taken: z.string().optional().or(z.literal('')),
  issued_date: z.string().min(1, 'Required'),
})
type FormValues = z.infer<typeof schema>

export default function ConductRecordTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminWarningLettersForUser(userId)
  const create = useCreateWarningLetter()
  const addToast = useNotificationStore((s) => s.addToast)

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { issued_date: new Date().toISOString().slice(0, 10) },
  })

  function onSubmit(values: FormValues) {
    create.mutate(
      {
        payload: {
          user_id: userId,
          reason: values.reason,
          details: values.details || null,
          action_taken: values.action_taken || null,
          issued_date: values.issued_date,
        },
        file,
      },
      {
        onSuccess: () => {
          addToast({ title: 'Conduct record added', variant: 'success' })
          setOpen(false)
          reset({ issued_date: new Date().toISOString().slice(0, 10), reason: '', details: '', action_taken: '' })
          setFile(null)
        },
      },
    )
  }

  return (
    <>
      <CrudListPage<WarningLetter>
        title="Conduct Record"
        description="Auto-generated + manually issued conduct entries"
        data={data}
        isLoading={isLoading}
        columns={[
          {
            key: 'source',
            header: 'Source',
            render: (r) => (
              <Badge variant={String(r.source).toUpperCase() === 'AUTO' ? 'secondary' : 'default'}>
                {String(r.source).toUpperCase()}
              </Badge>
            ),
          },
          { key: 'reason', header: 'Issue', render: (r) => r.reason },
          { key: 'issued', header: 'Issued', render: (r) => formatDate(r.issued_date) },
          {
            key: 'ack',
            header: 'Acknowledged',
            render: (r) => (r.acknowledged ? formatDate(r.acknowledged_at) : '—'),
          },
        ]}
        onCreate={() => {
          reset({ issued_date: new Date().toISOString().slice(0, 10), reason: '', details: '', action_taken: '' })
          setFile(null)
          setOpen(true)
        }}
        emptyMessage="No conduct records yet"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add manual conduct record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Label>Issue</Label>
              <Input {...register('reason')} />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Details</Label>
              <Textarea rows={3} {...register('details')} />
            </div>
            <div className="space-y-1">
              <Label>Action Taken</Label>
              <Textarea rows={2} {...register('action_taken')} />
            </div>
            <div className="space-y-1">
              <Label>Date Issued</Label>
              <Input type="date" {...register('issued_date')} />
            </div>
            <div className="space-y-1">
              <Label>Supporting Document</Label>
              <FileUploadField value={file} onChange={setFile} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

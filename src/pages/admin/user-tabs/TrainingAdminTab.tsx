import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { SectionCard } from '@/components/shared/SectionCard'
import { FileUploadField } from '@/components/shared/FileUploadField'
import {
  useAdminTrainings,
  useAdminCreateTraining,
  useAdminUpdateTraining,
  useAdminDeleteTraining,
} from '@/hooks/useAdminTrainings'
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

export default function TrainingAdminTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminTrainings(userId)
  const create = useAdminCreateTraining(userId)
  const update = useAdminUpdateTraining(userId)
  const remove = useAdminDeleteTraining(userId)
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
      <SectionCard
        title="Training & Certificate"
        description="Training events and certifications"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add training
          </Button>
        }
        flush
      >
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No training records yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-6">Title</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cert</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-medium">{r.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(r.start_date)} – {formatDate(r.end_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.expired_date)}</TableCell>
                  <TableCell>
                    {r.is_expired ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.certification_url ? (
                      <a href={r.certification_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setDialogOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete "${r.title}"?`)) {
                          remove.mutate(r.id, { onSuccess: () => addToast({ title: 'Removed', variant: 'success' }) })
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
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
              <div className="space-y-1"><Label>Start Date</Label><Input type="date" {...register('start_date')} /></div>
              <div className="space-y-1"><Label>End Date</Label><Input type="date" {...register('end_date')} /></div>
              <div className="space-y-1"><Label>Received Date</Label><Input type="date" {...register('received_date')} /></div>
              <div className="space-y-1"><Label>Expired Date</Label><Input type="date" {...register('expired_date')} /></div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={2} {...register('description')} />
            </div>
            <div className="space-y-1">
              <Label>Certification</Label>
              <FileUploadField value={file} onChange={setFile} existingFileUrl={editing?.certification_url ?? null} />
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

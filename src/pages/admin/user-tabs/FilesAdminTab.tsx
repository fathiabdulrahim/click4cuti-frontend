import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  useAdminUserDocuments,
  useAdminCreateUserDocument,
  useAdminUpdateUserDocument,
  useAdminDeleteUserDocument,
} from '@/hooks/useAdminUserDocuments'
import { useNotificationStore } from '@/stores/notificationStore'
import type { UserDocument } from '@/lib/types'

const schema = z.object({ remarks: z.string().min(1, 'Required') })
type FormValues = z.infer<typeof schema>

export default function FilesAdminTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminUserDocuments(userId)
  const create = useAdminCreateUserDocument(userId)
  const update = useAdminUpdateUserDocument(userId)
  const remove = useAdminDeleteUserDocument(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<UserDocument | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (dialogOpen) {
      reset({ remarks: editing?.remarks ?? '' })
      setFile(null)
    }
  }, [editing, dialogOpen, reset])

  function onSubmit(values: FormValues) {
    if (!editing && !file) {
      addToast({ title: 'Please select a file', variant: 'destructive' })
      return
    }
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setDialogOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate(
        { id: editing.id, remarks: values.remarks, file: file ?? undefined },
        { onSuccess: after },
      )
    } else {
      create.mutate({ remarks: values.remarks, file: file! }, { onSuccess: after })
    }
  }

  return (
    <>
      <SectionCard
        title="Files"
        description="Personal documents and certificates"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Upload file
          </Button>
        }
        flush
      >
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No files uploaded yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-6">File</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    {r.file_url ? (
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        {r.file_name ?? 'Download'}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{r.remarks}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setDialogOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Remove this file?')) {
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit file' : 'Upload file'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Remarks</Label>
              <Textarea rows={2} {...register('remarks')} />
              {errors.remarks && <p className="text-xs text-destructive">{errors.remarks.message}</p>}
            </div>
            <FileUploadField
              value={file}
              onChange={setFile}
              existingFileUrl={editing?.file_url ?? null}
              existingFileName={editing?.file_name ?? null}
            />
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

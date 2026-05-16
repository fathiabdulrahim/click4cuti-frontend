import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CrudListPage } from '@/components/shared/CrudListPage'
import { FileUploadField } from '@/components/shared/FileUploadField'
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
  useUserDocuments,
  useCreateUserDocument,
  useDeleteUserDocument,
  useUpdateUserDocument,
} from '@/hooks/useUserDocuments'
import { useNotificationStore } from '@/stores/notificationStore'
import type { UserDocument } from '@/lib/types'

const schema = z.object({ remarks: z.string().min(1, 'Required') })
type FormValues = z.infer<typeof schema>

export default function FilesTab() {
  const { data, isLoading } = useUserDocuments()
  const create = useCreateUserDocument()
  const update = useUpdateUserDocument()
  const remove = useDeleteUserDocument()
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
      <CrudListPage<UserDocument>
        title="Files"
        description="Upload personal documents and certificates"
        data={data}
        isLoading={isLoading}
        columns={[
          {
            key: 'file',
            header: 'File',
            render: (r) =>
              r.file_url ? (
                <a href={r.file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {r.file_name ?? 'Download'}
                </a>
              ) : (
                '—'
              ),
          },
          { key: 'remarks', header: 'Remarks', render: (r) => r.remarks },
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
          if (confirm('Remove this file?')) {
            remove.mutate(row.id, {
              onSuccess: () => addToast({ title: 'Removed', variant: 'success' }),
            })
          }
        }}
        emptyMessage="No files yet"
      />
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit file' : 'Add file'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Remarks</Label>
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

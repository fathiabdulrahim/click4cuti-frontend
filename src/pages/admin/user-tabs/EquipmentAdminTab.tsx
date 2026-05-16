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
  useAdminEquipmentAssignments,
  useAdminCreateEquipmentAssignment,
  useAdminUpdateEquipmentAssignment,
  useAdminDeleteEquipmentAssignment,
} from '@/hooks/useAdminEquipmentAssignments'
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

export default function EquipmentAdminTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminEquipmentAssignments(userId)
  const create = useAdminCreateEquipmentAssignment(userId)
  const update = useAdminUpdateEquipmentAssignment(userId)
  const remove = useAdminDeleteEquipmentAssignment(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<EquipmentAssignment | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      reset({
        equipment_type: editing?.equipment_type ?? '',
        equipment_details: editing?.equipment_details ?? '',
        date_received: editing?.date_received ?? '',
        date_return: editing?.date_return ?? '',
      })
      setFile(null)
    }
  }, [editing, open, reset])

  function onSubmit(values: FormValues) {
    const payload = { ...values, date_return: values.date_return || null }
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setOpen(false)
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
      <SectionCard
        title="Assets"
        description="Equipment issued to the employee"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Assign asset
          </Button>
        }
        flush
      >
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No assets assigned yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-6">Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-medium">{r.equipment_type}</TableCell>
                  <TableCell>{r.equipment_details}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.date_received)}</TableCell>
                  <TableCell>
                    {r.is_returned ? (
                      <Badge variant="secondary">Returned {formatDate(r.date_return)}</Badge>
                    ) : (
                      <Badge variant="default" className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-50">
                        Outstanding
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete "${r.equipment_type}"?`)) {
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
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}>
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
              <div className="space-y-1"><Label>Date Received</Label><Input type="date" {...register('date_received')} /></div>
              <div className="space-y-1"><Label>Date Returned</Label><Input type="date" {...register('date_return')} /></div>
            </div>
            <div className="space-y-1">
              <Label>Supporting Document</Label>
              <FileUploadField value={file} onChange={setFile} existingFileUrl={editing?.supporting_document_url ?? null} />
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

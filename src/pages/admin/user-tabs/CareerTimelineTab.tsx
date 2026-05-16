import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { UserCombobox } from '@/components/shared/UserCombobox'
import {
  useCareerProgresses,
  useCreateCareerProgress,
  useDeleteCareerProgress,
} from '@/hooks/useCareerProgresses'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'

const schema = z.object({
  job_title: z.string().min(1, 'Required'),
  effective_date: z.string().min(1, 'Required'),
  manager_id: z.string().nullable().optional(),
  job_type: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function CareerTimelineTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useCareerProgresses(userId)
  const create = useCreateCareerProgress(userId)
  const remove = useDeleteCareerProgress(userId)
  const addToast = useNotificationStore((s) => s.addToast)
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  function handleAdd(values: FormValues) {
    create.mutate(values, {
      onSuccess: () => {
        addToast({ title: 'Career entry added', variant: 'success' })
        setOpen(false)
        reset()
      },
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Career Timeline</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Job title, department & manager changes</p>
        </div>
        <Button size="sm" onClick={() => { reset(); setOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No career history yet" />
        ) : (
          <ol className="relative border-l border-muted-foreground/20 ml-4 space-y-6">
            {data.map((cp) => (
              <li key={cp.id} className="ml-6 relative">
                <div className="absolute -left-7 top-2 h-3 w-3 rounded-full bg-primary" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{cp.job_title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Effective {formatDate(cp.effective_date)}
                      {cp.job_type ? ` · ${cp.job_type}` : ''}
                    </p>
                    {cp.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{cp.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Delete "${cp.job_title}"?`)) remove.mutate(cp.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add career progress</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAdd)} className="space-y-3">
            <div className="space-y-1">
              <Label>Job Title</Label>
              <Input {...register('job_title')} />
              {errors.job_title && <p className="text-xs text-destructive">{errors.job_title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Effective Date</Label>
              <Input type="date" {...register('effective_date')} />
            </div>
            <div className="space-y-1">
              <Label>Manager</Label>
              <UserCombobox
                admin
                value={watch('manager_id') ?? null}
                onChange={(id) => setValue('manager_id', id)}
                excludeIds={[userId]}
              />
            </div>
            <div className="space-y-1">
              <Label>Job Type</Label>
              <Input {...register('job_type')} placeholder="PERMANENT, CONTRACT, …" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={3} {...register('description')} />
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
    </Card>
  )
}

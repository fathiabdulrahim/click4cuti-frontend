import { useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateWorkSchedule, useUpdateWorkSchedule } from '@/hooks/useAdmin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/stores/notificationStore'
import { Clock, Pencil, Loader2 } from 'lucide-react'
import { EmptyTab } from './shared'
import type { WorkSchedule } from '@/lib/types'

const workScheduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_time: z.string().min(1, 'Required'),
  end_time: z.string().min(1, 'Required'),
  break_start: z.string().optional(),
  break_end: z.string().optional(),
  rest_days: z.string().optional(),
})
type WorkScheduleFormValues = z.infer<typeof workScheduleSchema>

export interface WorkSchedulesTabHandle {
  openCreate: () => void
}

interface WorkSchedulesTabProps {
  companyId: string
  companyName: string
  workSchedules: WorkSchedule[]
  search: string
}

export const WorkSchedulesTab = forwardRef<WorkSchedulesTabHandle, WorkSchedulesTabProps>(
  function WorkSchedulesTab({ companyId, companyName, workSchedules, search }, ref) {
    const createWorkSchedule = useCreateWorkSchedule()
    const updateWorkSchedule = useUpdateWorkSchedule()
    const addToast = useNotificationStore((s) => s.addToast)

    const [schedOpen, setSchedOpen] = useState(false)
    const [editingSched, setEditingSched] = useState<WorkSchedule | null>(null)
    const schedForm = useForm<WorkScheduleFormValues>({ resolver: zodResolver(workScheduleSchema) })

    const q = search.toLowerCase()
    const filtered = workSchedules.filter((ws) => ws.name.toLowerCase().includes(q))
    const schedPending = createWorkSchedule.isPending || updateWorkSchedule.isPending

    useImperativeHandle(ref, () => ({
      openCreate() {
        setEditingSched(null)
        schedForm.reset({ name: '', start_time: '', end_time: '', break_start: '', break_end: '', rest_days: '' })
        setSchedOpen(true)
      },
    }))

    const openEditSched = (sched: WorkSchedule) => {
      setEditingSched(sched)
      schedForm.reset({
        name: sched.name,
        start_time: sched.start_time,
        end_time: sched.end_time,
        break_start: sched.break_start ?? '',
        break_end: sched.break_end ?? '',
        rest_days: sched.rest_days ?? '',
      })
      setSchedOpen(true)
    }

    const onSchedSubmit = (data: WorkScheduleFormValues) => {
      const mutation = editingSched
        ? updateWorkSchedule.mutateAsync({ id: editingSched.id, ...data })
        : createWorkSchedule.mutateAsync({ ...data, company_id: companyId })
      mutation
        .then(() => { addToast({ title: editingSched ? 'Schedule updated' : 'Schedule created', variant: 'success' }); setSchedOpen(false) })
        .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
    }

    return (
      <>
        {workSchedules.length === 0 ? (
          <EmptyTab icon={Clock} message="No work schedules yet" sub="Define working hours for employees" />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4">Schedule</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Break</TableHead>
                  <TableHead>Rest Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sched) => (
                  <TableRow key={sched.id} className="group">
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium">{sched.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sched.start_time} - {sched.end_time}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sched.break_start && sched.break_end
                        ? `${sched.break_start} - ${sched.break_end}`
                        : '\u2014'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sched.rest_days || '\u2014'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sched.is_active ? 'success' : 'secondary'}>
                        {sched.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditSched(sched)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Work Schedule Dialog */}
        <Dialog open={schedOpen} onOpenChange={setSchedOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSched ? 'Edit Work Schedule' : 'New Work Schedule'}</DialogTitle>
              <DialogDescription>
                {editingSched ? 'Update the schedule details.' : `Create a work schedule for ${companyName}.`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={schedForm.handleSubmit(onSchedSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sched-name">Schedule Name</Label>
                <Input id="sched-name" placeholder="e.g. Standard Office Hours" {...schedForm.register('name')} />
                {schedForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{schedForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sched-start">Start Time</Label>
                  <Input id="sched-start" type="time" {...schedForm.register('start_time')} />
                  {schedForm.formState.errors.start_time && (
                    <p className="text-xs text-destructive">{schedForm.formState.errors.start_time.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sched-end">End Time</Label>
                  <Input id="sched-end" type="time" {...schedForm.register('end_time')} />
                  {schedForm.formState.errors.end_time && (
                    <p className="text-xs text-destructive">{schedForm.formState.errors.end_time.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sched-bstart">Break Start</Label>
                  <Input id="sched-bstart" type="time" {...schedForm.register('break_start')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sched-bend">Break End</Label>
                  <Input id="sched-bend" type="time" {...schedForm.register('break_end')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sched-rest">Rest Days</Label>
                <Input id="sched-rest" placeholder="e.g. Saturday, Sunday" {...schedForm.register('rest_days')} />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setSchedOpen(false)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={schedPending} className="cursor-pointer">
                  {schedPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingSched ? 'Save Changes' : 'Create Schedule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

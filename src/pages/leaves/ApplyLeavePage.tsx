import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplyLeave } from '@/hooks/useLeaves'
import { useLeaveBalances } from '@/hooks/useLeaveBalances'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useNotificationStore } from '@/stores/notificationStore'

const schema = z.object({
  leave_type_id: z.string().min(1, 'Please select a leave type'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  extended_reason: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ApplyLeavePage() {
  const navigate = useNavigate()
  const apply = useApplyLeave()
  const { data: balances } = useLeaveBalances()
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormValues) => {
    apply.mutate(data, {
      onSuccess: () => {
        addToast({ title: 'Leave applied', description: 'Your application has been submitted.' })
        navigate('/leaves')
      },
      onError: () => {
        addToast({ title: 'Error', description: 'Failed to submit leave application.', variant: 'destructive' })
      },
    })
  }

  return (
    <div>
      <PageHeader title="Apply for Leave" description="Submit a new leave application" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="leave_type_id">Leave Type</Label>
              <select
                id="leave_type_id"
                {...register('leave_type_id')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select leave type</option>
                {balances?.map((b) => (
                  <option key={b.leave_type.id} value={b.leave_type.id}>
                    {b.leave_type.name} ({b.remaining_days} days remaining)
                  </option>
                ))}
              </select>
              {errors.leave_type_id && <p className="text-xs text-destructive">{errors.leave_type_id.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" {...register('end_date')} />
                {errors.end_date && <p className="text-xs text-destructive">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="reason">Reason</Label>
              <textarea
                id="reason"
                {...register('reason')}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Reason for leave..."
              />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={apply.isPending}>
                {apply.isPending ? 'Submitting…' : 'Submit Application'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/leaves')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

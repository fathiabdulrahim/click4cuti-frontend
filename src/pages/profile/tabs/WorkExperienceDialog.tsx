import { useEffect } from 'react'
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
import type { WorkExperience } from '@/lib/types'

const schema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
})

export type WorkExperienceFormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: WorkExperience | null
  onSubmit: (values: WorkExperienceFormValues) => void
  isSubmitting?: boolean
}

export function WorkExperienceDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  isSubmitting,
}: Props) {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<WorkExperienceFormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      company_name: initial?.company_name ?? '',
      position: initial?.position ?? '',
      start_date: initial?.start_date ?? '',
      end_date: initial?.end_date ?? '',
    })
  }, [initial, open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit work experience' : 'Add work experience'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Company Name</Label>
            <Input {...register('company_name')} />
            {errors.company_name && (
              <p className="text-xs text-destructive">{errors.company_name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Position</Label>
            <Input {...register('position')} />
            {errors.position && (
              <p className="text-xs text-destructive">{errors.position.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input type="date" {...register('start_date')} />
              {errors.start_date && (
                <p className="text-xs text-destructive">{errors.start_date.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="date" {...register('end_date')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

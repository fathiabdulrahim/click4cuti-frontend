import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import { EnumSelect } from '@/components/shared/EnumSelect'
import { ENUM_LABELS } from '@/lib/enums'
import type { FamilyMember } from '@/lib/types'

const schema = z.object({
  relation: z.enum(['SPOUSE', 'CHILD', 'PARENT']),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE']),
  nric_or_passport: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  employment_status: z.enum(['WORKING', 'NOT_WORKING', 'STUDYING', 'RETIRED']),
  oku_status: z.boolean(),
})

export type FamilyMemberFormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  initial?: FamilyMember | null
  onSubmit: (values: FamilyMemberFormValues) => void
  isSubmitting?: boolean
}

export function FamilyMemberDialog({ open, onOpenChange, initial, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<FamilyMemberFormValues>({
      resolver: zodResolver(schema),
      defaultValues: { oku_status: false, relation: 'CHILD', gender: 'MALE', employment_status: 'NOT_WORKING' },
    })

  useEffect(() => {
    reset({
      relation: (initial?.relation as 'SPOUSE' | 'CHILD' | 'PARENT') ?? 'CHILD',
      first_name: initial?.first_name ?? '',
      last_name: initial?.last_name ?? '',
      gender: (initial?.gender as 'MALE' | 'FEMALE') ?? 'MALE',
      nric_or_passport: initial?.nric_or_passport ?? '',
      date_of_birth: initial?.date_of_birth ?? '',
      phone: initial?.phone ?? '',
      email: initial?.email ?? '',
      address: initial?.address ?? '',
      employment_status:
        (initial?.employment_status as 'WORKING' | 'NOT_WORKING' | 'STUDYING' | 'RETIRED') ??
        'NOT_WORKING',
      oku_status: !!initial?.oku_status,
    })
  }, [initial, open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit dependent' : 'Add dependent'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Relation</Label>
              <Controller control={control} name="relation" render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.family_relation} value={field.value} onChange={(v) => field.onChange(v)} />
              )} />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Controller control={control} name="gender" render={({ field }) => (
                <EnumSelect options={{ MALE: 'Male', FEMALE: 'Female' } as const} value={field.value} onChange={(v) => field.onChange(v)} />
              )} />
            </div>
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input {...register('first_name')} />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <Input {...register('last_name')} />
            </div>
            <div className="space-y-1">
              <Label>NRIC / Passport</Label>
              <Input {...register('nric_or_passport')} />
            </div>
            <div className="space-y-1">
              <Label>Date of Birth</Label>
              <Input type="date" {...register('date_of_birth')} />
              {errors.date_of_birth && <p className="text-xs text-destructive">{errors.date_of_birth.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input {...register('phone')} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Address</Label>
              <Textarea rows={2} {...register('address')} />
            </div>
            <div className="space-y-1">
              <Label>Employment Status</Label>
              <Controller control={control} name="employment_status" render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.family_employment_status} value={field.value} onChange={(v) => field.onChange(v)} />
              )} />
            </div>
            <div className="space-y-1 flex items-center gap-2 pt-6">
              <Controller control={control} name="oku_status" render={({ field }) => (
                <Switch checked={!!field.value} onCheckedChange={field.onChange} />
              )} />
              <Label>OKU Status</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

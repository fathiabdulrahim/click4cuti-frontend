import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { SectionCard } from '@/components/shared/SectionCard'
import { EnumSelect } from '@/components/shared/EnumSelect'
import { UserCombobox } from '@/components/shared/UserCombobox'
import { useAdminUser, useUpdateAdminUser } from '@/hooks/useAdminUser'
import { useBranches } from '@/hooks/useBranches'
import { useNotificationStore } from '@/stores/notificationStore'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import type { EmployeeType } from '@/lib/types'

const schema = z.object({
  employee_id: z.string().optional().or(z.literal('')),
  date_of_sign: z.string().optional().or(z.literal('')),
  employee_type: z
    .enum(['PERMANENT', 'CONTRACT', 'PROBATION', 'INTERNSHIP', 'FREELANCE', 'PART_TIME', 'OJT', 'SL1M_OJT'])
    .nullable()
    .optional(),
  probation_period_days: z.coerce.number().int().nonnegative().nullable().optional(),
  oku_status: z.boolean().optional(),
  branch_id: z.string().nullable().optional(),
  ea_person_in_charge_id: z.string().nullable().optional(),
})
type FormValues = z.infer<typeof schema>

export default function JobInfoTab({ userId }: { userId: string }) {
  const { data: user, isLoading } = useAdminUser(userId)
  const { data: branches = [] } = useBranches()
  const update = useUpdateAdminUser(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!user) return
    reset({
      employee_id: user.employee_id ?? '',
      date_of_sign: user.date_of_sign ?? '',
      employee_type: upperEnum<EmployeeType>(user.employee_type),
      probation_period_days: user.probation_period_days ?? null,
      oku_status: !!user.oku_status,
      branch_id: user.branch_id ?? null,
      ea_person_in_charge_id: user.ea_person_in_charge_id ?? null,
    })
  }, [user, reset])

  function onSubmit(values: FormValues) {
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]),
    )
    update.mutate(payload, {
      onSuccess: () => addToast({ title: 'Job info saved', variant: 'success' }),
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SectionCard title="Employment Details" description="Job classification, branch and yearly form contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Employee No.</Label>
            <Input {...register('employee_id')} />
          </div>
          <div className="space-y-1">
            <Label>Date of Sign (LO)</Label>
            <Input type="date" {...register('date_of_sign')} />
          </div>
          <div className="space-y-1">
            <Label>Employee Type</Label>
            <Controller control={control} name="employee_type" render={({ field }) => (
              <EnumSelect options={ENUM_LABELS.employee_type} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
          <div className="space-y-1">
            <Label>Probation Period (days)</Label>
            <Input type="number" {...register('probation_period_days')} />
          </div>
          <div className="space-y-1">
            <Label>Branch</Label>
            <Controller control={control} name="branch_id" render={({ field }) => (
              <EnumSelect
                options={Object.fromEntries(branches.map((b) => [b.id, b.name])) as Record<string, string>}
                value={field.value ?? null}
                onChange={field.onChange}
                allowEmpty
              />
            )} />
          </div>
          <div className="space-y-1 flex items-center gap-3 pt-6">
            <Controller control={control} name="oku_status" render={({ field }) => (
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
            )} />
            <Label>OKU Status</Label>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>EA Person in Charge</Label>
            <Controller control={control} name="ea_person_in_charge_id" render={({ field }) => (
              <UserCombobox admin value={field.value ?? null} onChange={field.onChange} excludeIds={[userId]} />
            )} />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EnumSelect } from '@/components/shared/EnumSelect'
import { usePayroll, useUpdatePayroll } from '@/hooks/usePayroll'
import { useNotificationStore } from '@/stores/notificationStore'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import type {
  BankAccountStatus,
  BankAccountType,
  EpfContributionStart,
  Gender,
  TaxCategory,
} from '@/lib/types'

interface FormValues {
  bank_detail: {
    bank_name: string
    account_number: string
    account_type: BankAccountType | null
    branch: string
    account_status: BankAccountStatus | null
  }
  statutory_detail: {
    epf_number: string
    epf_contribution_start: EpfContributionStart | null
    socso_number: string
    socso_contribution_start_age: number | null
    eis_employee_rate: number | null
    eis_employer_rate: number | null
    income_tax_number: string
    vola_amount: number | null
  }
  tax_relief: {
    spouse_is_working: boolean
    spouse_is_disabled: boolean
    spouse_gender: Gender | null
    contributes_to_sip: boolean
    tax_category: TaxCategory | null
  }
}

export default function PayrollTab({ userId }: { userId: string }) {
  const { data, isLoading } = usePayroll(userId)
  const update = useUpdatePayroll(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: blankPayroll(),
  })

  useEffect(() => {
    if (!data) return
    reset({
      bank_detail: {
        bank_name: data.bank_detail?.bank_name ?? '',
        account_number: data.bank_detail?.account_number ?? '',
        account_type: upperEnum<BankAccountType>(data.bank_detail?.account_type),
        branch: data.bank_detail?.branch ?? '',
        account_status: upperEnum<BankAccountStatus>(data.bank_detail?.account_status),
      },
      statutory_detail: {
        epf_number: data.statutory_detail?.epf_number ?? '',
        epf_contribution_start: upperEnum<EpfContributionStart>(data.statutory_detail?.epf_contribution_start),
        socso_number: data.statutory_detail?.socso_number ?? '',
        socso_contribution_start_age: data.statutory_detail?.socso_contribution_start_age ?? null,
        eis_employee_rate: data.statutory_detail?.eis_employee_rate ?? null,
        eis_employer_rate: data.statutory_detail?.eis_employer_rate ?? null,
        income_tax_number: data.statutory_detail?.income_tax_number ?? '',
        vola_amount: data.statutory_detail?.vola_amount ?? null,
      },
      tax_relief: {
        spouse_is_working: !!data.tax_relief?.spouse_is_working,
        spouse_is_disabled: !!data.tax_relief?.spouse_is_disabled,
        spouse_gender: upperEnum<Gender>(data.tax_relief?.spouse_gender),
        contributes_to_sip: !!data.tax_relief?.contributes_to_sip,
        tax_category: upperEnum<TaxCategory>(data.tax_relief?.tax_category),
      },
    })
  }, [data, reset])

  function onSubmit(values: FormValues) {
    update.mutate(values, {
      onSuccess: () => addToast({ title: 'Payroll saved', variant: 'success' }),
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bank Detail</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Bank Name</Label>
            <Input {...register('bank_detail.bank_name')} />
          </div>
          <div className="space-y-1">
            <Label>Account Number</Label>
            <Input {...register('bank_detail.account_number')} />
          </div>
          <div className="space-y-1">
            <Label>Account Type</Label>
            <Controller control={control} name="bank_detail.account_type" render={({ field }) => (
              <EnumSelect options={ENUM_LABELS.bank_account_type} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
          <div className="space-y-1">
            <Label>Branch</Label>
            <Input {...register('bank_detail.branch')} />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Controller control={control} name="bank_detail.account_status" render={({ field }) => (
              <EnumSelect options={ENUM_LABELS.bank_account_status} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statutory Detail</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>EPF Number</Label>
            <Input {...register('statutory_detail.epf_number')} />
          </div>
          <div className="space-y-1">
            <Label>EPF Contribution Start</Label>
            <Controller control={control} name="statutory_detail.epf_contribution_start" render={({ field }) => (
              <EnumSelect options={ENUM_LABELS.epf_contribution_start} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
          <div className="space-y-1">
            <Label>SOCSO Number</Label>
            <Input {...register('statutory_detail.socso_number')} />
          </div>
          <div className="space-y-1">
            <Label>SOCSO Start Age</Label>
            <Input type="number" {...register('statutory_detail.socso_contribution_start_age', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>EIS Employee Rate</Label>
            <Input type="number" step="0.0001" {...register('statutory_detail.eis_employee_rate', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>EIS Employer Rate</Label>
            <Input type="number" step="0.0001" {...register('statutory_detail.eis_employer_rate', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>Income Tax Number</Label>
            <Input {...register('statutory_detail.income_tax_number')} />
          </div>
          <div className="space-y-1">
            <Label>VOLA Amount</Label>
            <Input type="number" step="0.01" {...register('statutory_detail.vola_amount', { valueAsNumber: true })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Relief</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Children counts derived from Dependents tab.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 flex items-center gap-3 pt-6">
            <Controller control={control} name="tax_relief.spouse_is_working" render={({ field }) => (
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
            )} />
            <Label>Spouse is working</Label>
          </div>
          <div className="space-y-1 flex items-center gap-3 pt-6">
            <Controller control={control} name="tax_relief.spouse_is_disabled" render={({ field }) => (
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
            )} />
            <Label>Spouse is disabled</Label>
          </div>
          <div className="space-y-1">
            <Label>Spouse Gender</Label>
            <Controller control={control} name="tax_relief.spouse_gender" render={({ field }) => (
              <EnumSelect options={{ MALE: 'Male', FEMALE: 'Female' } as const} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
          <div className="space-y-1 flex items-center gap-3 pt-6">
            <Controller control={control} name="tax_relief.contributes_to_sip" render={({ field }) => (
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
            )} />
            <Label>Contributes to SIP</Label>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Tax Category</Label>
            <Controller control={control} name="tax_relief.tax_category" render={({ field }) => (
              <EnumSelect options={ENUM_LABELS.tax_category} value={field.value ?? null} onChange={field.onChange} allowEmpty />
            )} />
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-3 text-sm pt-2 border-t">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Children &lt;18</div>
              <div className="text-lg font-medium">{data?.tax_relief?.children_under_18 ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Studying</div>
              <div className="text-lg font-medium">{data?.tax_relief?.children_studying ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Disabled</div>
              <div className="text-lg font-medium">{data?.tax_relief?.children_disabled ?? 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Saving…' : 'Save Payroll'}
        </Button>
      </div>
    </form>
  )
}

function blankPayroll(): FormValues {
  return {
    bank_detail: { bank_name: '', account_number: '', account_type: null, branch: '', account_status: null },
    statutory_detail: {
      epf_number: '',
      epf_contribution_start: null,
      socso_number: '',
      socso_contribution_start_age: null,
      eis_employee_rate: null,
      eis_employer_rate: null,
      income_tax_number: '',
      vola_amount: null,
    },
    tax_relief: {
      spouse_is_working: false,
      spouse_is_disabled: false,
      spouse_gender: null,
      contributes_to_sip: false,
      tax_category: null,
    },
  }
}

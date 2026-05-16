import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EnumSelect } from '@/components/shared/EnumSelect'
import { SectionCard } from '@/components/shared/SectionCard'
import { DataField, DataGrid } from '@/components/shared/DataField'
import { useAdminUser, useUpdateAdminUser } from '@/hooks/useAdminUser'
import { useNotificationStore } from '@/stores/notificationStore'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import { formatDate } from '@/lib/utils'
import type {
  BloodType,
  BumiStatus,
  EducationLevel,
  MaritalStatus,
  Nationality,
  NricColor,
  Race,
  Religion,
} from '@/lib/types'

const schema = z.object({
  first_name: z.string().optional().or(z.literal('')),
  last_name: z.string().optional().or(z.literal('')),
  nric: z.string().regex(/^\d{12}$/, 'NRIC must be 12 digits').optional().or(z.literal('')),
  nric_old: z.string().optional().or(z.literal('')),
  nric_color: z.enum(['BLUE', 'RED']).nullable().optional(),
  date_of_birth: z.string().optional().or(z.literal('')),
  place_of_birth: z.string().optional().or(z.literal('')),
  race: z.enum(['MALAY', 'CHINESE', 'INDIAN', 'OTHERS']).nullable().optional(),
  religion: z.enum(['ISLAM', 'BUDDHISM', 'HINDU', 'CHRISTIAN', 'OTHERS']).nullable().optional(),
  blood_type: z.enum(['A', 'B', 'AB', 'O']).nullable().optional(),
  education_level: z
    .enum(['PRE_SCHOOL', 'PRIMARY_SCHOOL', 'SECONDARY_SCHOOL', 'COLLEGE', 'DIPLOMA', 'DEGREE', 'MASTER', 'PHD'])
    .nullable()
    .optional(),
  marital_status: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).nullable().optional(),
  nationality: z.enum(['CITIZEN', 'NON_CITIZEN', 'PERMANENT_RESIDENT']).nullable().optional(),
  bumi_status: z.enum(['BUMIPUTERA', 'NON_BUMIPUTERA']).nullable().optional(),
  driving_license_number: z.string().optional().or(z.literal('')),
  driving_license_class: z.string().optional().or(z.literal('')),
  driving_license_expiry: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function PersonalDetailAdminTab({ userId }: { userId: string }) {
  const { data: user, isLoading } = useAdminUser(userId)
  const update = useUpdateAdminUser(userId)
  const addToast = useNotificationStore((s) => s.addToast)
  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!user) return
    reset({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      nric: user.nric ?? '',
      nric_old: user.nric_old ?? '',
      nric_color: upperEnum<NricColor>(user.nric_color),
      date_of_birth: user.date_of_birth ?? '',
      place_of_birth: user.place_of_birth ?? '',
      race: upperEnum<Race>(user.race),
      religion: upperEnum<Religion>(user.religion),
      blood_type: upperEnum<BloodType>(user.blood_type),
      education_level: upperEnum<EducationLevel>(user.education_level),
      marital_status: upperEnum<MaritalStatus>(user.marital_status),
      nationality: upperEnum<Nationality>(user.nationality),
      bumi_status: upperEnum<BumiStatus>(user.bumi_status),
      driving_license_number: user.driving_license_number ?? '',
      driving_license_class: user.driving_license_class ?? '',
      driving_license_expiry: user.driving_license_expiry ?? '',
    })
  }, [user, reset])

  function onSubmit(values: FormValues) {
    const cleaned = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]))
    update.mutate(cleaned, {
      onSuccess: () => {
        addToast({ title: 'Personal details saved', variant: 'success' })
        setEditing(false)
      },
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  if (isLoading || !user) return <LoadingSpinner className="py-12" />

  const labelize = <T extends string>(
    map: Readonly<Record<T, string>>,
    value: string | null | undefined,
  ): string | null => {
    const upper = upperEnum<T>(value)
    return upper ? map[upper] : null
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Personal Details"
        description="Identity and demographic information"
        action={
          <Button
            size="sm"
            variant={editing ? 'ghost' : 'outline'}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <><X className="mr-1 h-3.5 w-3.5" /> Cancel</> : <><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</>}
          </Button>
        }
      >
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="First Name"><Input {...register('first_name')} /></Field>
              <Field label="Last Name"><Input {...register('last_name')} /></Field>
              <Field label="Date of Birth"><Input type="date" {...register('date_of_birth')} /></Field>
              <Field label="NRIC"><Input {...register('nric')} placeholder="12 digits" /></Field>
              <Field label="NRIC (Old)"><Input {...register('nric_old')} /></Field>
              <Field label="NRIC Color">
                <Controller control={control} name="nric_color" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.nric_color} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Place of Birth"><Input {...register('place_of_birth')} /></Field>
              <Field label="Race">
                <Controller control={control} name="race" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.race} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Religion">
                <Controller control={control} name="religion" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.religion} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Blood Type">
                <Controller control={control} name="blood_type" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.blood_type} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Education Level">
                <Controller control={control} name="education_level" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.education_level} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Marital Status">
                <Controller control={control} name="marital_status" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.marital_status} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Nationality">
                <Controller control={control} name="nationality" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.nationality} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
              <Field label="Bumi Status">
                <Controller control={control} name="bumi_status" render={({ field }) => (
                  <EnumSelect options={ENUM_LABELS.bumi_status} value={field.value ?? null} onChange={field.onChange} allowEmpty />
                )} />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        ) : (
          <DataGrid cols={3}>
            <DataField label="First Name" value={user.first_name} />
            <DataField label="Last Name" value={user.last_name} />
            <DataField label="Date of Birth" value={user.date_of_birth ? formatDate(user.date_of_birth) : null} />
            <DataField label="NRIC" value={user.nric ? <span className="font-mono text-xs">{user.nric}</span> : null} />
            <DataField label="NRIC (Old)" value={user.nric_old} />
            <DataField label="NRIC Color" value={labelize(ENUM_LABELS.nric_color, user.nric_color)} />
            <DataField label="Place of Birth" value={user.place_of_birth} />
            <DataField label="Race" value={labelize(ENUM_LABELS.race, user.race)} />
            <DataField label="Religion" value={labelize(ENUM_LABELS.religion, user.religion)} />
            <DataField label="Blood Type" value={labelize(ENUM_LABELS.blood_type, user.blood_type)} />
            <DataField label="Education" value={labelize(ENUM_LABELS.education_level, user.education_level)} />
            <DataField label="Marital Status" value={labelize(ENUM_LABELS.marital_status, user.marital_status)} />
            <DataField label="Nationality" value={labelize(ENUM_LABELS.nationality, user.nationality)} />
            <DataField label="Bumi Status" value={labelize(ENUM_LABELS.bumi_status, user.bumi_status)} />
          </DataGrid>
        )}
      </SectionCard>

      <SectionCard title="Driving License" description="JPJ license details">
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="License Number"><Input {...register('driving_license_number')} /></Field>
            <Field label="License Class">
              <Controller control={control} name="driving_license_class" render={({ field }) => (
                <EnumSelect
                  options={ENUM_LABELS.driving_license_class}
                  value={field.value ? (field.value as string) : null}
                  onChange={(v) => field.onChange(v ?? '')}
                  allowEmpty
                />
              )} />
            </Field>
            <Field label="Expiry Date"><Input type="date" {...register('driving_license_expiry')} /></Field>
          </form>
        ) : (
          <DataGrid cols={3}>
            <DataField
              label="License Number"
              value={user.driving_license_number ? <span className="font-mono text-xs">{user.driving_license_number}</span> : null}
            />
            <DataField
              label="License Class"
              value={
                user.driving_license_class
                  ? ENUM_LABELS.driving_license_class[
                      user.driving_license_class as keyof typeof ENUM_LABELS.driving_license_class
                    ] ?? user.driving_license_class
                  : null
              }
            />
            <DataField
              label="Expiry Date"
              value={user.driving_license_expiry ? formatDate(user.driving_license_expiry) : null}
            />
          </DataGrid>
        )}
      </SectionCard>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

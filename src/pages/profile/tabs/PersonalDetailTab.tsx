import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EnumSelect } from '@/components/shared/EnumSelect'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useNotificationStore } from '@/stores/notificationStore'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
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
  nric: z
    .string()
    .regex(/^\d{12}$/, 'NRIC must be 12 digits')
    .optional()
    .or(z.literal('')),
  nric_old: z.string().optional().or(z.literal('')),
  nric_color: z.enum(['BLUE', 'RED']).nullable().optional(),
  date_of_birth: z.string().optional().or(z.literal('')),
  place_of_birth: z.string().optional().or(z.literal('')),
  race: z.enum(['MALAY', 'CHINESE', 'INDIAN', 'OTHERS']).nullable().optional(),
  religion: z.enum(['ISLAM', 'BUDDHISM', 'HINDU', 'CHRISTIAN', 'OTHERS']).nullable().optional(),
  blood_type: z.enum(['A', 'B', 'AB', 'O']).nullable().optional(),
  education_level: z
    .enum([
      'PRE_SCHOOL',
      'PRIMARY_SCHOOL',
      'SECONDARY_SCHOOL',
      'COLLEGE',
      'DIPLOMA',
      'DEGREE',
      'MASTER',
      'PHD',
    ])
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

export default function PersonalDetailTab() {
  const { data: profile, isLoading } = useProfile()
  const update = useUpdateProfile()
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!profile) return
    reset({
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      nric: profile.nric ?? '',
      nric_old: profile.nric_old ?? '',
      nric_color: upperEnum<NricColor>(profile.nric_color),
      date_of_birth: profile.date_of_birth ?? '',
      place_of_birth: profile.place_of_birth ?? '',
      race: upperEnum<Race>(profile.race),
      religion: upperEnum<Religion>(profile.religion),
      blood_type: upperEnum<BloodType>(profile.blood_type),
      education_level: upperEnum<EducationLevel>(profile.education_level),
      marital_status: upperEnum<MaritalStatus>(profile.marital_status),
      nationality: upperEnum<Nationality>(profile.nationality),
      bumi_status: upperEnum<BumiStatus>(profile.bumi_status),
      driving_license_number: profile.driving_license_number ?? '',
      driving_license_class: profile.driving_license_class ?? '',
      driving_license_expiry: profile.driving_license_expiry ?? '',
    })
  }, [profile, reset])

  function onSubmit(values: FormValues) {
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]),
    )
    update.mutate(cleaned, {
      onSuccess: () => addToast({ title: 'Personal detail saved', variant: 'success' }),
      onError: () =>
        addToast({ title: 'Error', description: 'Could not save.', variant: 'destructive' }),
    })
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name"><Input {...register('first_name')} /></Field>
          <Field label="Last Name"><Input {...register('last_name')} /></Field>
          <Field label="NRIC"><Input {...register('nric')} placeholder="12 digits" /></Field>
          <Field label="Date of Birth"><Input type="date" {...register('date_of_birth')} /></Field>
          <Field label="NRIC (Old)"><Input {...register('nric_old')} /></Field>
          <Field label="NRIC Color">
            <Controller control={control} name="nric_color"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.nric_color} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Place of Birth"><Input {...register('place_of_birth')} /></Field>
          <Field label="Race">
            <Controller control={control} name="race"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.race} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Religion">
            <Controller control={control} name="religion"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.religion} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Blood Type">
            <Controller control={control} name="blood_type"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.blood_type} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Education Level">
            <Controller control={control} name="education_level"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.education_level} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Marital Status">
            <Controller control={control} name="marital_status"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.marital_status} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Nationality">
            <Controller control={control} name="nationality"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.nationality} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
          <Field label="Bumi Status">
            <Controller control={control} name="bumi_status"
              render={({ field }) => (
                <EnumSelect options={ENUM_LABELS.bumi_status} value={field.value ?? null} onChange={field.onChange} allowEmpty />
              )} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Driving License</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="License Number"><Input {...register('driving_license_number')} /></Field>
          <Field label="License Class">
            <Controller control={control} name="driving_license_class"
              render={({ field }) => (
                <EnumSelect
                  options={ENUM_LABELS.driving_license_class}
                  value={field.value ? (field.value as string) : null}
                  onChange={(v) => field.onChange(v ?? '')}
                  allowEmpty
                />
              )} />
          </Field>
          <Field label="Expiry Date"><Input type="date" {...register('driving_license_expiry')} /></Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { SectionCard } from '@/components/shared/SectionCard'
import { DataField, DataGrid } from '@/components/shared/DataField'
import { useAdminUser, useUpdateAdminUser } from '@/hooks/useAdminUser'
import { useNotificationStore } from '@/stores/notificationStore'

const schema = z.object({
  phone: z.string().optional().or(z.literal('')),
  mobile_phone: z.string().optional().or(z.literal('')),
  personal_email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  mailing_address: z.string().optional().or(z.literal('')),
  emergency_contact_name: z.string().optional().or(z.literal('')),
  emergency_contact_phone: z.string().optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function ContactInfoAdminTab({ userId }: { userId: string }) {
  const { data: user, isLoading } = useAdminUser(userId)
  const update = useUpdateAdminUser(userId)
  const addToast = useNotificationStore((s) => s.addToast)
  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!user) return
    reset({
      phone: user.phone ?? '',
      mobile_phone: user.mobile_phone ?? '',
      personal_email: user.personal_email ?? '',
      address: user.address ?? '',
      mailing_address: user.mailing_address ?? '',
      emergency_contact_name: user.emergency_contact_name ?? '',
      emergency_contact_phone: user.emergency_contact_phone ?? '',
    })
  }, [user, reset])

  function onSubmit(values: FormValues) {
    const cleaned = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]))
    update.mutate(cleaned, {
      onSuccess: () => {
        addToast({ title: 'Contact info saved', variant: 'success' })
        setEditing(false)
      },
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  if (isLoading || !user) return <LoadingSpinner className="py-12" />

  return (
    <div className="space-y-4">
      <SectionCard
        title="Contact Info"
        description="Phone numbers, emails and addresses"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Phone Number"><Input {...register('phone')} /></Field>
              <Field label="Mobile Number"><Input {...register('mobile_phone')} /></Field>
              <Field label="Personal Email" className="md:col-span-2">
                <Input type="email" {...register('personal_email')} />
              </Field>
              <Field label="Address"><Textarea rows={3} {...register('address')} /></Field>
              <Field label="Mailing Address"><Textarea rows={3} {...register('mailing_address')} /></Field>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        ) : (
          <DataGrid cols={2}>
            <DataField label="Phone Number" value={user.phone} />
            <DataField label="Mobile Number" value={user.mobile_phone} />
            <DataField
              label="Email (work)"
              value={user.email ? <a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a> : null}
            />
            <DataField
              label="Personal Email"
              value={user.personal_email ? <a href={`mailto:${user.personal_email}`} className="text-primary hover:underline">{user.personal_email}</a> : null}
            />
            <DataField label="Address" value={user.address ? <span className="whitespace-pre-line">{user.address}</span> : null} />
            <DataField label="Mailing Address" value={user.mailing_address ? <span className="whitespace-pre-line">{user.mailing_address}</span> : null} />
          </DataGrid>
        )}
      </SectionCard>

      <SectionCard title="Emergency Contact" description="Who to reach in case of emergency">
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name"><Input {...register('emergency_contact_name')} /></Field>
            <Field label="Mobile Number"><Input {...register('emergency_contact_phone')} /></Field>
          </form>
        ) : (
          <DataGrid cols={2}>
            <DataField label="Name" value={user.emergency_contact_name} />
            <DataField label="Mobile Number" value={user.emergency_contact_phone} />
          </DataGrid>
        )}
      </SectionCard>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
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

export default function ContactInfoTab() {
  const { data: profile, isLoading } = useProfile()
  const update = useUpdateProfile()
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!profile) return
    reset({
      phone: profile.phone ?? '',
      mobile_phone: profile.mobile_phone ?? '',
      personal_email: profile.personal_email ?? '',
      address: profile.address ?? '',
      mailing_address: profile.mailing_address ?? '',
      emergency_contact_name: profile.emergency_contact_name ?? '',
      emergency_contact_phone: profile.emergency_contact_phone ?? '',
    })
  }, [profile, reset])

  function onSubmit(values: FormValues) {
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]),
    )
    update.mutate(cleaned, {
      onSuccess: () => addToast({ title: 'Contact info saved', variant: 'success' }),
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input {...register('phone')} />
          </div>
          <div className="space-y-1">
            <Label>Mobile Number</Label>
            <Input {...register('mobile_phone')} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Personal Email</Label>
            <Input type="email" {...register('personal_email')} />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Textarea rows={3} {...register('address')} />
          </div>
          <div className="space-y-1">
            <Label>Mailing Address</Label>
            <Textarea rows={3} {...register('mailing_address')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input {...register('emergency_contact_name')} />
          </div>
          <div className="space-y-1">
            <Label>Mobile Number</Label>
            <Input {...register('emergency_contact_phone')} />
          </div>
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

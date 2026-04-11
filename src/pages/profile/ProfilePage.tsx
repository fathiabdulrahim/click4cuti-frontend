import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import { useEffect } from 'react'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const update = useUpdateProfile()
  const addToast = useNotificationStore((s) => s.addToast)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (profile) {
      reset({ full_name: profile.full_name, phone: profile.phone ?? '', address: profile.address ?? '' })
    }
  }, [profile, reset])

  const onSubmit = (data: FormValues) => {
    update.mutate(data, {
      onSuccess: () => addToast({ title: 'Profile updated', variant: 'success' }),
      onError: () => addToast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' }),
    })
  }

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <div>
      <PageHeader title="My Profile" description="View and update your personal information" />
      <div className="grid gap-6 md:grid-cols-2">
        {/* Read-only info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Account Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employee ID</span>
              <span className="font-medium">{profile?.employee_id ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{profile?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Join Date</span>
              <span className="font-medium">{profile?.join_date ? formatDate(profile.join_date) : '—'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Editable info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Personal Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input {...register('full_name')} />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input {...register('phone')} placeholder="+60123456789" />
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input {...register('address')} placeholder="Your address" />
              </div>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

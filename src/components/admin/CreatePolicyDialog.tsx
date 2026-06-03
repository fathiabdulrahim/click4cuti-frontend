import { useState } from 'react'
import { useCreateLeavePolicy } from '@/hooks/useAdmin'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface CreatePolicyForm {
  name: string
  description?: string
  advance_notice_days: number
}

interface CreatePolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePolicyDialog({ open, onOpenChange }: CreatePolicyDialogProps) {
  const createPolicy = useCreateLeavePolicy()
  const { addToast } = useNotificationStore()
  const companyId = useAuthStore((s) => s.adminUser?.company_id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreatePolicyForm>({
    name: '',
    description: '',
    advance_notice_days: 7,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Policy name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Policy name must be less than 255 characters'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (typeof formData.advance_notice_days !== 'number' || formData.advance_notice_days < 0 || formData.advance_notice_days > 365) {
      newErrors.advance_notice_days = 'Advance notice days must be between 0 and 365'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!companyId) {
      addToast({ title: 'Error', description: 'No company associated with your account', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      await createPolicy.mutateAsync({ ...formData, company_id: companyId } as unknown as Record<string, unknown>)
      addToast({ title: 'Success', description: 'Leave policy created successfully', variant: 'success' })
      setFormData({ name: '', description: '', advance_notice_days: 7 })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create policy',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Leave Policy</DialogTitle>
          <DialogDescription>
            Add a new leave policy for your company
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Policy Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Standard Leave Policy"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              disabled={isSubmitting}
              className="mt-1"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., Default policy for all new hires"
              value={formData.description || ''}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              disabled={isSubmitting}
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional brief description of this policy
            </p>
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="advance_notice_days" className="text-sm font-medium">
              Advance Notice Days <span className="text-red-500">*</span>
            </Label>
            <Input
              id="advance_notice_days"
              type="number"
              min="0"
              max="365"
              placeholder="7"
              value={formData.advance_notice_days}
              onChange={(e) => {
                setFormData({ ...formData, advance_notice_days: parseInt(e.target.value, 10) || 0 })
                if (errors.advance_notice_days) setErrors({ ...errors, advance_notice_days: '' })
              }}
              disabled={isSubmitting}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of days advance notice required before leave
            </p>
            {errors.advance_notice_days && (
              <p className="text-sm text-red-500 mt-1">{errors.advance_notice_days}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? <LoadingSpinner className="h-4 w-4" /> : 'Create Policy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useEffect } from 'react'
import { useUpdateLeavePolicy } from '@/hooks/useAdmin'
import { useNotificationStore } from '@/stores/notificationStore'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { LeavePolicy } from '@/lib/types'

interface EditPolicyForm {
  name: string
  description?: string
  advance_notice_days: number
}

interface EditPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy: LeavePolicy | null
}

export function EditPolicyDialog({ open, onOpenChange, policy }: EditPolicyDialogProps) {
  const updatePolicy = useUpdateLeavePolicy()
  const { addToast } = useNotificationStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState<EditPolicyForm>({
    name: '',
    description: '',
    advance_notice_days: 7,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name || '',
        description: policy.description || '',
        advance_notice_days: policy.advance_notice_days || 7,
      })
      setErrors({})
    }
  }, [policy, open])

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

    if (!validateForm() || !policy?.id) {
      return
    }

    setIsSubmitting(true)
    try {
      await updatePolicy.mutateAsync({ id: policy.id, ...(formData as unknown as Record<string, unknown>) })
      addToast({ title: 'Success', description: 'Leave policy updated successfully', variant: 'success' })
      onOpenChange(false)
    } catch (error) {
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update policy',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeactivate = async () => {
    if (!policy?.id) return

    setIsSubmitting(true)
    try {
      await updatePolicy.mutateAsync({ id: policy.id, is_active: false })
      addToast({ title: 'Success', description: 'Leave policy deactivated successfully', variant: 'success' })
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } catch (error) {
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to deactivate policy',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Leave Policy</DialogTitle>
            <DialogDescription>
              Update the leave policy details
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

            <div className="flex justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                Deactivate
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                  {isSubmitting ? <LoadingSpinner className="h-4 w-4" /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-2">Deactivate Leave Policy?</h2>
            <p className="text-sm text-gray-600 mb-4">
              This will deactivate the "{policy?.name}" policy. It won't be deleted, but employees won't be able to use it for new leave applications.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeactivate}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner className="h-4 w-4" /> : 'Deactivate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

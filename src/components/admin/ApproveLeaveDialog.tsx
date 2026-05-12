import { useEffect, useState } from 'react'
import { useUpdateLeaveApplication } from '@/hooks/useAdmin'
import { useNotificationStore } from '@/stores/notificationStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDate, formatDays } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { LeaveApplication } from '@/lib/types'

interface Props {
  application: LeaveApplication | null
  action: 'APPROVED' | 'REJECTED' | null
  onClose: () => void
}

export function ApproveLeaveDialog({ application, action, onClose }: Props) {
  const update = useUpdateLeaveApplication()
  const addToast = useNotificationStore((s) => s.addToast)
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState<string | null>(null)

  const open = !!application && !!action
  const isReject = action === 'REJECTED'

  useEffect(() => {
    if (open) {
      setRemarks('')
      setError(null)
    }
  }, [open])

  const handleSubmit = () => {
    if (!application || !action) return
    if (isReject && remarks.trim().length === 0) {
      setError('Please provide a reason for rejection')
      return
    }

    update
      .mutateAsync({
        id: application.id,
        status: action,
        reviewer_remarks: remarks.trim() || undefined,
      })
      .then(() => {
        addToast({ title: `Leave ${action.toLowerCase()}`, variant: 'success' })
        onClose()
      })
      .catch(() => addToast({ title: 'Failed to update leave', variant: 'destructive' }))
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReject ? 'Reject leave request' : 'Approve leave request'}</DialogTitle>
          <DialogDescription>
            {application && (
              <>
                <strong>{application.user.full_name}</strong> · {application.leave_type.name} ·{' '}
                {formatDate(application.start_date)} — {formatDate(application.end_date)} ·{' '}
                {formatDays(application.total_days)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="remarks">
            Reviewer remarks {isReject ? <span className="text-destructive">*</span> : <span className="text-muted-foreground text-xs">(optional)</span>}
          </Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value)
              if (error) setError(null)
            }}
            placeholder={isReject ? 'Explain why this leave is being rejected...' : 'Optional note for the employee'}
            rows={4}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={update.isPending}
            variant={isReject ? 'destructive' : 'default'}
            className={isReject ? 'cursor-pointer' : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'}
          >
            {update.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isReject ? (
              'Reject leave'
            ) : (
              'Approve leave'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

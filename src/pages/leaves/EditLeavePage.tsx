import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLeave, useUpdateLeave } from '@/hooks/useLeaves'
import { useLeaveBalances } from '@/hooks/useLeaveBalances'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useNotificationStore } from '@/stores/notificationStore'
import { cn } from '@/lib/utils'
import { format, eachDayOfInterval, isWeekend, parseISO } from 'date-fns'
import type { DayType } from '@/lib/types'
import {
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Loader2,
  Info,
  AlertCircle,
  Save,
} from 'lucide-react'

const DAY_TYPE_OPTIONS: { value: DayType; label: string; Icon: typeof Sun }[] = [
  { value: 'FULL_DAY', label: 'Full', Icon: Sun },
  { value: 'HALF_DAY_AM', label: 'AM', Icon: Sunrise },
  { value: 'HALF_DAY_PM', label: 'PM', Icon: Sunset },
]

function Segmented({
  value,
  onChange,
  options,
}: {
  value: DayType
  onChange: (v: DayType) => void
  options: typeof DAY_TYPE_OPTIONS
}) {
  return (
    <div className="inline-flex h-7 rounded-[9px] p-[3px] bg-muted border border-border">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'px-2.5 rounded-[7px] text-[11.5px] font-semibold flex items-center gap-1 transition-colors',
              active
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <o.Icon className="h-[11px] w-[11px]" />
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export default function EditLeavePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addToast = useNotificationStore((s) => s.addToast)

  const { data: leave, isLoading: leaveLoading } = useLeave(id ?? '')
  const { data: balances } = useLeaveBalances()
  const updateLeave = useUpdateLeave()

  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [reason, setReason] = useState('')
  const [extendedReason, setExtendedReason] = useState('')
  const [dayTypes, setDayTypes] = useState<Record<string, DayType>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill form from existing leave
  useEffect(() => {
    if (leave) {
      setStartDate(parseISO(leave.start_date))
      setEndDate(parseISO(leave.end_date))
      setReason(leave.reason ?? '')
      setExtendedReason(leave.extended_reason ?? '')

      // Pre-fill day types from leave_day_details
      if (leave.leave_day_details?.length) {
        const dt: Record<string, DayType> = {}
        for (const d of leave.leave_day_details) {
          dt[d.leave_date] = d.day_type as DayType
        }
        setDayTypes(dt)
      }
    }
  }, [leave])

  // Redirect if not pending
  useEffect(() => {
    if (leave && leave.status !== 'PENDING') {
      addToast({
        variant: 'destructive',
        title: 'Cannot edit',
        description: 'Only pending leave applications can be edited.',
      })
      navigate('/leaves')
    }
  }, [leave, navigate, addToast])

  const workingDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    return days.filter((d) => !isWeekend(d)).length
  }, [startDate, endDate])

  const leaveType = leave?.leave_type
  const balance = balances?.find((b) => b.leave_type?.id === leaveType?.id)

  // Adjusted remaining: release old days, then check
  const adjustedRemaining = useMemo(() => {
    if (!balance || !leave) return balance?.remaining_days ?? 0
    return balance.remaining_days + leave.total_days - workingDays
  }, [balance, leave, workingDays])

  const needsExtendedReason = useMemo(() => {
    if (!leaveType?.ceo_approval_enabled || !leaveType?.max_consecutive_days) return false
    return workingDays > leaveType.max_consecutive_days
  }, [workingDays, leaveType])

  const handleSubmit = () => {
    setErrors({})

    // Validate
    const newErrors: Record<string, string> = {}
    if (!startDate) newErrors.start_date = 'Start date is required'
    if (!endDate) newErrors.end_date = 'End date is required'
    if (startDate && endDate && startDate > endDate) newErrors.end_date = 'End date must be after start date'
    if (!reason.trim()) newErrors.reason = 'Reason is required'
    if (needsExtendedReason && !extendedReason.trim()) {
      newErrors.extended_reason = 'Extended reason is required for leaves exceeding consecutive day limit'
    }
    if (adjustedRemaining < 0) {
      newErrors.balance = `Insufficient balance. You need ${Math.abs(adjustedRemaining)} more day(s).`
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Build day details
    const leave_day_details_attributes = Object.entries(dayTypes)
      .filter(([, dt]) => dt !== 'FULL_DAY')
      .map(([leave_date, day_type]) => ({ leave_date, day_type }))

    updateLeave.mutate(
      {
        id: id!,
        payload: {
          start_date: format(startDate!, 'yyyy-MM-dd'),
          end_date: format(endDate!, 'yyyy-MM-dd'),
          reason: reason.trim(),
          extended_reason: extendedReason.trim() || undefined,
          leave_day_details_attributes: leave_day_details_attributes.length > 0 ? leave_day_details_attributes : undefined,
        },
      },
      {
        onSuccess: () => {
          addToast({
            variant: 'success',
            title: 'Leave updated',
            description: 'Your leave application has been updated.',
          })
          navigate('/leaves')
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : 'Failed to update leave'
          addToast({ variant: 'destructive', title: 'Update failed', description: msg })
        },
      }
    )
  }

  if (leaveLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    )
  }

  if (!leave) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Leave application not found.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Edit Leave Application</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify your pending leave request. Only dates, reason, and day types can be changed.
        </p>
      </div>

      {/* Leave type — read only */}
      <div className="rounded-xl border bg-card p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Leave Type</div>
        <div className="text-lg font-bold">{leaveType?.name ?? '—'}</div>
        {balance && (
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>Remaining: <strong>{adjustedRemaining}</strong> days</span>
            <span>·</span>
            <span>Currently reserved: <strong>{leave.total_days}</strong> days</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              disabled={(date) => date < new Date()}
            />
            {errors.start_date && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.start_date}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              disabled={(date) => date < new Date()}
            />
            {errors.end_date && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.end_date}
              </p>
            )}
          </div>
        </div>

        {startDate && endDate && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">Working days: {workingDays}</span>
            <span className="text-muted-foreground">(weekends excluded)</span>
          </div>
        )}
      </div>

      {/* Day-by-day overrides */}
      {startDate && endDate && workingDays > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Day-by-Day Overrides
          </div>
          <div className="space-y-1">
            {eachDayOfInterval({ start: startDate, end: endDate })
              .filter((d) => !isWeekend(d))
              .map((day) => {
                const key = format(day, 'yyyy-MM-dd')
                const currentType = dayTypes[key] ?? 'FULL_DAY'
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                  >
                    <div className="text-sm">
                      <span className="font-medium">{format(day, 'EEE, d MMM')}</span>
                    </div>
                    <Segmented
                      value={currentType}
                      onChange={(v) => setDayTypes((prev) => ({ ...prev, [key]: v }))}
                      options={DAY_TYPE_OPTIONS}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Reason */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason</div>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why do you need this leave?"
          rows={3}
        />
        {errors.reason && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.reason}
          </p>
        )}
      </div>

      {/* Extended reason (if needed) */}
      {needsExtendedReason && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              Extended reason required ({workingDays} days exceeds {leaveType?.max_consecutive_days} day limit)
            </span>
          </div>
          <Textarea
            value={extendedReason}
            onChange={(e) => setExtendedReason(e.target.value)}
            placeholder="Provide additional justification for this extended leave..."
            rows={3}
            className="border-amber-300"
          />
          {errors.extended_reason && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.extended_reason}
            </p>
          )}
        </div>
      )}

      {/* Balance warning */}
      {errors.balance && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {errors.balance}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={updateLeave.isPending}
          className="gap-2"
        >
          {updateLeave.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {updateLeave.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/leaves')}
          disabled={updateLeave.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
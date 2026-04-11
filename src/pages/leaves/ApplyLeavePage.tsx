import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplyLeave } from '@/hooks/useLeaves'
import { useLeaveBalances } from '@/hooks/useLeaveBalances'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { Combobox } from '@/components/ui/combobox'
import { useNotificationStore } from '@/stores/notificationStore'
import { cn } from '@/lib/utils'
import { format, eachDayOfInterval, isWeekend, differenceInCalendarDays } from 'date-fns'
import type { DayType } from '@/lib/types'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Loader2,
  Info,
  AlertCircle,
} from 'lucide-react'

// ─── Day type options ───────────────────────────────────

const DAY_TYPE_OPTIONS: { value: DayType; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'FULL_DAY', label: 'Full Day', icon: Sun, desc: '1 day' },
  { value: 'HALF_DAY_AM', label: 'Morning', icon: Sunrise, desc: '0.5 day (AM)' },
  { value: 'HALF_DAY_PM', label: 'Afternoon', icon: Sunset, desc: '0.5 day (PM)' },
]

// ─── Component ──────────────────────────────────────────

export default function ApplyLeavePage() {
  const navigate = useNavigate()
  const apply = useApplyLeave()
  const { data: balances } = useLeaveBalances()
  const addToast = useNotificationStore((s) => s.addToast)

  // Form state
  const [leaveTypeId, setLeaveTypeId] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [reason, setReason] = useState('')
  const [dayTypes, setDayTypes] = useState<Record<string, DayType>>({})

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Derived
  const selectedBalance = balances?.find((b) => b.leave_type.id === leaveTypeId)
  const allowsHalfDay = selectedBalance?.leave_type.allows_half_day ?? false

  // Generate days in range
  const daysInRange = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return []
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [startDate, endDate])

  // Working days (non-weekend) with their day types
  const workingDays = useMemo(() => {
    return daysInRange.filter((d) => !isWeekend(d))
  }, [daysInRange])

  // Calculate total days
  const totalDays = useMemo(() => {
    return workingDays.reduce((sum, day) => {
      const key = format(day, 'yyyy-MM-dd')
      const type = dayTypes[key] || 'FULL_DAY'
      return sum + (type === 'FULL_DAY' ? 1 : 0.5)
    }, 0)
  }, [workingDays, dayTypes])

  // Update day type for a specific date
  const setDayType = (dateKey: string, type: DayType) => {
    setDayTypes((prev) => ({ ...prev, [dateKey]: type }))
  }

  // Set all working days to a type
  const setAllDayTypes = (type: DayType) => {
    const updated: Record<string, DayType> = {}
    workingDays.forEach((day) => {
      updated[format(day, 'yyyy-MM-dd')] = type
    })
    setDayTypes(updated)
  }

  // When start/end date changes, reset day types
  const handleStartDate = (date: Date | undefined) => {
    setStartDate(date)
    setDayTypes({})
    if (date && endDate && endDate < date) setEndDate(undefined)
  }

  const handleEndDate = (date: Date | undefined) => {
    setEndDate(date)
    setDayTypes({})
  }

  // Validate and submit
  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!leaveTypeId) errs.leaveType = 'Please select a leave type'
    if (!startDate) errs.startDate = 'Start date is required'
    if (!endDate) errs.endDate = 'End date is required'
    if (reason.trim().length < 10) errs.reason = 'Reason must be at least 10 characters'
    if (selectedBalance && totalDays > selectedBalance.remaining_days) {
      errs.balance = `Insufficient balance. You have ${selectedBalance.remaining_days} days remaining.`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !startDate || !endDate) return

    const leave_day_details_attributes = workingDays.map((day) => {
      const key = format(day, 'yyyy-MM-dd')
      return {
        leave_date: key,
        day_type: dayTypes[key] || 'FULL_DAY',
      }
    })

    apply.mutate(
      {
        leave_type_id: leaveTypeId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        reason: reason.trim(),
        leave_day_details_attributes,
      },
      {
        onSuccess: () => {
          addToast({ title: 'Leave applied', description: 'Your application has been submitted.', variant: 'success' })
          navigate('/leaves')
        },
        onError: () => {
          addToast({ title: 'Error', description: 'Failed to submit leave application.', variant: 'destructive' })
        },
      }
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/leaves')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Leaves
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Apply for Leave</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below to submit your leave application</p>
      </div>

      {/* Leave balance cards */}
      {balances && balances.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {balances.map((b) => {
            const isSelected = b.leave_type.id === leaveTypeId
            const pct = b.total_entitled > 0 ? ((b.remaining_days / b.total_entitled) * 100) : 0
            return (
              <button
                key={b.leave_type.id}
                type="button"
                onClick={() => { setLeaveTypeId(b.leave_type.id); setErrors((e) => ({ ...e, leaveType: '' })) }}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all cursor-pointer',
                  isSelected
                    ? 'border-[#0F766E] bg-[#0F766E]/5 ring-1 ring-[#0F766E]'
                    : 'border-border/60 bg-white hover:border-[#0F766E]/40 hover:shadow-sm'
                )}
              >
                <p className={cn(
                  'text-xs font-medium truncate',
                  isSelected ? 'text-[#0F766E]' : 'text-muted-foreground'
                )}>
                  {b.leave_type.name}
                </p>
                <p className="text-2xl font-bold mt-1">{b.remaining_days}</p>
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        pct > 50 ? 'bg-[#0F766E]' : pct > 20 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {b.used_days} used of {b.total_entitled}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
      {errors.leaveType && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />{errors.leaveType}
        </p>
      )}

      {/* Form */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave type (mobile fallback / alternative) */}
            {(!balances || balances.length === 0) && (
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Combobox
                  options={balances?.map((b) => ({
                    value: b.leave_type.id,
                    label: `${b.leave_type.name} (${b.remaining_days} days left)`,
                  })) ?? []}
                  value={leaveTypeId}
                  onValueChange={setLeaveTypeId}
                  placeholder="Select leave type"
                  searchPlaceholder="Search leave types..."
                />
              </div>
            )}

            {/* Selected leave info */}
            {selectedBalance && (
              <div className="flex items-center gap-3 rounded-lg bg-[#0F766E]/5 border border-[#0F766E]/20 px-4 py-3">
                <Info className="h-4 w-4 text-[#0F766E] shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-[#0F766E]">{selectedBalance.leave_type.name}</span>
                  <span className="text-muted-foreground">
                    {' '}&middot; {selectedBalance.remaining_days} of {selectedBalance.total_entitled} days remaining
                  </span>
                  {selectedBalance.leave_type.allows_half_day && (
                    <Badge variant="outline" className="ml-2 text-[10px] border-[#0F766E]/30 text-[#0F766E]">
                      Half-day allowed
                    </Badge>
                  )}
                  {selectedBalance.leave_type.requires_document && (
                    <Badge variant="outline" className="ml-2 text-[10px] border-amber-300 text-amber-700">
                      Document required
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Date selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  Start Date
                </Label>
                <DatePicker
                  value={startDate}
                  onChange={handleStartDate}
                  placeholder="Select start date"
                  minDate={today}
                />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  End Date
                </Label>
                <DatePicker
                  value={endDate}
                  onChange={handleEndDate}
                  placeholder="Select end date"
                  minDate={startDate || today}
                />
                {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            {/* Day-by-day configuration */}
            {workingDays.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Day Details
                    <span className="text-muted-foreground font-normal">
                      ({workingDays.length} working {workingDays.length === 1 ? 'day' : 'days'})
                    </span>
                  </Label>
                  {allowsHalfDay && workingDays.length > 1 && (
                    <div className="flex gap-1">
                      {DAY_TYPE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAllDayTypes(value)}
                          className="text-[10px] font-medium px-2 py-1 rounded border border-border/60 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          All {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border/60 divide-y">
                  {workingDays.map((day) => {
                    const key = format(day, 'yyyy-MM-dd')
                    const currentType = dayTypes[key] || 'FULL_DAY'
                    const dayLabel = format(day, 'EEE, dd MMM yyyy')

                    return (
                      <div key={key} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                            {format(day, 'dd')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{dayLabel}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {currentType === 'FULL_DAY' ? '1 day' : '0.5 day'}
                            </p>
                          </div>
                        </div>

                        {allowsHalfDay ? (
                          <div className="flex gap-1">
                            {DAY_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setDayType(key, value)}
                                className={cn(
                                  'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                                  currentType === value
                                    ? 'bg-[#0F766E] text-white'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                )}
                              >
                                <Icon className="h-3 w-3" />
                                {label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline">Full Day</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Weekend notice */}
                {daysInRange.length > workingDays.length && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    {daysInRange.length - workingDays.length} weekend {daysInRange.length - workingDays.length === 1 ? 'day' : 'days'} excluded
                  </p>
                )}
              </div>
            )}

            {/* Summary bar */}
            {workingDays.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total leave days</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#0F766E]">{totalDays}</span>
                  <span className="text-sm text-muted-foreground">{totalDays === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
            )}

            {errors.balance && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{errors.balance}
              </p>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => { setReason(e.target.value); setErrors((er) => ({ ...er, reason: '' })) }}
                rows={3}
                placeholder="Describe the reason for your leave..."
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                {errors.reason ? (
                  <p className="text-xs text-destructive">{errors.reason}</p>
                ) : (
                  <span />
                )}
                <p className={cn(
                  'text-[11px]',
                  reason.length < 10 ? 'text-muted-foreground' : 'text-emerald-600'
                )}>
                  {reason.length} / 10 min
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={apply.isPending}
                className="cursor-pointer px-6"
              >
                {apply.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/leaves')}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

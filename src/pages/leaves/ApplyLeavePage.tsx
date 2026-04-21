import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplyLeave } from '@/hooks/useLeaves'
import { useLeaveBalances } from '@/hooks/useLeaveBalances'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { format, eachDayOfInterval, isWeekend, addDays } from 'date-fns'
import type { DayType, LeaveBalance } from '@/lib/types'
import {
  ChevronRight,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Loader2,
  Info,
  AlertCircle,
  Send,
  Check,
  Paperclip,
  Upload,
  CheckCircle2,
} from 'lucide-react'

const DAY_TYPE_OPTIONS: { value: DayType; label: string; Icon: typeof Sun }[] = [
  { value: 'FULL_DAY', label: 'Full', Icon: Sun },
  { value: 'HALF_DAY_AM', label: 'AM', Icon: Sunrise },
  { value: 'HALF_DAY_PM', label: 'PM', Icon: Sunset },
]

function initials(name?: string | null) {
  if (!name) return '—'
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Pill({
  tone = 'neutral',
  Icon,
  children,
}: {
  tone?: 'neutral' | 'brand' | 'good' | 'warn'
  Icon?: typeof Sun
  children: React.ReactNode
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-muted text-muted-foreground border-border',
    brand: 'bg-primary/10 text-brand-ink border-primary/20',
    good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warn: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[11px] font-semibold',
        tones[tone]
      )}
    >
      {Icon && <Icon className="h-[11px] w-[11px]" />}
      {children}
    </span>
  )
}

function BalanceCard({
  balance,
  selected,
  onClick,
}: {
  balance: LeaveBalance
  selected: boolean
  onClick: () => void
}) {
  const pct = balance.total_entitled > 0 ? (balance.remaining_days / balance.total_entitled) * 100 : 0
  const barClass =
    pct > 50 ? 'bg-primary' : pct > 25 ? 'bg-amber-600' : 'bg-red-600'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border p-3 text-left transition-all cursor-pointer',
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
          : 'border-border bg-white hover:border-primary/40'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-[12px] font-semibold truncate pr-2">{balance.leave_type.name}</div>
        {selected && <Check className="h-[13px] w-[13px] text-primary shrink-0" />}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[22px] font-extrabold tracking-tight leading-none">
          {balance.remaining_days}
        </span>
        <span className="text-[11px] text-muted-foreground">of {balance.total_entitled} days</span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden mt-1.5">
        <div
          className={cn('h-full rounded-full transition-all', barClass)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </button>
  )
}

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
            <o.Icon className="h-[13px] w-[13px]" />
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  )
}

export default function ApplyLeavePage() {
  const navigate = useNavigate()
  const apply = useApplyLeave()
  const { data: balances } = useLeaveBalances()
  const addToast = useNotificationStore((s) => s.addToast)
  const user = useAuthStore((s) => s.user)

  const [leaveTypeId, setLeaveTypeId] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [reason, setReason] = useState('')
  const [dayTypes, setDayTypes] = useState<Record<string, DayType>>({})
  const [attached, setAttached] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedBalance = balances?.find((b) => b.leave_type.id === leaveTypeId)
  const allowsHalfDay = selectedBalance?.leave_type.allows_half_day ?? false
  const requiresDoc = selectedBalance?.leave_type.requires_document ?? false

  const daysInRange = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return []
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [startDate, endDate])

  const workingDays = useMemo(() => daysInRange.filter((d) => !isWeekend(d)), [daysInRange])

  const totalDays = useMemo(() => {
    return workingDays.reduce((sum, day) => {
      const key = format(day, 'yyyy-MM-dd')
      const type = dayTypes[key] || 'FULL_DAY'
      return sum + (type === 'FULL_DAY' ? 1 : 0.5)
    }, 0)
  }, [workingDays, dayTypes])

  const setDayType = (key: string, type: DayType) =>
    setDayTypes((prev) => ({ ...prev, [key]: type }))

  const setAllDayTypes = (type: DayType) => {
    const updated: Record<string, DayType> = {}
    workingDays.forEach((d) => {
      updated[format(d, 'yyyy-MM-dd')] = type
    })
    setDayTypes(updated)
  }

  const handleStartDate = (date: Date | undefined) => {
    setStartDate(date)
    setDayTypes({})
    if (date && endDate && endDate < date) setEndDate(undefined)
  }

  const handleEndDate = (date: Date | undefined) => {
    setEndDate(date)
    setDayTypes({})
  }

  const applyPreset = (days: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = today
    const end = addDays(today, days - 1)
    setStartDate(start)
    setEndDate(end)
    setDayTypes({})
  }

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
      return { leave_date: key, day_type: dayTypes[key] || 'FULL_DAY' }
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
          addToast({
            title: 'Leave applied',
            description: 'Your application has been submitted.',
            variant: 'success',
          })
          navigate('/leaves')
        },
        onError: () => {
          addToast({
            title: 'Error',
            description: 'Failed to submit leave application.',
            variant: 'destructive',
          })
        },
      }
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const manager = user?.manager
  const approverName = manager?.full_name ?? 'Your line manager'
  const approverRole = manager?.designation?.title ?? 'Approver'
  const balanceAfter = selectedBalance ? selectedBalance.remaining_days - totalDays : null

  return (
    <form onSubmit={handleSubmit} className="max-w-[1060px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-2">
        <span>Leaves</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/70">Apply</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-6 mb-7">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight">Apply for leave</h1>
          <p className="text-[13.5px] text-muted-foreground mt-1">
            Tell us when you'll be away and we'll route it to your approver.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/leaves')}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main column */}
        <div className="space-y-6">
          {/* Leave type */}
          <section className="rounded-[14px] border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[15px] font-bold">Leave type</div>
                <div className="text-[12px] text-muted-foreground">
                  Choose from your available balances
                </div>
              </div>
            </div>

            {balances && balances.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {balances.map((b) => (
                  <BalanceCard
                    key={b.leave_type.id}
                    balance={b}
                    selected={leaveTypeId === b.leave_type.id}
                    onClick={() => {
                      setLeaveTypeId(b.leave_type.id)
                      setErrors((e) => ({ ...e, leaveType: '' }))
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-[13px] text-muted-foreground py-6 text-center">
                No leave balances available.
              </div>
            )}

            {errors.leaveType && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-3">
                <AlertCircle className="h-3 w-3" />
                {errors.leaveType}
              </p>
            )}

            {selectedBalance && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-3.5 py-2.5">
                <Info className="h-[15px] w-[15px] text-primary shrink-0" />
                <div className="text-[12.5px]">
                  <span className="font-semibold text-brand-ink">
                    {selectedBalance.leave_type.name}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    · {selectedBalance.remaining_days} of {selectedBalance.total_entitled} days
                    remaining
                  </span>
                </div>
                <div className="ml-auto flex gap-1">
                  {selectedBalance.leave_type.allows_half_day && (
                    <Pill tone="brand">Half-day OK</Pill>
                  )}
                  {selectedBalance.leave_type.requires_document && (
                    <Pill tone="warn" Icon={Paperclip}>
                      Document needed
                    </Pill>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Dates + day details */}
          <section className="rounded-[14px] border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-bold">Dates</div>
              <div className="flex gap-1.5">
                {[
                  { label: '2 days', days: 2 },
                  { label: '3 days', days: 3 },
                  { label: '1 week', days: 7 },
                ].map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => applyPreset(q.days)}
                    className="text-[11px] font-semibold px-2 py-1 rounded-md border border-border hover:bg-muted cursor-pointer"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground/80 block">
                  Start date
                </label>
                <DatePicker
                  value={startDate}
                  onChange={handleStartDate}
                  placeholder="Pick a date"
                  minDate={today}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground/80 block">
                  End date
                </label>
                <DatePicker
                  value={endDate}
                  onChange={handleEndDate}
                  placeholder="Pick a date"
                  minDate={startDate || today}
                />
                {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            {workingDays.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[13px]">
                    <Clock className="h-[14px] w-[14px] text-muted-foreground" />
                    <span className="font-semibold">Day-by-day</span>
                    <span className="text-muted-foreground">
                      · {workingDays.length} working {workingDays.length === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  {allowsHalfDay && workingDays.length > 1 && (
                    <div className="flex gap-1.5 text-[11px] items-center">
                      <span className="text-muted-foreground">Apply to all:</span>
                      {DAY_TYPE_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setAllDayTypes(o.value)}
                          className="px-2 py-[3px] rounded-md border border-border font-semibold hover:bg-muted flex items-center gap-1 cursor-pointer"
                        >
                          <o.Icon className="h-[11px] w-[11px]" />
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border/60">
                  {workingDays.map((d) => {
                    const k = format(d, 'yyyy-MM-dd')
                    const t = dayTypes[k] || 'FULL_DAY'
                    return (
                      <div key={k} className="flex items-center gap-3 px-4 py-3 bg-white">
                        <div className="w-10 text-center shrink-0">
                          <div className="text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                            {format(d, 'EEE')}
                          </div>
                          <div className="text-[18px] font-extrabold leading-none">
                            {format(d, 'd')}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold truncate">
                            {format(d, 'EEEE, d MMMM yyyy')}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-muted-foreground">
                              {t === 'FULL_DAY' ? '1 day' : '0.5 day'}
                            </span>
                          </div>
                        </div>
                        {allowsHalfDay ? (
                          <Segmented
                            value={t}
                            onChange={(v) => setDayType(k, v)}
                            options={DAY_TYPE_OPTIONS}
                          />
                        ) : (
                          <Pill tone="neutral">Full day only</Pill>
                        )}
                      </div>
                    )
                  })}
                </div>

                {daysInRange.length > workingDays.length && (
                  <div className="mt-2 text-[11.5px] text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    Weekends in range are skipped automatically.
                  </div>
                )}
              </div>
            )}

            {errors.balance && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-3">
                <AlertCircle className="h-3 w-3" />
                {errors.balance}
              </p>
            )}
          </section>

          {/* Reason */}
          <section className="rounded-[14px] border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[15px] font-bold">Reason</div>
              <span
                className={cn(
                  'text-[11px]',
                  reason.length < 10 ? 'text-muted-foreground' : 'text-emerald-600'
                )}
              >
                {reason.length} / 10 min
              </span>
            </div>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setErrors((er) => ({ ...er, reason: '' }))
              }}
              rows={3}
              placeholder="Short note — where you'll be, coverage, etc."
              className="resize-none text-[13.5px]"
            />
            {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason}</p>}

            {requiresDoc && (
              <div className="mt-3 rounded-lg border border-dashed border-border px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Upload className="h-[15px] w-[15px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Attach supporting document</div>
                  <div className="text-[11.5px] text-muted-foreground">
                    PDF or image · up to 5 MB · required for{' '}
                    {selectedBalance?.leave_type.name.toLowerCase()}
                  </div>
                </div>
                <Button
                  type="button"
                  variant={attached ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => setAttached((a) => !a)}
                  className="cursor-pointer"
                >
                  {attached ? (
                    <>
                      <Check className="h-[13px] w-[13px]" />
                      Attached
                    </>
                  ) : (
                    'Browse'
                  )}
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <div className="rounded-[14px] border border-border bg-white p-4">
            <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-3">
              Summary
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold tracking-tighter leading-none text-primary">
                {totalDays}
              </span>
              <span className="text-[13px] text-foreground/70 font-semibold">
                {totalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="text-[11.5px] text-muted-foreground mt-1">
              {selectedBalance?.leave_type.name || '—'}
            </div>
            <div className="h-px bg-border my-3" />
            <div className="space-y-1.5 text-[12.5px]">
              <Row label="From">
                <span className="font-mono">
                  {startDate ? format(startDate, 'yyyy-MM-dd') : '—'}
                </span>
              </Row>
              <Row label="Until">
                <span className="font-mono">{endDate ? format(endDate, 'yyyy-MM-dd') : '—'}</span>
              </Row>
              <Row label="Working days">{workingDays.length}</Row>
              <Row label="Weekends skipped">{daysInRange.length - workingDays.length}</Row>
              <Row label="Balance after">
                {balanceAfter !== null ? `${balanceAfter} days` : '—'}
              </Row>
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-white p-4">
            <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-3">
              Approval flow
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold bg-primary/10 text-brand-ink">
                {initials(manager?.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold truncate">{approverName}</div>
                <div className="text-[11.5px] text-muted-foreground truncate">{approverRole}</div>
              </div>
              <Pill tone="good" Icon={Check}>
                Auto
              </Pill>
            </div>
            <div className="text-[11.5px] text-muted-foreground mt-3 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Typical response: under 4 hours
            </div>
          </div>

          <Button
            type="submit"
            disabled={apply.isPending}
            className="w-full cursor-pointer"
            style={{ height: 46, fontSize: 14 }}
          >
            {apply.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-[15px] w-[15px]" />
                Submit application
              </>
            )}
          </Button>
          {apply.isSuccess && (
            <div className="text-[11.5px] text-emerald-600 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Sent to {approverName}
            </div>
          )}
        </aside>
      </div>
    </form>
  )
}

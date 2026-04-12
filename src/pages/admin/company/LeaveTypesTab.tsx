import { useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateLeaveType, useUpdateLeaveType } from '@/hooks/useAdmin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/stores/notificationStore'
import { ListChecks, Pencil, Loader2 } from 'lucide-react'
import { EmptyTab } from './shared'
import type { LeaveType } from '@/lib/types'

const leaveTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  default_days_tier1: z.coerce.number().min(0, 'Required'),
  default_days_tier2: z.coerce.number().min(0, 'Required'),
  default_days_tier3: z.coerce.number().min(0, 'Required'),
  max_consecutive_days: z.coerce.number().optional(),
  requires_document: z.boolean(),
  allows_half_day: z.boolean(),
  allows_carry_forward: z.boolean(),
  max_carry_forward_days: z.coerce.number().optional(),
  max_times_per_year: z.coerce.number().optional(),
})
type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>

export interface LeaveTypesTabHandle {
  openCreate: () => void
}

interface LeaveTypesTabProps {
  companyId: string
  companyName: string
  leaveTypes: LeaveType[]
  search: string
}

export const LeaveTypesTab = forwardRef<LeaveTypesTabHandle, LeaveTypesTabProps>(
  function LeaveTypesTab({ companyId, companyName, leaveTypes, search }, ref) {
    const createLeaveType = useCreateLeaveType()
    const updateLeaveType = useUpdateLeaveType()
    const addToast = useNotificationStore((s) => s.addToast)

    const [ltOpen, setLtOpen] = useState(false)
    const [editingLt, setEditingLt] = useState<LeaveType | null>(null)
    const [ltRequiresDoc, setLtRequiresDoc] = useState(false)
    const [ltAllowsHalf, setLtAllowsHalf] = useState(false)
    const [ltAllowsCarry, setLtAllowsCarry] = useState(false)
    const [ltCategory, setLtCategory] = useState('')
    const ltForm = useForm<LeaveTypeFormValues>({ resolver: zodResolver(leaveTypeSchema) })

    const q = search.toLowerCase()
    const filtered = leaveTypes.filter((lt) => lt.name.toLowerCase().includes(q))
    const ltPending = createLeaveType.isPending || updateLeaveType.isPending

    useImperativeHandle(ref, () => ({
      openCreate() {
        setEditingLt(null)
        setLtRequiresDoc(false)
        setLtAllowsHalf(false)
        setLtAllowsCarry(false)
        setLtCategory('')
        ltForm.reset({
          name: '', category: '', default_days_tier1: 0, default_days_tier2: 0, default_days_tier3: 0,
          max_consecutive_days: undefined, requires_document: false, allows_half_day: false,
          allows_carry_forward: false, max_carry_forward_days: undefined, max_times_per_year: undefined,
        })
        setLtOpen(true)
      },
    }))

    const openEditLt = (lt: LeaveType) => {
      setEditingLt(lt)
      setLtRequiresDoc(lt.requires_document)
      setLtAllowsHalf(lt.allows_half_day)
      setLtAllowsCarry(lt.allows_carry_forward)
      setLtCategory(lt.category)
      ltForm.reset({
        name: lt.name, category: lt.category,
        default_days_tier1: lt.default_days_tier1, default_days_tier2: lt.default_days_tier2,
        default_days_tier3: lt.default_days_tier3, max_consecutive_days: lt.max_consecutive_days,
        requires_document: lt.requires_document, allows_half_day: lt.allows_half_day,
        allows_carry_forward: lt.allows_carry_forward, max_carry_forward_days: lt.max_carry_forward_days,
        max_times_per_year: lt.max_times_per_year,
      })
      setLtOpen(true)
    }

    const onLtSubmit = (data: LeaveTypeFormValues) => {
      const mutation = editingLt
        ? updateLeaveType.mutateAsync({ id: editingLt.id, ...data })
        : createLeaveType.mutateAsync({ ...data, company_id: companyId })
      mutation
        .then(() => { addToast({ title: editingLt ? 'Leave type updated' : 'Leave type created', variant: 'success' }); setLtOpen(false) })
        .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
    }

    return (
      <>
        {leaveTypes.length === 0 ? (
          <EmptyTab icon={ListChecks} message="No leave types yet" sub="Create leave types to define leave entitlements" />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4">Leave Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Days (T1/T2/T3)</TableHead>
                  <TableHead>Half Day</TableHead>
                  <TableHead>Carry Forward</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lt) => (
                  <TableRow key={lt.id} className="group">
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                          <ListChecks className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <span className="font-medium">{lt.name}</span>
                          {lt.max_consecutive_days && (
                            <p className="text-[11px] text-muted-foreground">Max {lt.max_consecutive_days} consecutive days</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lt.category === 'MANDATORY' ? 'default' : 'outline'}>
                        {lt.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {lt.default_days_tier1} / {lt.default_days_tier2} / {lt.default_days_tier3}
                    </TableCell>
                    <TableCell>
                      {lt.allows_half_day ? (
                        <Badge variant="outline" className="border-[#0F766E]/30 text-[#0F766E] bg-[#0F766E]/5">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lt.allows_carry_forward ? (
                        <span className="text-sm">
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Yes</Badge>
                          {lt.max_carry_forward_days != null && (
                            <span className="text-muted-foreground text-xs ml-1">({lt.max_carry_forward_days}d max)</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lt.requires_document ? (
                        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Required</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lt.is_active ? 'success' : 'secondary'}>
                        {lt.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditLt(lt)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Leave Type Dialog */}
        <Dialog open={ltOpen} onOpenChange={setLtOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLt ? 'Edit Leave Type' : 'New Leave Type'}</DialogTitle>
              <DialogDescription>
                {editingLt ? 'Update the leave type details.' : `Create a leave type for ${companyName}.`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={ltForm.handleSubmit(onLtSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lt-name">Leave Type Name</Label>
                  <Input id="lt-name" placeholder="e.g. Annual Leave" {...ltForm.register('name')} />
                  {ltForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{ltForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Combobox
                    options={[
                      { value: 'MANDATORY', label: 'Mandatory' },
                      { value: 'SPECIAL', label: 'Special' },
                    ]}
                    value={ltCategory}
                    onValueChange={(v) => { setLtCategory(v); ltForm.setValue('category', v) }}
                    placeholder="Select category"
                    searchPlaceholder="Search..."
                  />
                  {ltForm.formState.errors.category && (
                    <p className="text-xs text-destructive">{ltForm.formState.errors.category.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Default Days per Tier</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="lt-t1" className="text-xs text-muted-foreground">Tier 1 (0-2 yrs)</Label>
                    <Input id="lt-t1" type="number" min={0} {...ltForm.register('default_days_tier1')} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lt-t2" className="text-xs text-muted-foreground">Tier 2 (2-5 yrs)</Label>
                    <Input id="lt-t2" type="number" min={0} {...ltForm.register('default_days_tier2')} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lt-t3" className="text-xs text-muted-foreground">Tier 3 (5+ yrs)</Label>
                    <Input id="lt-t3" type="number" min={0} {...ltForm.register('default_days_tier3')} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lt-maxcons">Max Consecutive Days</Label>
                  <Input id="lt-maxcons" type="number" min={0} placeholder="No limit" {...ltForm.register('max_consecutive_days')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lt-maxtimes">Max Times Per Year</Label>
                  <Input id="lt-maxtimes" type="number" min={0} placeholder="No limit" {...ltForm.register('max_times_per_year')} />
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lt-halfd"
                    checked={ltAllowsHalf}
                    onChange={(e) => { setLtAllowsHalf(e.target.checked); ltForm.setValue('allows_half_day', e.target.checked) }}
                    className="h-4 w-4 rounded border-gray-300 text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                  />
                  <Label htmlFor="lt-halfd" className="cursor-pointer">Allows half-day leave</Label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lt-doc"
                    checked={ltRequiresDoc}
                    onChange={(e) => { setLtRequiresDoc(e.target.checked); ltForm.setValue('requires_document', e.target.checked) }}
                    className="h-4 w-4 rounded border-gray-300 text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                  />
                  <Label htmlFor="lt-doc" className="cursor-pointer">Requires supporting document</Label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lt-carry"
                    checked={ltAllowsCarry}
                    onChange={(e) => { setLtAllowsCarry(e.target.checked); ltForm.setValue('allows_carry_forward', e.target.checked) }}
                    className="h-4 w-4 rounded border-gray-300 text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                  />
                  <Label htmlFor="lt-carry" className="cursor-pointer">Allows carry forward to next year</Label>
                </div>
                {ltAllowsCarry && (
                  <div className="space-y-2 ml-7">
                    <Label htmlFor="lt-maxcarry" className="text-xs text-muted-foreground">Max carry forward days</Label>
                    <Input id="lt-maxcarry" type="number" min={0} placeholder="No limit" className="max-w-[200px]" {...ltForm.register('max_carry_forward_days')} />
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setLtOpen(false)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={ltPending} className="cursor-pointer">
                  {ltPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingLt ? 'Save Changes' : 'Create Leave Type'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

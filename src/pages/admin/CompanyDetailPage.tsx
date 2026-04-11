import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useAdminCompany,
  useAdminUsers,
  useAdminAgencies,
  useAdminDepartments,
  useAdminDesignations,
  useAdminWorkSchedules,
  useAdminPublicHolidays,
  useAdminLeaveApplications,
  useUpdateCompany,
  useCreateUser,
  useCreateDepartment,
  useUpdateDepartment,
  useCreateDesignation,
  useUpdateDesignation,
  useCreateWorkSchedule,
  useUpdateWorkSchedule,
  useAdminLeaveTypes,
  useCreateLeaveType,
  useUpdateLeaveType,
} from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatDate, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { LeaveStatus, Department, Designation, WorkSchedule, LeaveType } from '@/lib/types'
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  FileText,
  Shield,
  Users,
  Plus,
  Pencil,
  Loader2,
  Search,
  FolderTree,
  Briefcase,
  Clock,
  CalendarDays,
  FileCheck,
  Phone,
  Globe,
  Factory,
  Calendar,
  UserCheck,
  ListChecks,
} from 'lucide-react'

// ─── Schemas ──────────────────────────────────────────────

const companySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  registration_number: z.string().optional(),
  hr_email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  logo_url: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  agency_id: z.string().optional(),
  financial_year_start: z.coerce.number().min(1).max(12).optional(),
  probation_months: z.coerce.number().min(0).optional(),
})
type CompanyFormValues = z.infer<typeof companySchema>

const userSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role: z.string().min(1, 'Role is required'),
  employee_id: z.string().optional(),
  phone: z.string().optional(),
  join_date: z.string().optional(),
})
type UserFormValues = z.infer<typeof userSchema>

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})
type DepartmentFormValues = z.infer<typeof departmentSchema>

const designationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  is_manager: z.boolean(),
})
type DesignationFormValues = z.infer<typeof designationSchema>

const workScheduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_time: z.string().min(1, 'Required'),
  end_time: z.string().min(1, 'Required'),
  break_start: z.string().optional(),
  break_end: z.string().optional(),
  rest_days: z.string().optional(),
})
type WorkScheduleFormValues = z.infer<typeof workScheduleSchema>

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

// ─── Tab definition ───────────────────────────────────────

const tabs = [
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'departments', label: 'Departments', icon: FolderTree },
  { key: 'designations', label: 'Designations', icon: Briefcase },
  { key: 'schedules', label: 'Work Schedules', icon: Clock },
  { key: 'leave_types', label: 'Leave Types', icon: ListChecks },
  { key: 'holidays', label: 'Public Holidays', icon: CalendarDays },
  { key: 'leaves', label: 'Leave Applications', icon: FileCheck },
] as const

type TabKey = (typeof tabs)[number]['key']

// ─── Component ────────────────────────────────────────────

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: company, isLoading } = useAdminCompany(id!)
  const { data: allUsers } = useAdminUsers()
  const { data: agencies } = useAdminAgencies()
  const { data: allDepartments } = useAdminDepartments({ company_id: id! })
  const { data: allDesignations } = useAdminDesignations({ company_id: id! })
  const { data: allWorkSchedules } = useAdminWorkSchedules({ company_id: id! })
  const { data: allHolidays } = useAdminPublicHolidays()
  const { data: allLeaveApps } = useAdminLeaveApplications({ company_id: id! })
  const { data: allLeaveTypes } = useAdminLeaveTypes({ company_id: id! })

  const updateCompany = useUpdateCompany()
  const createUser = useCreateUser()
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()
  const createDesignation = useCreateDesignation()
  const updateDesignation = useUpdateDesignation()
  const createWorkSchedule = useCreateWorkSchedule()
  const updateWorkSchedule = useUpdateWorkSchedule()
  const createLeaveType = useCreateLeaveType()
  const updateLeaveType = useUpdateLeaveType()
  const addToast = useNotificationStore((s) => s.addToast)

  const [activeTab, setActiveTab] = useState<TabKey>('employees')
  const [search, setSearch] = useState('')

  // Edit company state
  const [editOpen, setEditOpen] = useState(false)
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const editForm = useForm<CompanyFormValues>({ resolver: zodResolver(companySchema) })

  // Add employee state
  const [userOpen, setUserOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const userForm = useForm<UserFormValues>({ resolver: zodResolver(userSchema) })

  // Department state
  const [deptOpen, setDeptOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const deptForm = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentSchema) })

  // Designation state
  const [desigOpen, setDesigOpen] = useState(false)
  const [editingDesig, setEditingDesig] = useState<Designation | null>(null)
  const [isManager, setIsManager] = useState(false)
  const desigForm = useForm<DesignationFormValues>({ resolver: zodResolver(designationSchema) })

  // Work schedule state
  const [schedOpen, setSchedOpen] = useState(false)
  const [editingSched, setEditingSched] = useState<WorkSchedule | null>(null)
  const schedForm = useForm<WorkScheduleFormValues>({ resolver: zodResolver(workScheduleSchema) })

  // Leave type state
  const [ltOpen, setLtOpen] = useState(false)
  const [editingLt, setEditingLt] = useState<LeaveType | null>(null)
  const [ltRequiresDoc, setLtRequiresDoc] = useState(false)
  const [ltAllowsHalf, setLtAllowsHalf] = useState(false)
  const [ltAllowsCarry, setLtAllowsCarry] = useState(false)
  const [ltCategory, setLtCategory] = useState('')
  const ltForm = useForm<LeaveTypeFormValues>({ resolver: zodResolver(leaveTypeSchema) })

  // ─── Handlers ─────────────────────────────────────────

  const openEdit = () => {
    if (!company) return
    setSelectedAgencyId(company.agency_id ?? '')
    editForm.reset({
      name: company.name,
      registration_number: company.registration_number ?? '',
      hr_email: company.hr_email,
      phone: company.phone ?? '',
      website: company.website ?? '',
      industry: company.industry ?? '',
      company_size: company.company_size ?? '',
      logo_url: company.logo_url ?? '',
      address: company.address ?? '',
      state: company.state ?? '',
      agency_id: company.agency_id ?? '',
      financial_year_start: company.financial_year_start,
      probation_months: company.probation_months,
    })
    setEditOpen(true)
  }

  const onEditSubmit = (data: CompanyFormValues) => {
    updateCompany.mutateAsync({ id: id!, ...data })
      .then(() => { addToast({ title: 'Company updated', variant: 'success' }); setEditOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  const openCreateUser = () => {
    setSelectedRole('')
    userForm.reset({ full_name: '', email: '', password: '', role: '', employee_id: '', phone: '', join_date: '' })
    setUserOpen(true)
  }

  const onUserSubmit = (data: UserFormValues) => {
    const payload = {
      ...data,
      company_id: id,
      employee_id: data.employee_id || undefined,
      phone: data.phone || undefined,
      join_date: data.join_date || undefined,
    }
    createUser.mutateAsync(payload)
      .then(() => { addToast({ title: 'Employee added', variant: 'success' }); setUserOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  // Department
  const openCreateDept = () => {
    setEditingDept(null)
    deptForm.reset({ name: '' })
    setDeptOpen(true)
  }
  const openEditDept = (dept: Department) => {
    setEditingDept(dept)
    deptForm.reset({ name: dept.name })
    setDeptOpen(true)
  }
  const onDeptSubmit = (data: DepartmentFormValues) => {
    const mutation = editingDept
      ? updateDepartment.mutateAsync({ id: editingDept.id, ...data })
      : createDepartment.mutateAsync({ ...data, company_id: id })
    mutation
      .then(() => { addToast({ title: editingDept ? 'Department updated' : 'Department created', variant: 'success' }); setDeptOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  // Designation
  const openCreateDesig = () => {
    setEditingDesig(null)
    setIsManager(false)
    desigForm.reset({ title: '', is_manager: false })
    setDesigOpen(true)
  }
  const openEditDesig = (desig: Designation) => {
    setEditingDesig(desig)
    setIsManager(desig.is_manager)
    desigForm.reset({ title: desig.title, is_manager: desig.is_manager })
    setDesigOpen(true)
  }
  const onDesigSubmit = (data: DesignationFormValues) => {
    const mutation = editingDesig
      ? updateDesignation.mutateAsync({ id: editingDesig.id, ...data })
      : createDesignation.mutateAsync({ ...data, company_id: id })
    mutation
      .then(() => { addToast({ title: editingDesig ? 'Designation updated' : 'Designation created', variant: 'success' }); setDesigOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  // Work Schedule
  const openCreateSched = () => {
    setEditingSched(null)
    schedForm.reset({ name: '', start_time: '', end_time: '', break_start: '', break_end: '', rest_days: '' })
    setSchedOpen(true)
  }
  const openEditSched = (sched: WorkSchedule) => {
    setEditingSched(sched)
    schedForm.reset({
      name: sched.name,
      start_time: sched.start_time,
      end_time: sched.end_time,
      break_start: sched.break_start ?? '',
      break_end: sched.break_end ?? '',
      rest_days: sched.rest_days ?? '',
    })
    setSchedOpen(true)
  }
  const onSchedSubmit = (data: WorkScheduleFormValues) => {
    const mutation = editingSched
      ? updateWorkSchedule.mutateAsync({ id: editingSched.id, ...data })
      : createWorkSchedule.mutateAsync({ ...data, company_id: id })
    mutation
      .then(() => { addToast({ title: editingSched ? 'Schedule updated' : 'Schedule created', variant: 'success' }); setSchedOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  // Leave Type
  const openCreateLt = () => {
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
  }
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
      : createLeaveType.mutateAsync({ ...data, company_id: id })
    mutation
      .then(() => { addToast({ title: editingLt ? 'Leave type updated' : 'Leave type created', variant: 'success' }); setLtOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }
  const ltPending = createLeaveType.isPending || updateLeaveType.isPending

  // ─── Derived data ─────────────────────────────────────

  if (isLoading) return <LoadingSpinner className="py-12" />
  if (!company) return <p className="py-12 text-center text-muted-foreground">Company not found</p>

  const agencyName = agencies?.find((a) => a.id === company.agency_id)?.name
  const employees = allUsers?.filter((u) => u.company_id === id) ?? []
  const departments = allDepartments?.filter((d) => d.company_id === id) ?? []
  const designations = allDesignations?.filter((d) => d.company_id === id) ?? []
  const workSchedules = allWorkSchedules?.filter((ws) => ws.company_id === id) ?? []
  const holidays = allHolidays?.filter((h) => h.company_id === id) ?? []
  const leaveApps = allLeaveApps ?? []
  const leaveTypes = allLeaveTypes ?? []

  const q = search.toLowerCase()
  const filteredEmployees = employees.filter((u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  const filteredDepts = departments.filter((d) => d.name.toLowerCase().includes(q))
  const filteredDesigs = designations.filter((d) => d.title.toLowerCase().includes(q))
  const filteredScheds = workSchedules.filter((ws) => ws.name.toLowerCase().includes(q))
  const filteredLeaveTypes = leaveTypes.filter((lt) => lt.name.toLowerCase().includes(q))
  const filteredHolidays = holidays.filter((h) => h.name.toLowerCase().includes(q))
  const filteredLeaves = leaveApps.filter((la) => la.user?.full_name?.toLowerCase().includes(q) || la.leave_type?.name?.toLowerCase().includes(q))

  const deptPending = createDepartment.isPending || updateDepartment.isPending
  const desigPending = createDesignation.isPending || updateDesignation.isPending
  const schedPending = createWorkSchedule.isPending || updateWorkSchedule.isPending

  // ─── Render ───────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Companies
      </Link>

      {/* Company info header */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] px-6 py-6 overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-bold tracking-tight text-white">{company.name}</h1>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${company.is_active ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/15 text-white/70'}`}>
                      {company.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {agencyName ? (
                    <p className="text-sm text-white/70 mt-0.5">
                      Managed by <span className="text-white/90 font-medium">{agencyName}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-white/70 mt-0.5">Independent company</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openEdit}
                className="cursor-pointer border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>

          {/* Info grid — row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
            <InfoTile icon={Mail} color="bg-blue-50 text-blue-600" label="HR Email" value={company.hr_email} />
            <InfoTile icon={Phone} color="bg-indigo-50 text-indigo-600" label="Phone" value={company.phone} />
            <InfoTile icon={FileText} color="bg-slate-50 text-slate-600" label="Reg. No." value={company.registration_number} />
            <InfoTile icon={Shield} color="bg-[#0F766E]/10 text-[#0F766E]" label="Agency" value={agencyName || 'None'} />
          </div>

          {/* Info grid — row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-t">
            <InfoTile icon={MapPin} color="bg-emerald-50 text-emerald-600" label="Location" value={[company.address, company.state].filter(Boolean).join(', ')} />
            <InfoTile icon={Factory} color="bg-orange-50 text-orange-600" label="Industry" value={company.industry} />
            <InfoTile icon={Users} color="bg-violet-50 text-violet-600" label="Company Size" value={company.company_size} />
            <InfoTile icon={Globe} color="bg-cyan-50 text-cyan-600" label="Website" value={company.website} />
          </div>

          {/* Info grid — row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-t">
            <InfoTile icon={Calendar} color="bg-pink-50 text-pink-600" label="Financial Year Start" value={company.financial_year_start ? MONTH_NAMES[company.financial_year_start - 1] : undefined} />
            <InfoTile icon={UserCheck} color="bg-amber-50 text-amber-600" label="Probation Period" value={company.probation_months != null ? `${company.probation_months} months` : undefined} />
            <InfoTile icon={CalendarDays} color="bg-rose-50 text-rose-600" label="Created" value={safeFormatDate(company.created_at)} />
            <InfoTile icon={CalendarDays} color="bg-gray-50 text-gray-500" label="Last Updated" value={safeFormatDate(company.updated_at)} />
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Employees', value: employees.length, color: 'bg-[#0F766E]/10 text-[#0F766E]', icon: Users },
          { label: 'Departments', value: departments.length, color: 'bg-purple-50 text-purple-600', icon: FolderTree },
          { label: 'Designations', value: designations.length, color: 'bg-blue-50 text-blue-600', icon: Briefcase },
          { label: 'Leave Types', value: leaveTypes.length, color: 'bg-teal-50 text-teal-600', icon: ListChecks },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + Content */}
      <Card className="border-0 shadow-sm bg-white">
        {/* Tab bar */}
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSearch('') }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer',
                  activeTab === key
                    ? 'border-[#1E40AF] text-[#1E40AF]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab header with search + action */}
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {activeTab === 'employees' && (
            <Button size="sm" onClick={openCreateUser} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />Add Employee
            </Button>
          )}
          {activeTab === 'departments' && (
            <Button size="sm" onClick={openCreateDept} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />Add Department
            </Button>
          )}
          {activeTab === 'designations' && (
            <Button size="sm" onClick={openCreateDesig} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />Add Designation
            </Button>
          )}
          {activeTab === 'schedules' && (
            <Button size="sm" onClick={openCreateSched} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />Add Schedule
            </Button>
          )}
          {activeTab === 'leave_types' && (
            <Button size="sm" onClick={openCreateLt} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />Add Leave Type
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {/* ── Employees Tab ── */}
          {activeTab === 'employees' && (
            employees.length === 0 ? (
              <EmptyTab icon={Users} message="No employees yet" sub="Add an employee to get started" />
            ) : filteredEmployees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Employee</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                              {getInitials(user.full_name)}
                            </div>
                            <span className="font-medium">{user.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === 'ADMIN'
                                ? 'border-[#0F766E]/30 text-[#0F766E] bg-[#0F766E]/5'
                                : user.role === 'MANAGER'
                                  ? 'border-blue-200 text-blue-700 bg-blue-50'
                                  : ''
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.department?.name ?? '\u2014'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.join_date ? formatDate(user.join_date) : '\u2014'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'success' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {/* ── Departments Tab ── */}
          {activeTab === 'departments' && (
            departments.length === 0 ? (
              <EmptyTab icon={FolderTree} message="No departments yet" sub="Create departments to organise employees" />
            ) : filteredDepts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Department</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepts.map((dept) => {
                      const count = employees.filter((u) => u.department_id === dept.id).length
                      return (
                        <TableRow key={dept.id} className="group">
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                                <FolderTree className="h-4 w-4 text-purple-600" />
                              </div>
                              <span className="font-medium">{dept.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {count} {count === 1 ? 'employee' : 'employees'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={dept.is_active ? 'success' : 'secondary'}>
                              {dept.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDept(dept)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {/* ── Designations Tab ── */}
          {activeTab === 'designations' && (
            designations.length === 0 ? (
              <EmptyTab icon={Briefcase} message="No designations yet" sub="Create designations to define employee roles" />
            ) : filteredDesigs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Title</TableHead>
                      <TableHead>Manager Level</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDesigs.map((desig) => {
                      const count = employees.filter((u) => u.designation_id === desig.id).length
                      return (
                        <TableRow key={desig.id} className="group">
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <Briefcase className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{desig.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {desig.is_manager ? (
                              <Badge variant="outline" className="border-[#0F766E]/30 text-[#0F766E] bg-[#0F766E]/5">
                                Yes
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {count} {count === 1 ? 'employee' : 'employees'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={desig.is_active ? 'success' : 'secondary'}>
                              {desig.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDesig(desig)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {/* ── Work Schedules Tab ── */}
          {activeTab === 'schedules' && (
            workSchedules.length === 0 ? (
              <EmptyTab icon={Clock} message="No work schedules yet" sub="Define working hours for employees" />
            ) : filteredScheds.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Schedule</TableHead>
                      <TableHead>Working Hours</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Rest Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScheds.map((sched) => (
                      <TableRow key={sched.id} className="group">
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                              <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <span className="font-medium">{sched.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sched.start_time} - {sched.end_time}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sched.break_start && sched.break_end
                            ? `${sched.break_start} - ${sched.break_end}`
                            : '\u2014'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sched.rest_days || '\u2014'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={sched.is_active ? 'success' : 'secondary'}>
                            {sched.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditSched(sched)}
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
            )
          )}

          {/* ── Leave Types Tab ── */}
          {activeTab === 'leave_types' && (
            leaveTypes.length === 0 ? (
              <EmptyTab icon={ListChecks} message="No leave types yet" sub="Create leave types to define leave entitlements" />
            ) : filteredLeaveTypes.length === 0 ? (
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
                    {filteredLeaveTypes.map((lt) => (
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
            )
          )}

          {/* ── Public Holidays Tab ── */}
          {activeTab === 'holidays' && (
            holidays.length === 0 ? (
              <EmptyTab icon={CalendarDays} message="No public holidays" sub="Holidays are managed in the Holidays section" />
            ) : filteredHolidays.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Holiday</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Replacement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHolidays.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50">
                              <CalendarDays className="h-4 w-4 text-pink-600" />
                            </div>
                            <span className="font-medium">{h.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(h.holiday_date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={h.is_mandatory ? 'default' : 'outline'}>
                            {h.is_mandatory ? 'Mandatory' : 'Optional'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {h.is_replacement ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {/* ── Leave Applications Tab ── */}
          {activeTab === 'leaves' && (
            leaveApps.length === 0 ? (
              <EmptyTab icon={FileCheck} message="No leave applications" sub="Leave applications will appear here" />
            ) : filteredLeaves.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-4">Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves.map((la) => (
                      <TableRow key={la.id}>
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                              {la.user ? getInitials(la.user.full_name) : '?'}
                            </div>
                            <span className="font-medium">{la.user?.full_name ?? 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {la.leave_type?.name ?? '\u2014'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(la.start_date)}
                          {la.end_date !== la.start_date && ` - ${formatDate(la.end_date)}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {la.total_days} {la.total_days === 1 ? 'day' : 'days'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={la.status as LeaveStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* ─── Dialogs ─────────────────────────────────────── */}

      {/* Edit Company Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-name">Company Name</Label>
                <Input id="ed-name" {...editForm.register('name')} />
                {editForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-reg">Registration Number</Label>
                <Input id="ed-reg" {...editForm.register('registration_number')} />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-email">HR Email</Label>
                <Input id="ed-email" type="email" {...editForm.register('hr_email')} />
                {editForm.formState.errors.hr_email && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.hr_email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-phone">Phone</Label>
                <Input id="ed-phone" placeholder="+60 3-1234 5678" {...editForm.register('phone')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-website">Website</Label>
                <Input id="ed-website" placeholder="https://company.com" {...editForm.register('website')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-logo">Logo URL</Label>
                <Input id="ed-logo" placeholder="https://..." {...editForm.register('logo_url')} />
              </div>
            </div>

            {/* Business */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-industry">Industry</Label>
                <Input id="ed-industry" placeholder="e.g. Technology, Healthcare" {...editForm.register('industry')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-size">Company Size</Label>
                <Input id="ed-size" placeholder="e.g. 1-50, 51-200, 201-500" {...editForm.register('company_size')} />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-address">Address</Label>
                <Input id="ed-address" {...editForm.register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-state">State</Label>
                <Input id="ed-state" {...editForm.register('state')} />
              </div>
            </div>

            {/* Agency */}
            <div className="space-y-2">
              <Label>Agency</Label>
              <Combobox
                options={[
                  { value: 'none', label: 'No agency' },
                  ...(agencies?.map((a) => ({ value: a.id, label: a.name })) ?? []),
                ]}
                value={selectedAgencyId || 'none'}
                onValueChange={(value) => {
                  const agId = value === 'none' ? '' : value
                  setSelectedAgencyId(agId)
                  editForm.setValue('agency_id', agId)
                }}
                placeholder="Select an agency"
                searchPlaceholder="Search agencies..."
              />
            </div>

            {/* HR settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ed-fy">Financial Year Start (month)</Label>
                <Input id="ed-fy" type="number" min={1} max={12} placeholder="1 = January" {...editForm.register('financial_year_start')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-prob">Probation Period (months)</Label>
                <Input id="ed-prob" type="number" min={0} placeholder="e.g. 3" {...editForm.register('probation_months')} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={updateCompany.isPending} className="cursor-pointer">
                {updateCompany.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={userOpen} onOpenChange={setUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Create a new employee for <strong>{company.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usr-name">Full Name</Label>
                <Input id="usr-name" placeholder="John Doe" {...userForm.register('full_name')} />
                {userForm.formState.errors.full_name && (
                  <p className="text-xs text-destructive">{userForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="usr-empid">Employee ID</Label>
                <Input id="usr-empid" placeholder="e.g. EMP-001" {...userForm.register('employee_id')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="usr-email">Email</Label>
              <Input id="usr-email" type="email" placeholder="john@company.com" {...userForm.register('email')} />
              {userForm.formState.errors.email && (
                <p className="text-xs text-destructive">{userForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="usr-pass">Password</Label>
              <Input id="usr-pass" type="password" placeholder="Minimum 8 characters" {...userForm.register('password')} />
              {userForm.formState.errors.password && (
                <p className="text-xs text-destructive">{userForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Combobox
                  options={[
                    { value: 'EMPLOYEE', label: 'Employee' },
                    { value: 'MANAGER', label: 'Manager' },
                    { value: 'ADMIN', label: 'Admin' },
                  ]}
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value)
                    userForm.setValue('role', value)
                  }}
                  placeholder="Select role"
                  searchPlaceholder="Search roles..."
                />
                {userForm.formState.errors.role && (
                  <p className="text-xs text-destructive">{userForm.formState.errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="usr-phone">Phone</Label>
                <Input id="usr-phone" placeholder="+60 12-345 6789" {...userForm.register('phone')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="usr-join">Join Date</Label>
              <Input id="usr-join" type="date" {...userForm.register('join_date')} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setUserOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={createUser.isPending} className="cursor-pointer">
                {createUser.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Department Dialog */}
      <Dialog open={deptOpen} onOpenChange={setDeptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'New Department'}</DialogTitle>
            <DialogDescription>
              {editingDept ? 'Update the department name.' : `Create a department for ${company.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={deptForm.handleSubmit(onDeptSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name</Label>
              <Input id="dept-name" placeholder="e.g. Engineering" {...deptForm.register('name')} />
              {deptForm.formState.errors.name && (
                <p className="text-xs text-destructive">{deptForm.formState.errors.name.message}</p>
              )}
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDeptOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={deptPending} className="cursor-pointer">
                {deptPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingDept ? 'Save Changes' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Designation Dialog */}
      <Dialog open={desigOpen} onOpenChange={setDesigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDesig ? 'Edit Designation' : 'New Designation'}</DialogTitle>
            <DialogDescription>
              {editingDesig ? 'Update the designation details.' : `Create a designation for ${company.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={desigForm.handleSubmit(onDesigSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desig-title">Title</Label>
              <Input id="desig-title" placeholder="e.g. Senior Developer" {...desigForm.register('title')} />
              {desigForm.formState.errors.title && (
                <p className="text-xs text-destructive">{desigForm.formState.errors.title.message}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="desig-manager"
                checked={isManager}
                onChange={(e) => {
                  setIsManager(e.target.checked)
                  desigForm.setValue('is_manager', e.target.checked)
                }}
                className="h-4 w-4 rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF] cursor-pointer"
              />
              <Label htmlFor="desig-manager" className="cursor-pointer">This is a manager-level designation</Label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDesigOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={desigPending} className="cursor-pointer">
                {desigPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingDesig ? 'Save Changes' : 'Create Designation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Work Schedule Dialog */}
      <Dialog open={schedOpen} onOpenChange={setSchedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSched ? 'Edit Work Schedule' : 'New Work Schedule'}</DialogTitle>
            <DialogDescription>
              {editingSched ? 'Update the schedule details.' : `Create a work schedule for ${company.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={schedForm.handleSubmit(onSchedSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sched-name">Schedule Name</Label>
              <Input id="sched-name" placeholder="e.g. Standard Office Hours" {...schedForm.register('name')} />
              {schedForm.formState.errors.name && (
                <p className="text-xs text-destructive">{schedForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sched-start">Start Time</Label>
                <Input id="sched-start" type="time" {...schedForm.register('start_time')} />
                {schedForm.formState.errors.start_time && (
                  <p className="text-xs text-destructive">{schedForm.formState.errors.start_time.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sched-end">End Time</Label>
                <Input id="sched-end" type="time" {...schedForm.register('end_time')} />
                {schedForm.formState.errors.end_time && (
                  <p className="text-xs text-destructive">{schedForm.formState.errors.end_time.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sched-bstart">Break Start</Label>
                <Input id="sched-bstart" type="time" {...schedForm.register('break_start')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sched-bend">Break End</Label>
                <Input id="sched-bend" type="time" {...schedForm.register('break_end')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sched-rest">Rest Days</Label>
              <Input id="sched-rest" placeholder="e.g. Saturday, Sunday" {...schedForm.register('rest_days')} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setSchedOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={schedPending} className="cursor-pointer">
                {schedPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingSched ? 'Save Changes' : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Leave Type Dialog */}
      <Dialog open={ltOpen} onOpenChange={setLtOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLt ? 'Edit Leave Type' : 'New Leave Type'}</DialogTitle>
            <DialogDescription>
              {editingLt ? 'Update the leave type details.' : `Create a leave type for ${company.name}.`}
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

            {/* Days per tier */}
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

            {/* Limits */}
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

            {/* Toggles */}
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
    </div>
  )
}

// ─── Constants ──────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function safeFormatDate(value?: string | null): string | undefined {
  if (!value) return undefined
  try {
    return formatDate(value)
  } catch {
    return undefined
  }
}

// ─── Helper components ──────────────────────────────────

function InfoTile({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: string
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium truncate">{value || '\u2014'}</p>
      </div>
    </div>
  )
}

function EmptyTab({ icon: Icon, message, sub }: { icon: React.ComponentType<{ className?: string }>; message: string; sub: string }) {
  return (
    <div className="text-center py-10">
      <Icon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">{sub}</p>
    </div>
  )
}

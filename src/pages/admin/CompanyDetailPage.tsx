import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useAdminCompany,
  useAdminUsers,
  useAdminAgencies,
  useUpdateCompany,
  useCreateUser,
} from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
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
import { formatDate } from '@/lib/utils'
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
} from 'lucide-react'

// -- Edit company schema --
const companySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  registration_number: z.string().optional(),
  hr_email: z.string().email('Invalid email'),
  address: z.string().optional(),
  state: z.string().optional(),
  agency_id: z.string().optional(),
})
type CompanyFormValues = z.infer<typeof companySchema>

// -- Create user schema --
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

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: company, isLoading } = useAdminCompany(id!)
  const { data: allUsers } = useAdminUsers()
  const { data: agencies } = useAdminAgencies()
  const updateCompany = useUpdateCompany()
  const createUser = useCreateUser()
  const addToast = useNotificationStore((s) => s.addToast)

  const [editOpen, setEditOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  // Edit company form
  const editForm = useForm<CompanyFormValues>({ resolver: zodResolver(companySchema) })

  // Create user form
  const userForm = useForm<UserFormValues>({ resolver: zodResolver(userSchema) })

  const openEdit = () => {
    if (!company) return
    setSelectedAgencyId(company.agency_id ?? '')
    editForm.reset({
      name: company.name,
      registration_number: company.registration_number ?? '',
      hr_email: company.hr_email,
      address: company.address ?? '',
      state: company.state ?? '',
      agency_id: company.agency_id ?? '',
    })
    setEditOpen(true)
  }

  const onEditSubmit = (data: CompanyFormValues) => {
    updateCompany
      .mutateAsync({ id: id!, ...data })
      .then(() => {
        addToast({ title: 'Company updated' })
        setEditOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  const openCreateUser = () => {
    setSelectedRole('')
    userForm.reset({ full_name: '', email: '', password: '', role: '', employee_id: '', phone: '', join_date: '' })
    setUserOpen(true)
  }

  const onUserSubmit = (data: UserFormValues) => {
    createUser
      .mutateAsync({ ...data, company_id: id })
      .then(() => {
        addToast({ title: 'Employee added' })
        setUserOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  if (isLoading) return <LoadingSpinner className="py-12" />
  if (!company) return <p className="py-12 text-center text-muted-foreground">Company not found</p>

  const agencyName = agencies?.find((a) => a.id === company.agency_id)?.name
  const employees = allUsers?.filter((u) => u.company_id === id) ?? []
  const filteredEmployees = employees.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

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
          {/* Banner with title inside */}
          <div className="relative bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] px-6 py-6 overflow-hidden">
            {/* Decorative circles */}
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

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">HR Email</p>
                <p className="text-sm font-medium truncate">{company.hr_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                <FileText className="h-4 w-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Reg. No.</p>
                <p className="text-sm font-medium truncate">{company.registration_number || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <MapPin className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-sm font-medium truncate">
                  {[company.address, company.state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F766E]/10">
                <Shield className="h-4 w-4 text-[#0F766E]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Agency</p>
                <p className="text-sm font-medium truncate">{agencyName || 'None'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F766E]/10">
              <Users className="h-5 w-5 text-[#0F766E]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-xs text-muted-foreground">Total Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employees.filter((u) => u.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employees.filter((u) => !u.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Employees</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employees.length} {employees.length === 1 ? 'employee' : 'employees'} in this company
            </p>
          </div>
          <Button size="sm" onClick={openCreateUser} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search */}
          {employees.length > 0 && (
            <div className="relative max-w-sm mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No employees yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Add an employee to this company to get started
              </p>
            </div>
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
                            {user.full_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
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
                        {user.department?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.join_date ? formatDate(user.join_date) : '—'}
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
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="ed-email">HR Email</Label>
              <Input id="ed-email" type="email" {...editForm.register('hr_email')} />
              {editForm.formState.errors.hr_email && (
                <p className="text-xs text-destructive">{editForm.formState.errors.hr_email.message}</p>
              )}
            </div>
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
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={updateCompany.isPending} className="cursor-pointer">
                {updateCompany.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  'Save Changes'
                )}
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
              <Button type="button" variant="outline" onClick={() => setUserOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={createUser.isPending} className="cursor-pointer">
                {createUser.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>
                ) : (
                  'Add Employee'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

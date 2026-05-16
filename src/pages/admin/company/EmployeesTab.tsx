import { useState, forwardRef, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateUser } from '@/hooks/useAdmin'
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
import { formatDate, getInitials } from '@/lib/utils'
import { Users, Loader2, Eye } from 'lucide-react'
import { EmptyTab } from './shared'
import type { User } from '@/lib/types'

const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role: z.string().min(1, 'Role is required'),
  employee_type: z
    .enum(['PERMANENT', 'CONTRACT', 'PROBATION', 'INTERNSHIP', 'FREELANCE', 'PART_TIME', 'OJT', 'SL1M_OJT'])
    .optional(),
  employee_id: z.string().optional(),
  phone: z.string().optional(),
  join_date: z.string().optional(),
})
type UserFormValues = z.infer<typeof userSchema>

export interface EmployeesTabHandle {
  openCreate: () => void
}

interface EmployeesTabProps {
  companyId: string
  companyName: string
  employees: User[]
  search: string
}

export const EmployeesTab = forwardRef<EmployeesTabHandle, EmployeesTabProps>(
  function EmployeesTab({ companyId, companyName, employees, search }, ref) {
    const createUser = useCreateUser()
    const addToast = useNotificationStore((s) => s.addToast)

    const [userOpen, setUserOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('PERMANENT')
    const userForm = useForm<UserFormValues>({
      resolver: zodResolver(userSchema),
      defaultValues: { employee_type: 'PERMANENT' },
    })

    const q = search.toLowerCase()
    const filtered = employees.filter((u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))

    useImperativeHandle(ref, () => ({
      openCreate() {
        setSelectedRole('')
        setSelectedEmployeeType('PERMANENT')
        userForm.reset({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          role: '',
          employee_type: 'PERMANENT',
          employee_id: '',
          phone: '',
          join_date: '',
        })
        setUserOpen(true)
      },
    }))

    const onUserSubmit = (data: UserFormValues) => {
      const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ').trim()
      const payload = {
        full_name: fullName,
        first_name: data.first_name,
        last_name: data.last_name || undefined,
        email: data.email,
        password: data.password,
        role: data.role,
        employee_type: data.employee_type,
        company_id: companyId,
        employee_id: data.employee_id || undefined,
        phone: data.phone || undefined,
        join_date: data.join_date || undefined,
      }
      createUser.mutateAsync(payload)
        .then(() => { addToast({ title: 'Employee added', variant: 'success' }); setUserOpen(false) })
        .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
    }

    return (
      <>
        {employees.length === 0 ? (
          <EmptyTab icon={Users} message="No employees yet" sub="Add an employee to get started" />
        ) : filtered.length === 0 ? (
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
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-4">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {getInitials(user.full_name)}
                        </div>
                        <span className="font-medium">{user.full_name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === 'ADMIN'
                            ? 'border-[#FE4E01]/30 text-[#FE4E01] bg-[#FE4E01]/5'
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
                    <TableCell className="text-right pr-4">
                      <Button asChild size="sm" variant="outline" className="h-8 cursor-pointer">
                        <Link to={`/admin/users/${user.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create User Dialog */}
        <Dialog open={userOpen} onOpenChange={setUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>
                Create a new employee for <strong>{companyName}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usr-first">First Name</Label>
                  <Input id="usr-first" placeholder="John" {...userForm.register('first_name')} />
                  {userForm.formState.errors.first_name && (
                    <p className="text-xs text-destructive">{userForm.formState.errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usr-last">Last Name</Label>
                  <Input id="usr-last" placeholder="Doe" {...userForm.register('last_name')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usr-empid">Employee ID</Label>
                  <Input id="usr-empid" placeholder="e.g. EMP-001" {...userForm.register('employee_id')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usr-phone">Phone</Label>
                  <Input id="usr-phone" placeholder="+60 12-345 6789" {...userForm.register('phone')} />
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
                  <Label>Employee Type</Label>
                  <Combobox
                    options={[
                      { value: 'PERMANENT', label: 'Permanent' },
                      { value: 'CONTRACT', label: 'Contract Basis' },
                      { value: 'PROBATION', label: 'Probation' },
                      { value: 'INTERNSHIP', label: 'Internship' },
                      { value: 'FREELANCE', label: 'Freelance' },
                      { value: 'PART_TIME', label: 'Part-Time Staff' },
                      { value: 'OJT', label: 'OJT' },
                      { value: 'SL1M_OJT', label: 'SL1M OJT' },
                    ]}
                    value={selectedEmployeeType}
                    onValueChange={(value) => {
                      setSelectedEmployeeType(value)
                      userForm.setValue('employee_type', value as UserFormValues['employee_type'])
                    }}
                    placeholder="Permanent"
                    searchPlaceholder="Search type..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usr-join">Join Date</Label>
                <Input id="usr-join" type="date" {...userForm.register('join_date')} />
              </div>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                💡 Additional profile fields (NRIC, address, dependents, etc.) can be filled in after creation via the employee detail page.
              </p>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setUserOpen(false)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={createUser.isPending} className="cursor-pointer">
                  {createUser.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Employee'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

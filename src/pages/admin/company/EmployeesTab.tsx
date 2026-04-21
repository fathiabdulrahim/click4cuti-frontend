import { useState, forwardRef, useImperativeHandle } from 'react'
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
import { Users, Loader2 } from 'lucide-react'
import { EmptyTab } from './shared'
import type { User } from '@/lib/types'

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
    const userForm = useForm<UserFormValues>({ resolver: zodResolver(userSchema) })

    const q = search.toLowerCase()
    const filtered = employees.filter((u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))

    useImperativeHandle(ref, () => ({
      openCreate() {
        setSelectedRole('')
        userForm.reset({ full_name: '', email: '', password: '', role: '', employee_id: '', phone: '', join_date: '' })
        setUserOpen(true)
      },
    }))

    const onUserSubmit = (data: UserFormValues) => {
      const payload = {
        ...data,
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
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
      </>
    )
  }
)

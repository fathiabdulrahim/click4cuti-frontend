import { useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useAdmin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { FolderTree, Pencil, Loader2 } from 'lucide-react'
import { EmptyTab } from './shared'
import type { Department, User } from '@/lib/types'

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})
type DepartmentFormValues = z.infer<typeof departmentSchema>

export interface DepartmentsTabHandle {
  openCreate: () => void
}

interface DepartmentsTabProps {
  companyId: string
  companyName: string
  departments: Department[]
  employees: User[]
  search: string
}

export const DepartmentsTab = forwardRef<DepartmentsTabHandle, DepartmentsTabProps>(
  function DepartmentsTab({ companyId, companyName, departments, employees, search }, ref) {
    const createDepartment = useCreateDepartment()
    const updateDepartment = useUpdateDepartment()
    const addToast = useNotificationStore((s) => s.addToast)

    const [deptOpen, setDeptOpen] = useState(false)
    const [editingDept, setEditingDept] = useState<Department | null>(null)
    const deptForm = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentSchema) })

    const q = search.toLowerCase()
    const filtered = departments.filter((d) => d.name.toLowerCase().includes(q))
    const deptPending = createDepartment.isPending || updateDepartment.isPending

    useImperativeHandle(ref, () => ({
      openCreate() {
        setEditingDept(null)
        deptForm.reset({ name: '' })
        setDeptOpen(true)
      },
    }))

    const openEditDept = (dept: Department) => {
      setEditingDept(dept)
      deptForm.reset({ name: dept.name })
      setDeptOpen(true)
    }

    const onDeptSubmit = (data: DepartmentFormValues) => {
      const mutation = editingDept
        ? updateDepartment.mutateAsync({ id: editingDept.id, ...data })
        : createDepartment.mutateAsync({ ...data, company_id: companyId })
      mutation
        .then(() => { addToast({ title: editingDept ? 'Department updated' : 'Department created', variant: 'success' }); setDeptOpen(false) })
        .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
    }

    return (
      <>
        {departments.length === 0 ? (
          <EmptyTab icon={FolderTree} message="No departments yet" sub="Create departments to organise employees" />
        ) : filtered.length === 0 ? (
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
                {filtered.map((dept) => {
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
        )}

        {/* Department Dialog */}
        <Dialog open={deptOpen} onOpenChange={setDeptOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDept ? 'Edit Department' : 'New Department'}</DialogTitle>
              <DialogDescription>
                {editingDept ? 'Update the department name.' : `Create a department for ${companyName}.`}
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
      </>
    )
  }
)

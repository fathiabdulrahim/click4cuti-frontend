import { useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateDesignation, useUpdateDesignation } from '@/hooks/useAdmin'
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
import { Briefcase, Pencil, Loader2 } from 'lucide-react'
import { EmptyTab } from './shared'
import type { Designation, User } from '@/lib/types'

const designationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  is_manager: z.boolean(),
})
type DesignationFormValues = z.infer<typeof designationSchema>

export interface DesignationsTabHandle {
  openCreate: () => void
}

interface DesignationsTabProps {
  companyId: string
  companyName: string
  designations: Designation[]
  employees: User[]
  search: string
}

export const DesignationsTab = forwardRef<DesignationsTabHandle, DesignationsTabProps>(
  function DesignationsTab({ companyId, companyName, designations, employees, search }, ref) {
    const createDesignation = useCreateDesignation()
    const updateDesignation = useUpdateDesignation()
    const addToast = useNotificationStore((s) => s.addToast)

    const [desigOpen, setDesigOpen] = useState(false)
    const [editingDesig, setEditingDesig] = useState<Designation | null>(null)
    const [isManager, setIsManager] = useState(false)
    const desigForm = useForm<DesignationFormValues>({ resolver: zodResolver(designationSchema) })

    const q = search.toLowerCase()
    const filtered = designations.filter((d) => d.title.toLowerCase().includes(q))
    const desigPending = createDesignation.isPending || updateDesignation.isPending

    useImperativeHandle(ref, () => ({
      openCreate() {
        setEditingDesig(null)
        setIsManager(false)
        desigForm.reset({ title: '', is_manager: false })
        setDesigOpen(true)
      },
    }))

    const openEditDesig = (desig: Designation) => {
      setEditingDesig(desig)
      setIsManager(desig.is_manager)
      desigForm.reset({ title: desig.title, is_manager: desig.is_manager })
      setDesigOpen(true)
    }

    const onDesigSubmit = (data: DesignationFormValues) => {
      const mutation = editingDesig
        ? updateDesignation.mutateAsync({ id: editingDesig.id, ...data })
        : createDesignation.mutateAsync({ ...data, company_id: companyId })
      mutation
        .then(() => { addToast({ title: editingDesig ? 'Designation updated' : 'Designation created', variant: 'success' }); setDesigOpen(false) })
        .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
    }

    return (
      <>
        {designations.length === 0 ? (
          <EmptyTab icon={Briefcase} message="No designations yet" sub="Create designations to define employee roles" />
        ) : filtered.length === 0 ? (
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
                {filtered.map((desig) => {
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
                          <Badge variant="outline" className="border-[#FE4E01]/30 text-[#FE4E01] bg-[#FE4E01]/5">
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
        )}

        {/* Designation Dialog */}
        <Dialog open={desigOpen} onOpenChange={setDesigOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDesig ? 'Edit Designation' : 'New Designation'}</DialogTitle>
              <DialogDescription>
                {editingDesig ? 'Update the designation details.' : `Create a designation for ${companyName}.`}
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
      </>
    )
  }
)

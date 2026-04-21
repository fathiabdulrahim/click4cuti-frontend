import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminAgencies, useCreateAgency, useUpdateAgency } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Pencil, Shield, Loader2, Search } from 'lucide-react'
import type { HrAgency } from '@/lib/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AgencyManagementPage() {
  const { data: agencies, isLoading } = useAdminAgencies()
  const createAgency = useCreateAgency()
  const updateAgency = useUpdateAgency()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<HrAgency | null>(null)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', email: '', phone: '', address: '' })
    setDialogOpen(true)
  }

  const openEdit = (agency: HrAgency) => {
    setEditing(agency)
    reset({
      name: agency.name,
      email: agency.email,
      phone: agency.phone ?? '',
      address: agency.address ?? '',
    })
    setDialogOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    const mutation = editing
      ? updateAgency.mutateAsync({ id: editing.id, ...data })
      : createAgency.mutateAsync(data)

    mutation
      .then(() => {
        addToast({ title: editing ? 'Agency updated' : 'Agency created', variant: 'success' })
        setDialogOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  const isPending = createAgency.isPending || updateAgency.isPending

  const filtered = agencies?.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agencies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage HR agencies</p>
        </div>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Agency
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !filtered?.length ? (
        <EmptyState
          title={search ? 'No results found' : 'No agencies yet'}
          description={search ? 'Try a different search term' : 'Create your first agency to get started'}
        />
      ) : (
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Agency</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((agency) => (
                  <TableRow key={agency.id} className="group">
                    <TableCell className="pl-6">
                      <Link to={`/admin/agencies/${agency.id}`} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FE4E01]/10">
                          <Shield className="h-4 w-4 text-[#FE4E01]" />
                        </div>
                        <span className="font-medium hover:underline">{agency.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{agency.email}</TableCell>
                    <TableCell className="text-muted-foreground">{agency.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={agency.is_active ? 'success' : 'secondary'}>
                        {agency.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(agency)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Agency' : 'New Agency'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the agency details below.'
                : 'Fill in the details to create a new agency.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agency Name</Label>
              <Input id="name" placeholder="e.g. HR Solutions Sdn Bhd" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="agency@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+60 12-345 6789" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="City, State" {...register('address')} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editing ? (
                  'Save Changes'
                ) : (
                  'Create Agency'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

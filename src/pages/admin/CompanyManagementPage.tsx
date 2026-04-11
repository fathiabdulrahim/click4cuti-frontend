import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminCompanies, useCreateCompany, useUpdateCompany, useAdminAgencies } from '@/hooks/useAdmin'
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
import { Combobox } from '@/components/ui/combobox'
import { Plus, Pencil, Building2, Loader2, Search } from 'lucide-react'
import type { Company } from '@/lib/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  registration_number: z.string().optional(),
  hr_email: z.string().email('Invalid email'),
  address: z.string().optional(),
  state: z.string().optional(),
  agency_id: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function CompanyManagementPage() {
  const { data: companies, isLoading } = useAdminCompanies()
  const { data: agencies } = useAdminAgencies()
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Company | null>(null)
  const [search, setSearch] = useState('')
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    setEditing(null)
    setSelectedAgencyId('')
    reset({ name: '', registration_number: '', hr_email: '', address: '', state: '', agency_id: '' })
    setDialogOpen(true)
  }

  const openEdit = (company: Company) => {
    setEditing(company)
    setSelectedAgencyId(company.agency_id ?? '')
    reset({
      name: company.name,
      registration_number: company.registration_number ?? '',
      hr_email: company.hr_email,
      address: company.address ?? '',
      state: company.state ?? '',
      agency_id: company.agency_id ?? '',
    })
    setDialogOpen(true)
  }

  const onSubmit = (data: FormValues) => {
    const mutation = editing
      ? updateCompany.mutateAsync({ id: editing.id, ...data })
      : createCompany.mutateAsync(data)

    mutation
      .then(() => {
        addToast({ title: editing ? 'Company updated' : 'Company created' })
        setDialogOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  const isPending = createCompany.isPending || updateCompany.isPending

  const filtered = companies?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hr_email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage client companies</p>
        </div>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
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
          title={search ? 'No results found' : 'No companies yet'}
          description={search ? 'Try a different search term' : 'Create your first company to get started'}
        />
      ) : (
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Company</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>HR Email</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow key={company.id} className="group">
                    <TableCell className="pl-6">
                      <Link to={`/admin/companies/${company.id}`} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium hover:underline">{company.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {company.registration_number ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{company.hr_email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {agencies?.find((a) => a.id === company.agency_id)?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{company.state ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={company.is_active ? 'success' : 'secondary'}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(company)}
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
            <DialogTitle>{editing ? 'Edit Company' : 'New Company'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the company details below.'
                : 'Fill in the details to register a new company.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" placeholder="e.g. Acme Corp Sdn Bhd" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                placeholder="e.g. 202301012345"
                {...register('registration_number')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr_email">HR Email</Label>
              <Input
                id="hr_email"
                type="email"
                placeholder="hr@company.com"
                {...register('hr_email')}
              />
              {errors.hr_email && (
                <p className="text-xs text-destructive">{errors.hr_email.message}</p>
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
                  const id = value === 'none' ? '' : value
                  setSelectedAgencyId(id)
                  setValue('agency_id', id)
                }}
                placeholder="Select an agency"
                searchPlaceholder="Search agencies..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address" {...register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="e.g. Selangor" {...register('state')} />
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
                  'Create Company'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

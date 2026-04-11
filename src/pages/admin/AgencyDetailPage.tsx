import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useAdminAgency,
  useAdminCompanies,
  useUpdateAgency,
  useCreateCompany,
} from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  MapPin,
  Building2,
  Plus,
  Pencil,
  Loader2,
  Search,
} from 'lucide-react'

// -- Edit agency schema --
const agencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
})
type AgencyFormValues = z.infer<typeof agencySchema>

// -- Create company schema --
const companySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  registration_number: z.string().optional(),
  hr_email: z.string().email('Invalid email'),
  address: z.string().optional(),
  state: z.string().optional(),
})
type CompanyFormValues = z.infer<typeof companySchema>

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: agency, isLoading } = useAdminAgency(id!)
  const { data: allCompanies } = useAdminCompanies()
  const updateAgency = useUpdateAgency()
  const createCompany = useCreateCompany()
  const addToast = useNotificationStore((s) => s.addToast)

  const [editOpen, setEditOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Edit agency form
  const editForm = useForm<AgencyFormValues>({ resolver: zodResolver(agencySchema) })

  // Create company form
  const companyForm = useForm<CompanyFormValues>({ resolver: zodResolver(companySchema) })

  const openEdit = () => {
    if (!agency) return
    editForm.reset({
      name: agency.name,
      email: agency.email,
      phone: agency.phone ?? '',
      address: agency.address ?? '',
    })
    setEditOpen(true)
  }

  const onEditSubmit = (data: AgencyFormValues) => {
    updateAgency
      .mutateAsync({ id: id!, ...data })
      .then(() => {
        addToast({ title: 'Agency updated', variant: 'success' })
        setEditOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  const openCreateCompany = () => {
    companyForm.reset({ name: '', registration_number: '', hr_email: '', address: '', state: '' })
    setCompanyOpen(true)
  }

  const onCompanySubmit = (data: CompanyFormValues) => {
    createCompany
      .mutateAsync({ ...data, agency_id: id })
      .then(() => {
        addToast({ title: 'Company created', variant: 'success' })
        setCompanyOpen(false)
      })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  if (isLoading) return <LoadingSpinner className="py-12" />
  if (!agency) return <p className="py-12 text-center text-muted-foreground">Agency not found</p>

  const companies = allCompanies?.filter((c) => c.agency_id === id) ?? []
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hr_email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Agencies
      </Link>

      {/* Agency info header */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Banner with title inside */}
          <div className="relative bg-gradient-to-r from-[#0F766E] to-[#0D9488] px-6 py-6 overflow-hidden">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-bold tracking-tight text-white">{agency.name}</h1>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${agency.is_active ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/15 text-white/70'}`}>
                      {agency.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-0.5">
                    HR Agency &middot; {companies.length} {companies.length === 1 ? 'company' : 'companies'}
                  </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium truncate">{agency.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Phone className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium truncate">{agency.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <MapPin className="h-4 w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Address</p>
                <p className="text-sm font-medium truncate">{agency.address || '—'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Companies</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {companies.length} {companies.length === 1 ? 'company' : 'companies'} under this agency
            </p>
          </div>
          <Button size="sm" onClick={openCreateCompany} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Company
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search */}
          {companies.length > 0 && (
            <div className="relative max-w-sm mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No companies yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Add a company to this agency to get started
              </p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="pl-4">Company</TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>HR Email</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="cursor-pointer hover:bg-muted/30">
                      <TableCell className="pl-4">
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium hover:underline">{company.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.registration_number ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{company.hr_email}</TableCell>
                      <TableCell className="text-muted-foreground">{company.state ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={company.is_active ? 'success' : 'secondary'}>
                          {company.is_active ? 'Active' : 'Inactive'}
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

      {/* Edit Agency Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agency</DialogTitle>
            <DialogDescription>Update the agency details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ag-name">Agency Name</Label>
              <Input id="ag-name" {...editForm.register('name')} />
              {editForm.formState.errors.name && (
                <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ag-email">Email</Label>
              <Input id="ag-email" type="email" {...editForm.register('email')} />
              {editForm.formState.errors.email && (
                <p className="text-xs text-destructive">{editForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ag-phone">Phone</Label>
                <Input id="ag-phone" {...editForm.register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-address">Address</Label>
                <Input id="ag-address" {...editForm.register('address')} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={updateAgency.isPending} className="cursor-pointer">
                {updateAgency.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Company Dialog */}
      <Dialog open={companyOpen} onOpenChange={setCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Company</DialogTitle>
            <DialogDescription>
              Create a company under <strong>{agency.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="co-name">Company Name</Label>
              <Input id="co-name" placeholder="e.g. Acme Corp Sdn Bhd" {...companyForm.register('name')} />
              {companyForm.formState.errors.name && (
                <p className="text-xs text-destructive">{companyForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="co-reg">Registration Number</Label>
              <Input id="co-reg" placeholder="e.g. 202301012345" {...companyForm.register('registration_number')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co-email">HR Email</Label>
              <Input id="co-email" type="email" placeholder="hr@company.com" {...companyForm.register('hr_email')} />
              {companyForm.formState.errors.hr_email && (
                <p className="text-xs text-destructive">{companyForm.formState.errors.hr_email.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="co-address">Address</Label>
                <Input id="co-address" placeholder="Street address" {...companyForm.register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="co-state">State</Label>
                <Input id="co-state" placeholder="e.g. Selangor" {...companyForm.register('state')} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCompanyOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={createCompany.isPending} className="cursor-pointer">
                {createCompany.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
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

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateCompany, useAdminAgencies } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useNotificationStore } from '@/stores/notificationStore'
import {
  Building2,
  Mail,
  MapPin,
  FileText,
  Shield,
  Users,
  Pencil,
  Loader2,
  Phone,
  Globe,
  Factory,
  Calendar,
  UserCheck,
  CalendarDays,
} from 'lucide-react'
import { InfoTile, safeFormatDate, MONTH_NAMES } from './shared'
import type { Company } from '@/lib/types'

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

interface CompanyHeaderProps {
  company: Company
  agencyName?: string
}

export function CompanyHeader({ company, agencyName }: CompanyHeaderProps) {
  const { data: agencies } = useAdminAgencies()
  const updateCompany = useUpdateCompany()
  const addToast = useNotificationStore((s) => s.addToast)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const editForm = useForm<CompanyFormValues>({ resolver: zodResolver(companySchema) })

  const openEdit = () => {
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
    updateCompany.mutateAsync({ id: company.id, ...data })
      .then(() => { addToast({ title: 'Company updated', variant: 'success' }); setEditOpen(false) })
      .catch(() => addToast({ title: 'Something went wrong', variant: 'destructive' }))
  }

  return (
    <>
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

      {/* Edit Company Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
    </>
  )
}

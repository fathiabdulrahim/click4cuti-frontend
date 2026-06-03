import { useParams, Link } from 'react-router-dom'
import {
  useAdminCompany,
  useAdminUsers,
  useAdminAgencies,
  useAdminDepartments,
  useAdminDesignations,
  useAdminWorkSchedules,
  useAdminPublicHolidays,
  useAdminLeaveApplications,
  useAdminLeaveTypes,
} from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Users, FolderTree, Briefcase, ListChecks } from 'lucide-react'

import { CompanyHeader } from './company/CompanyHeader'
import { CompanyTabs } from '@/components/admin/CompanyTabs'

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

  return (
    <div className="space-y-6">
      <Link
        to="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Companies
      </Link>

      <CompanyHeader company={company} agencyName={agencyName} />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Employees', value: employees.length, color: 'bg-[#FE4E01]/10 text-[#FE4E01]', icon: Users },
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

      {/* Tabs + Content using sidebar layout */}
      <CompanyTabs
        companyId={id!}
        companyName={company.name}
        employees={employees}
        departments={departments}
        designations={designations}
        workSchedules={workSchedules}
        holidays={holidays}
        leaveApps={leaveApps}
        leaveTypes={leaveTypes}
      />
    </div>
  )
}

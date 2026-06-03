import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CompanySidebarNav } from './CompanySidebarNav'
import { CompanyMobileNav } from './CompanyMobileNav'
import { COMPANY_NAV_VALUES } from './companySidebarNav'
import { EmployeesTab, type EmployeesTabHandle } from '@/pages/admin/company/EmployeesTab'
import { DepartmentsTab, type DepartmentsTabHandle } from '@/pages/admin/company/DepartmentsTab'
import { DesignationsTab, type DesignationsTabHandle } from '@/pages/admin/company/DesignationsTab'
import { WorkSchedulesTab, type WorkSchedulesTabHandle } from '@/pages/admin/company/WorkSchedulesTab'
import { LeaveTypesTab, type LeaveTypesTabHandle } from '@/pages/admin/company/LeaveTypesTab'
import { HolidaysTab } from '@/pages/admin/company/HolidaysTab'
import { LeaveApplicationsTab } from '@/pages/admin/company/LeaveApplicationsTab'

interface Props {
  companyId: string
  companyName: string
  employees: any[]
  departments: any[]
  designations: any[]
  workSchedules: any[]
  holidays: any[]
  leaveApps: any[]
  leaveTypes: any[]
}

const addButtonTabs: Record<string, string> = {
  employees: 'Add Employee',
  departments: 'Add Department',
  designations: 'Add Designation',
  schedules: 'Add Schedule',
  leave_types: 'Add Leave Type',
}

export function CompanyTabs({
  companyId,
  companyName,
  employees,
  departments,
  designations,
  workSchedules,
  holidays,
  leaveApps,
  leaveTypes,
}: Props) {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('tab') ?? ''
  const tab = COMPANY_NAV_VALUES.includes(fromUrl) ? fromUrl : 'employees'
  const [search, setSearch] = useState('')

  // Refs for CRUD tabs
  const employeesRef = useRef<EmployeesTabHandle>(null)
  const departmentsRef = useRef<DepartmentsTabHandle>(null)
  const designationsRef = useRef<DesignationsTabHandle>(null)
  const schedulesRef = useRef<WorkSchedulesTabHandle>(null)
  const leaveTypesRef = useRef<LeaveTypesTabHandle>(null)

  function handleChange(value: string) {
    const next = new URLSearchParams(params)
    next.set('tab', value)
    setParams(next, { replace: true })
    setSearch('')
  }

  const handleAdd = () => {
    const refMap: Record<string, { current: { openCreate: () => void } | null }> = {
      employees: employeesRef,
      departments: departmentsRef,
      designations: designationsRef,
      schedules: schedulesRef,
      leave_types: leaveTypesRef,
    }
    refMap[tab]?.current?.openCreate()
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Mobile: dropdown */}
      <CompanyMobileNav
        value={tab}
        onChange={handleChange}
        className="md:hidden"
      />

      {/* Desktop: sidebar */}
      <CompanySidebarNav
        value={tab}
        onChange={handleChange}
        className="hidden md:block"
      />

      {/* Content area */}
      <div className="min-w-0 flex-1">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${tab}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {addButtonTabs[tab] && (
              <Button size="sm" onClick={handleAdd} className="cursor-pointer ml-3">
                <Plus className="h-4 w-4 mr-1.5" />{addButtonTabs[tab]}
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {tab === 'employees' && (
              <EmployeesTab ref={employeesRef} companyId={companyId} companyName={companyName} employees={employees} search={search} />
            )}
            {tab === 'departments' && (
              <DepartmentsTab ref={departmentsRef} companyId={companyId} companyName={companyName} departments={departments} employees={employees} search={search} />
            )}
            {tab === 'designations' && (
              <DesignationsTab ref={designationsRef} companyId={companyId} companyName={companyName} designations={designations} employees={employees} search={search} />
            )}
            {tab === 'schedules' && (
              <WorkSchedulesTab ref={schedulesRef} companyId={companyId} companyName={companyName} workSchedules={workSchedules} search={search} />
            )}
            {tab === 'leave_types' && (
              <LeaveTypesTab ref={leaveTypesRef} companyId={companyId} companyName={companyName} leaveTypes={leaveTypes} search={search} />
            )}
            {tab === 'holidays' && (
              <HolidaysTab holidays={holidays} search={search} />
            )}
            {tab === 'leaves' && (
              <LeaveApplicationsTab leaveApps={leaveApps} search={search} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

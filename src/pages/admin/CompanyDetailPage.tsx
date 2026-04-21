import { useState, useRef } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  FolderTree,
  Briefcase,
  Clock,
  CalendarDays,
  FileCheck,
  ListChecks,
} from 'lucide-react'

import { CompanyHeader } from './company/CompanyHeader'
import { EmployeesTab, type EmployeesTabHandle } from './company/EmployeesTab'
import { DepartmentsTab, type DepartmentsTabHandle } from './company/DepartmentsTab'
import { DesignationsTab, type DesignationsTabHandle } from './company/DesignationsTab'
import { WorkSchedulesTab, type WorkSchedulesTabHandle } from './company/WorkSchedulesTab'
import { LeaveTypesTab, type LeaveTypesTabHandle } from './company/LeaveTypesTab'
import { HolidaysTab } from './company/HolidaysTab'
import { LeaveApplicationsTab } from './company/LeaveApplicationsTab'

const tabs = [
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'departments', label: 'Departments', icon: FolderTree },
  { key: 'designations', label: 'Designations', icon: Briefcase },
  { key: 'schedules', label: 'Work Schedules', icon: Clock },
  { key: 'leave_types', label: 'Leave Types', icon: ListChecks },
  { key: 'holidays', label: 'Public Holidays', icon: CalendarDays },
  { key: 'leaves', label: 'Leave Applications', icon: FileCheck },
] as const

type TabKey = (typeof tabs)[number]['key']

const addButtonTabs: Record<string, string> = {
  employees: 'Add Employee',
  departments: 'Add Department',
  designations: 'Add Designation',
  schedules: 'Add Schedule',
  leave_types: 'Add Leave Type',
}

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

  const [activeTab, setActiveTab] = useState<TabKey>('employees')
  const [search, setSearch] = useState('')

  // Refs for CRUD tabs
  const employeesRef = useRef<EmployeesTabHandle>(null)
  const departmentsRef = useRef<DepartmentsTabHandle>(null)
  const designationsRef = useRef<DesignationsTabHandle>(null)
  const schedulesRef = useRef<WorkSchedulesTabHandle>(null)
  const leaveTypesRef = useRef<LeaveTypesTabHandle>(null)

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

  const handleAdd = () => {
    const refMap: Record<string, { current: { openCreate: () => void } | null }> = {
      employees: employeesRef,
      departments: departmentsRef,
      designations: designationsRef,
      schedules: schedulesRef,
      leave_types: leaveTypesRef,
    }
    refMap[activeTab]?.current?.openCreate()
  }

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

      {/* Tabs + Content */}
      <Card className="border-0 shadow-sm bg-white">
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSearch('') }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer',
                  activeTab === key
                    ? 'border-[#1E40AF] text-[#1E40AF]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {addButtonTabs[activeTab] && (
            <Button size="sm" onClick={handleAdd} className="cursor-pointer ml-3">
              <Plus className="h-4 w-4 mr-1.5" />{addButtonTabs[activeTab]}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {activeTab === 'employees' && (
            <EmployeesTab ref={employeesRef} companyId={id!} companyName={company.name} employees={employees} search={search} />
          )}
          {activeTab === 'departments' && (
            <DepartmentsTab ref={departmentsRef} companyId={id!} companyName={company.name} departments={departments} employees={employees} search={search} />
          )}
          {activeTab === 'designations' && (
            <DesignationsTab ref={designationsRef} companyId={id!} companyName={company.name} designations={designations} employees={employees} search={search} />
          )}
          {activeTab === 'schedules' && (
            <WorkSchedulesTab ref={schedulesRef} companyId={id!} companyName={company.name} workSchedules={workSchedules} search={search} />
          )}
          {activeTab === 'leave_types' && (
            <LeaveTypesTab ref={leaveTypesRef} companyId={id!} companyName={company.name} leaveTypes={leaveTypes} search={search} />
          )}
          {activeTab === 'holidays' && (
            <HolidaysTab holidays={holidays} search={search} />
          )}
          {activeTab === 'leaves' && (
            <LeaveApplicationsTab leaveApps={leaveApps} search={search} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

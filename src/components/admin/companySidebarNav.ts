import {
  Users,
  FolderTree,
  Briefcase,
  Clock,
  ListChecks,
  CalendarDays,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'

export interface CompanyNavItem {
  value: string
  label: string
  icon: LucideIcon
}

export interface CompanyNavGroup {
  label: string
  items: CompanyNavItem[]
}

export const COMPANY_NAV: CompanyNavGroup[] = [
  {
    label: 'Organization',
    items: [
      { value: 'employees', label: 'Employees', icon: Users },
      { value: 'departments', label: 'Departments', icon: FolderTree },
      { value: 'designations', label: 'Designations', icon: Briefcase },
    ],
  },
  {
    label: 'Operations',
    items: [
      { value: 'schedules', label: 'Work Schedules', icon: Clock },
      { value: 'holidays', label: 'Public Holidays', icon: CalendarDays },
    ],
  },
  {
    label: 'Leave Management',
    items: [
      { value: 'leave_types', label: 'Leave Types', icon: ListChecks },
      { value: 'leaves', label: 'Leave Applications', icon: FileCheck },
    ],
  },
]

export const COMPANY_NAV_VALUES = COMPANY_NAV.flatMap((g) =>
  g.items.map((i) => i.value),
) as readonly string[]

export type CompanyTabValue = (typeof COMPANY_NAV_VALUES)[number]

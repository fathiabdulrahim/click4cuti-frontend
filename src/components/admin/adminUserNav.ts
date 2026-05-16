import {
  User,
  Briefcase,
  ShieldCheck,
  Phone,
  Users,
  History,
  TrendingUp,
  Wallet,
  Receipt,
  PiggyBank,
  Clock,
  FileText,
  GraduationCap,
  Laptop,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'

export interface AdminUserNavItem {
  value: string
  label: string
  icon: LucideIcon
}

export interface AdminUserNavGroup {
  label: string
  items: AdminUserNavItem[]
}

export const ADMIN_USER_NAV: AdminUserNavGroup[] = [
  {
    label: 'Profile',
    items: [
      { value: 'personal',        label: 'Personal Detail', icon: User },
      { value: 'contact',         label: 'Contact Info',    icon: Phone },
      { value: 'dependents',      label: 'Dependents',      icon: Users },
      { value: 'work-experience', label: 'Work Experience', icon: History },
    ],
  },
  {
    label: 'Employment',
    items: [
      { value: 'job',      label: 'Job Info',        icon: Briefcase },
      { value: 'approval', label: 'Approval Matrix', icon: ShieldCheck },
      { value: 'career',   label: 'Career Timeline', icon: TrendingUp },
    ],
  },
  {
    label: 'Finance',
    items: [
      { value: 'compensation',   label: 'Payroll',        icon: Wallet },
      { value: 'claim-policy',   label: 'Claim Policy',   icon: Receipt },
      { value: 'claim-balances', label: 'Claim Balances', icon: PiggyBank },
      { value: 'claim-history',  label: 'Claim History',  icon: Clock },
    ],
  },
  {
    label: 'Records',
    items: [
      { value: 'files',     label: 'Files',    icon: FileText },
      { value: 'training',  label: 'Training', icon: GraduationCap },
      { value: 'equipment', label: 'Assets',   icon: Laptop },
      { value: 'conduct',   label: 'Conduct',  icon: AlertTriangle },
    ],
  },
]

export const ADMIN_USER_NAV_VALUES = ADMIN_USER_NAV.flatMap((g) =>
  g.items.map((i) => i.value),
) as readonly string[]

export type AdminUserTabValue = (typeof ADMIN_USER_NAV_VALUES)[number]

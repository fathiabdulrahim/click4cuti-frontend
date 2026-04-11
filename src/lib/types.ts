export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
export type AdminScope = 'SUPER_ADMIN' | 'AGENCY' | 'COMPANY'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type DayType = 'FULL_DAY' | 'HALF_DAY_AM' | 'HALF_DAY_PM'
export type LeaveCategory = 'MANDATORY' | 'SPECIAL'
export type DeliveryStatus = 'PENDING' | 'SENT' | 'FAILED'
export type Gender = 'MALE' | 'FEMALE'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  company_id: string
  department_id?: string
  designation_id?: string
  manager_id?: string
  employee_id?: string
  phone?: string
  address?: string
  join_date: string
  gender?: Gender
  is_active: boolean
  is_confirmed: boolean
  number_of_children: number
  department?: Department
  designation?: Designation
  manager?: User
  created_at?: string
  updated_at?: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  scope: AdminScope
  agency_id?: string
  company_id?: string
  is_active: boolean
}

export interface Company {
  id: string
  name: string
  registration_number?: string
  hr_email: string
  address?: string
  state?: string
  agency_id?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface HrAgency {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Department {
  id: string
  company_id: string
  name: string
  is_active: boolean
}

export interface Designation {
  id: string
  company_id: string
  title: string
  is_manager: boolean
  is_active: boolean
}

export interface LeaveType {
  id: string
  name: string
  category: LeaveCategory
  default_days_tier1: number
  default_days_tier2: number
  default_days_tier3: number
  max_consecutive_days?: number
  requires_document: boolean
  allows_half_day: boolean
  allows_carry_forward: boolean
  max_carry_forward_days?: number
  max_times_per_year?: number
  shared_balance_with?: string
  is_active: boolean
}

export interface LeavePolicy {
  id: string
  company_id: string
  name: string
  description?: string
  advance_notice_days: number
  is_active: boolean
  leave_types?: LeaveType[]
}

export interface LeaveBalance {
  id: string
  leave_type: LeaveType
  year: number
  total_entitled: number
  carried_forward: number
  used_days: number
  pending_days: number
  remaining_days: number
}

export interface LeaveDayDetail {
  id: string
  leave_date: string
  day_type: DayType
}

export interface LeaveApplication {
  id: string
  user: User
  user_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  total_days: number
  reason: string
  extended_reason?: string
  status: LeaveStatus
  reviewer_remarks?: string
  requires_ceo_approval: boolean
  approved_by?: string
  approver?: User
  leave_day_details?: LeaveDayDetail[]
  created_at: string
  updated_at: string
}

export interface PublicHoliday {
  id: string
  company_id: string
  name: string
  holiday_date: string
  year: number
  is_mandatory: boolean
  is_replacement: boolean
}

export interface WorkSchedule {
  id: string
  company_id: string
  name: string
  start_time: string
  end_time: string
  break_start?: string
  break_end?: string
  rest_days: string
  is_active: boolean
}

export interface WarningLetter {
  id: string
  user_id: string
  company_id: string
  user?: User
  leave_type?: LeaveType
  reason: string
  year: number
  issued_date: string
  acknowledged: boolean
  acknowledged_at?: string
  created_at?: string
}

export interface ActivityLog {
  id: string
  actor_id: string
  actor_type: string
  company_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  details?: string
  ip_address?: string
  created_at: string
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  error: string
  messages?: string[]
  message?: string
}

export interface DashboardStats {
  leave_balances: {
    leave_type: string
    total: number
    used: number
    pending: number
    remaining: number
    carried_forward: number
  }[]
  pending_requests: number
  approved_this_year: number
  upcoming_holidays: { name: string; date: string }[]
  recent_applications: {
    id: string
    leave_type: string
    status: LeaveStatus
    start_date: string
    end_date: string
    total_days: number
  }[]
}

export interface AdminDashboardStats {
  total_employees: number
  pending_approvals: number
  on_leave_today: number
  approved_ytd: number
  rejected_ytd: number
  leave_by_type: Record<string, number>
  recent_applications: {
    id: string
    user: string
    leave_type: string
    status: LeaveStatus
    start_date: string
    total_days: number
  }[]
}

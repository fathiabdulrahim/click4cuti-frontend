export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
export type AdminScope = 'SUPER_ADMIN' | 'AGENCY' | 'COMPANY'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type DayType = 'FULL_DAY' | 'HALF_DAY_AM' | 'HALF_DAY_PM'
export type LeaveCategory = 'MANDATORY' | 'SPECIAL'
export type DeliveryStatus = 'PENDING' | 'SENT' | 'FAILED'
export type Gender = 'MALE' | 'FEMALE'

// ---- Profile enums ----
export type EmployeeType =
  | 'PERMANENT' | 'CONTRACT' | 'PROBATION' | 'INTERNSHIP'
  | 'FREELANCE' | 'PART_TIME' | 'OJT' | 'SL1M_OJT'
export type NricColor = 'BLUE' | 'RED'
export type Race = 'MALAY' | 'CHINESE' | 'INDIAN' | 'OTHERS'
export type Religion = 'ISLAM' | 'BUDDHISM' | 'HINDU' | 'CHRISTIAN' | 'OTHERS'
export type BloodType = 'A' | 'B' | 'AB' | 'O'
export type EducationLevel =
  | 'PRE_SCHOOL' | 'PRIMARY_SCHOOL' | 'SECONDARY_SCHOOL'
  | 'COLLEGE' | 'DIPLOMA' | 'DEGREE' | 'MASTER' | 'PHD'
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'
export type Nationality = 'CITIZEN' | 'NON_CITIZEN' | 'PERMANENT_RESIDENT'
export type BumiStatus = 'BUMIPUTERA' | 'NON_BUMIPUTERA'
export type FamilyRelation = 'SPOUSE' | 'CHILD' | 'PARENT'
export type FamilyEmploymentStatus = 'WORKING' | 'NOT_WORKING' | 'STUDYING' | 'RETIRED'
export type SupervisorCategory = 'LEAVE' | 'CLAIM' | 'OVERTIME' | 'TIMEOFF'
export type WarningSource = 'AUTO' | 'MANUAL'
export type BankAccountType = 'SAVING' | 'CURRENT' | 'FIXED' | 'OTHERS'
export type BankAccountStatus = 'ACTIVE' | 'INACTIVE'
export type EpfContributionStart = 'BEFORE_1998_AUG' | 'AFTER_1998_AUG' | 'AFTER_2001_AUG'
export type TaxCategory = 'REGULAR' | 'REP' | 'KNOWLEDGE_WORKER'
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface User {
  id: string
  email: string
  full_name: string
  first_name?: string | null
  last_name?: string | null
  role: UserRole
  company_id: string
  department_id?: string
  designation_id?: string
  manager_id?: string
  employee_id?: string
  branch_id?: string | null
  phone?: string
  mobile_phone?: string | null
  personal_email?: string | null
  address?: string
  mailing_address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  join_date: string
  gender?: Gender
  is_active: boolean
  is_confirmed: boolean
  number_of_children: number
  department?: Department
  designation?: Designation
  manager?: User
  leave_approver_ids?: string[]
  leave_approvers?: User[]
  leave_supervisor_l1?: User | null
  leave_supervisor_l2?: User | null

  // Profile (Personal Detail)
  nric?: string | null
  nric_old?: string | null
  nric_color?: NricColor | null
  date_of_birth?: string | null
  place_of_birth?: string | null
  race?: Race | null
  religion?: Religion | null
  blood_type?: BloodType | null
  education_level?: EducationLevel | null
  marital_status?: MaritalStatus | null
  nationality?: Nationality | null
  bumi_status?: BumiStatus | null
  driving_license_number?: string | null
  driving_license_class?: string | null
  driving_license_expiry?: string | null

  // Job Info
  date_of_sign?: string | null
  employee_type?: EmployeeType | null
  probation_period_days?: number | null
  oku_status?: boolean
  ea_person_in_charge_id?: string | null

  // App settings
  notifications_enabled?: boolean
  clock_in_selfie_enabled?: boolean
  early_late_indicator_enabled?: boolean
  attendance_confirmation_enabled?: boolean

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
  phone?: string
  website?: string
  industry?: string
  company_size?: string
  logo_url?: string
  address?: string
  state?: string
  agency_id?: string
  financial_year_start?: number
  probation_months?: number
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
  advance_notice_days?: number
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
  approver_id?: string
  approver_type?: 'User' | 'AdminUser'
  approver?: { id: string; full_name: string; email: string; type: 'User' | 'AdminUser' }
  leave_day_details?: LeaveDayDetail[]
  documents?: { id: string; file_name: string; content_type: string; file_size: number }[]
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
  source: WarningSource
  details?: string | null
  action_taken?: string | null
  issued_by_id?: string | null
  issued_by_type?: 'User' | 'AdminUser' | null
  supporting_document_url?: string | null
  created_at?: string
}

export interface WorkExperience {
  id: string
  user_id: string
  company_name: string
  position: string
  start_date: string
  end_date?: string | null
  period?: string
}

export interface Branch {
  id: string
  company_id: string
  name: string
  address?: string | null
  state?: string | null
  is_active: boolean
}

export interface UserSupervisor {
  id: string
  user_id: string
  supervisor_id: string
  supervisor_name?: string
  category: SupervisorCategory
  level: 1 | 2
}

export interface FamilyMember {
  id: string
  user_id: string
  relation: FamilyRelation
  first_name: string
  last_name?: string | null
  gender: Gender
  nric_or_passport?: string | null
  date_of_birth: string
  phone?: string | null
  email?: string | null
  address?: string | null
  employment_status: FamilyEmploymentStatus
  oku_status: boolean
}

export interface CareerProgress {
  id: string
  user_id: string
  company_id: string
  job_title: string
  effective_date: string
  manager_id?: string | null
  department_id?: string | null
  job_type?: string | null
  description?: string | null
}

export interface UserDocument {
  id: string
  user_id: string
  remarks: string
  file_url?: string | null
  file_name?: string | null
}

export interface Training {
  id: string
  user_id: string
  title: string
  start_date: string
  end_date: string
  description: string
  received_date: string
  expired_date: string
  certification_url?: string | null
  is_expired?: boolean
}

export interface EquipmentAssignment {
  id: string
  user_id: string
  equipment_type: string
  equipment_details: string
  date_received: string
  date_return?: string | null
  supporting_document_url?: string | null
  is_returned?: boolean
}

export interface UserBankDetail {
  id?: string
  user_id?: string
  bank_name?: string | null
  account_number?: string | null
  account_type?: BankAccountType | null
  branch?: string | null
  account_status?: BankAccountStatus | null
}

export interface UserStatutoryDetail {
  id?: string
  user_id?: string
  epf_number?: string | null
  epf_contribution_start?: EpfContributionStart | null
  socso_number?: string | null
  socso_contribution_start_age?: number | null
  eis_employee_rate?: number | null
  eis_employer_rate?: number | null
  income_tax_number?: string | null
  vola_amount?: number | null
}

export interface UserTaxRelief {
  id?: string
  user_id?: string
  spouse_is_working?: boolean | null
  spouse_is_disabled?: boolean | null
  spouse_gender?: Gender | null
  contributes_to_sip?: boolean
  tax_category?: TaxCategory | null
  children_under_18?: number
  children_studying?: number
  children_disabled?: number
}

export interface PayrollPayload {
  user_id: string
  bank_detail?: UserBankDetail | null
  statutory_detail?: UserStatutoryDetail | null
  tax_relief?: UserTaxRelief | null
}

export interface ClaimType {
  id: string
  company_id: string
  name: string
  code?: string | null
  description?: string | null
  default_application_limit?: number | null
  default_annual_limit?: number | null
  requires_document: boolean
  is_active: boolean
}

export interface UserClaimPolicy {
  id: string
  user_id: string
  claim_type_id: string
  claim_type?: ClaimType
  application_limit?: number | null
  annual_limit?: number | null
  is_unlimited_application: boolean
  is_unlimited_annual: boolean
  is_included: boolean
  remarks?: string | null
}

export interface ClaimBalance {
  id: string
  user_id: string
  claim_type_id: string
  claim_type?: ClaimType
  year: number
  annual_limit: number
  pending_amount: number
  used_amount: number
  remaining_amount: number
}

export interface ClaimApplication {
  id: string
  user_id: string
  claim_type_id: string
  claim_type?: ClaimType
  amount: number
  claim_date: string
  reason: string
  status: ClaimStatus
  reviewer_remarks?: string | null
}

export interface AppSettings {
  notifications_enabled: boolean
  clock_in_selfie_enabled: boolean
  early_late_indicator_enabled: boolean
  attendance_confirmation_enabled: boolean
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

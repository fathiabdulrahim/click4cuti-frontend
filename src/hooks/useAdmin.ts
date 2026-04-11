import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '@/api/admin/users'
import { adminCompaniesApi } from '@/api/admin/companies'
import { adminAgenciesApi } from '@/api/admin/agencies'
import { adminLeavePoliciesApi, adminLeaveTypesApi } from '@/api/admin/leavePolicies'
import { adminPublicHolidaysApi } from '@/api/admin/publicHolidays'
import { adminLeaveApplicationsApi } from '@/api/admin/leaveApplications'
import { adminWarningLettersApi } from '@/api/admin/warningLetters'
import { adminDepartmentsApi } from '@/api/admin/departments'
import { adminDesignationsApi } from '@/api/admin/designations'
import { adminWorkSchedulesApi } from '@/api/admin/workSchedules'
import { adminDashboardApi } from '@/api/admin/dashboard'

// Dashboard
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminDashboardApi.get().then((r) => r.data),
    staleTime: 30_000,
  })
}

// Single entity fetches
export function useAdminAgency(id: string) {
  return useQuery({
    queryKey: ['admin', 'agencies', id],
    queryFn: () => adminAgenciesApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useAdminCompany(id: string) {
  return useQuery({
    queryKey: ['admin', 'companies', id],
    queryFn: () => adminCompaniesApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminUsersApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  })
}

// Users
export function useAdminUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'users', 'list', params],
    queryFn: () => adminUsersApi.getAll(params).then((r) => r.data),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminUsersApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminUsersApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

// Companies
export function useAdminCompanies() {
  return useQuery({
    queryKey: ['admin', 'companies', 'list'],
    queryFn: () => adminCompaniesApi.getAll().then((r) => r.data),
  })
}

export function useCreateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminCompaniesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'companies'] }),
  })
}

// Agencies
export function useAdminAgencies() {
  return useQuery({
    queryKey: ['admin', 'agencies', 'list'],
    queryFn: () => adminAgenciesApi.getAll().then((r) => r.data),
  })
}

export function useCreateAgency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminAgenciesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'agencies'] }),
  })
}

export function useUpdateAgency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminAgenciesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'agencies'] }),
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminCompaniesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'companies'] }),
  })
}

// Leave Policies
export function useAdminLeavePolicies() {
  return useQuery({
    queryKey: ['admin', 'leave_policies', 'list'],
    queryFn: () => adminLeavePoliciesApi.getAll().then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}

// Leave Types
export function useAdminLeaveTypes(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'leave_types', 'list', params],
    queryFn: () => adminLeaveTypesApi.getAll(params).then((r) => r.data),
  })
}

export function useCreateLeaveType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminLeaveTypesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'leave_types'] }),
  })
}

export function useUpdateLeaveType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminLeaveTypesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'leave_types'] }),
  })
}

// Public Holidays
export function useAdminPublicHolidays(year?: number) {
  return useQuery({
    queryKey: ['admin', 'public_holidays', year],
    queryFn: () => adminPublicHolidaysApi.getAll(year).then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}

// Leave Applications
export function useAdminLeaveApplications(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'leave_applications', 'list', params],
    queryFn: () => adminLeaveApplicationsApi.getAll(params).then((r) => r.data),
  })
}

export function useUpdateLeaveApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; status: string; reviewer_remarks?: string }) =>
      adminLeaveApplicationsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'leave_applications'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

// Departments
export function useAdminDepartments(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'departments', 'list', params],
    queryFn: () => adminDepartmentsApi.getAll(params).then((r) => r.data),
  })
}

export function useCreateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminDepartmentsApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'departments'] }),
  })
}

export function useUpdateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminDepartmentsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'departments'] }),
  })
}

// Designations
export function useAdminDesignations(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'designations', 'list', params],
    queryFn: () => adminDesignationsApi.getAll(params).then((r) => r.data),
  })
}

export function useCreateDesignation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminDesignationsApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'designations'] }),
  })
}

export function useUpdateDesignation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminDesignationsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'designations'] }),
  })
}

// Work Schedules
export function useAdminWorkSchedules(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'work_schedules', 'list', params],
    queryFn: () => adminWorkSchedulesApi.getAll(params).then((r) => r.data),
  })
}

export function useCreateWorkSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminWorkSchedulesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'work_schedules'] }),
  })
}

export function useUpdateWorkSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      adminWorkSchedulesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'work_schedules'] }),
  })
}

// Warning Letters
export function useAdminWarningLetters() {
  return useQuery({
    queryKey: ['admin', 'warning_letters', 'list'],
    queryFn: () => adminWarningLettersApi.getAll().then((r) => r.data),
  })
}

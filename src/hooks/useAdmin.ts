import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '@/api/admin/users'
import { adminCompaniesApi } from '@/api/admin/companies'
import { adminAgenciesApi } from '@/api/admin/agencies'
import { adminLeavePoliciesApi } from '@/api/admin/leavePolicies'
import { adminPublicHolidaysApi } from '@/api/admin/publicHolidays'
import { adminLeaveApplicationsApi } from '@/api/admin/leaveApplications'
import { adminWarningLettersApi } from '@/api/admin/warningLetters'
import { adminDashboardApi } from '@/api/admin/dashboard'

// Dashboard
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminDashboardApi.get().then((r) => r.data),
    staleTime: 30_000,
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

// Leave Policies
export function useAdminLeavePolicies() {
  return useQuery({
    queryKey: ['admin', 'leave_policies', 'list'],
    queryFn: () => adminLeavePoliciesApi.getAll().then((r) => r.data),
    staleTime: 5 * 60_000,
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

// Warning Letters
export function useAdminWarningLetters() {
  return useQuery({
    queryKey: ['admin', 'warning_letters', 'list'],
    queryFn: () => adminWarningLettersApi.getAll().then((r) => r.data),
  })
}

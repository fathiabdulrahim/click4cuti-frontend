import { api } from '../axios'
import type { LeaveApplication } from '@/lib/types'

export const adminLeaveApplicationsApi = {
  getAll: (params?: Record<string, string>) => api.get<LeaveApplication[]>('/admin/leave_applications', { params }),
  getOne: (id: string) => api.get<LeaveApplication>(`/admin/leave_applications/${id}`),
  update: (id: string, payload: { status: string; reviewer_remarks?: string }) =>
    api.put<LeaveApplication>(`/admin/leave_applications/${id}`, { leave_application: payload }),
  cancel: (id: string) => api.delete(`/admin/leave_applications/${id}`),
}

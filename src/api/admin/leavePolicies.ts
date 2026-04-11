import { api } from '../axios'
import type { LeavePolicy, LeaveType } from '@/lib/types'

export const adminLeavePoliciesApi = {
  getAll: () => api.get<LeavePolicy[]>('/admin/leave_policies'),
  getOne: (id: string) => api.get<LeavePolicy>(`/admin/leave_policies/${id}`),
  create: (payload: Record<string, unknown>) => api.post<LeavePolicy>('/admin/leave_policies', { leave_policy: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<LeavePolicy>(`/admin/leave_policies/${id}`, { leave_policy: payload }),
  deactivate: (id: string) => api.delete(`/admin/leave_policies/${id}`),
}

export const adminLeaveTypesApi = {
  getAll: (params?: Record<string, string>) => api.get<LeaveType[]>('/admin/leave_types', { params }),
  create: (payload: Record<string, unknown>) => api.post<LeaveType>('/admin/leave_types', { leave_type: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<LeaveType>(`/admin/leave_types/${id}`, { leave_type: payload }),
  deactivate: (id: string) => api.delete(`/admin/leave_types/${id}`),
}

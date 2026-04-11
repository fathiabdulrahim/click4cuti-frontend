import { api } from './axios'
import type { LeaveApplication } from '@/lib/types'

export interface ApplyLeavePayload {
  leave_type_id: string
  start_date: string
  end_date: string
  reason: string
  extended_reason?: string
  leave_day_details_attributes?: { leave_date: string; day_type: string }[]
}

export const leavesApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<LeaveApplication[]>('/leaves', { params }),

  getOne: (id: string) =>
    api.get<LeaveApplication>(`/leaves/${id}`),

  apply: (payload: ApplyLeavePayload) =>
    api.post<LeaveApplication>('/leaves', { leave: payload }),

  update: (id: string, payload: Partial<ApplyLeavePayload>) =>
    api.put<LeaveApplication>(`/leaves/${id}`, { leave: payload }),

  cancel: (id: string) =>
    api.delete(`/leaves/${id}`),
}

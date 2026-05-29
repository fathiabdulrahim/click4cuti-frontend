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

  apply: (payload: ApplyLeavePayload, file?: File | null) => {
    if (!file) {
      return api.post<LeaveApplication>('/leaves', { leave: payload })
    }
    const fd = new FormData()
    fd.append('leave[leave_type_id]', payload.leave_type_id)
    fd.append('leave[start_date]', payload.start_date)
    fd.append('leave[end_date]', payload.end_date)
    fd.append('leave[reason]', payload.reason)
    if (payload.extended_reason) fd.append('leave[extended_reason]', payload.extended_reason)
    for (const d of payload.leave_day_details_attributes ?? []) {
      fd.append('leave[leave_day_details_attributes][][leave_date]', d.leave_date)
      fd.append('leave[leave_day_details_attributes][][day_type]', d.day_type)
    }
    fd.append('leave[document]', file)
    // Content-Type: null lets the browser set multipart/form-data with the boundary;
    // the axios instance default of application/json would otherwise coerce FormData to JSON.
    return api.post<LeaveApplication>('/leaves', fd, { headers: { 'Content-Type': null } })
  },

  update: (id: string, payload: Partial<ApplyLeavePayload>) =>
    api.put<LeaveApplication>(`/leaves/${id}`, { leave: payload }),

  cancel: (id: string) =>
    api.delete(`/leaves/${id}`),
}

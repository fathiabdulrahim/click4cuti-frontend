import { api } from './axios'
import type { LeaveApplication } from '@/lib/types'

export const teamRequestsApi = {
  getAll: () => api.get<LeaveApplication[]>('/team_requests'),

  update: (id: string, payload: { status: string; reviewer_remarks?: string }) =>
    api.put<LeaveApplication>(`/team_requests/${id}`, { leave: payload }),
}

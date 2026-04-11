import { api } from '../axios'
import type { WorkSchedule } from '@/lib/types'

export const adminWorkSchedulesApi = {
  getAll: (params?: Record<string, string>) => api.get<WorkSchedule[]>('/admin/work_schedules', { params }),
  getOne: (id: string) => api.get<WorkSchedule>(`/admin/work_schedules/${id}`),
  create: (payload: Record<string, unknown>) => api.post<WorkSchedule>('/admin/work_schedules', { work_schedule: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<WorkSchedule>(`/admin/work_schedules/${id}`, { work_schedule: payload }),
  deactivate: (id: string) => api.delete(`/admin/work_schedules/${id}`),
}

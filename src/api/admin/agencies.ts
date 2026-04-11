import { api } from '../axios'
import type { HrAgency } from '@/lib/types'

export const adminAgenciesApi = {
  getAll: () => api.get<HrAgency[]>('/admin/agencies'),
  getOne: (id: string) => api.get<HrAgency>(`/admin/agencies/${id}`),
  create: (payload: Record<string, unknown>) => api.post<HrAgency>('/admin/agencies', { agency: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<HrAgency>(`/admin/agencies/${id}`, { agency: payload }),
  deactivate: (id: string) => api.delete(`/admin/agencies/${id}`),
}

import { api } from '../axios'
import type { Designation } from '@/lib/types'

export const adminDesignationsApi = {
  getAll: (params?: Record<string, string>) => api.get<Designation[]>('/admin/designations', { params }),
  getOne: (id: string) => api.get<Designation>(`/admin/designations/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Designation>('/admin/designations', { designation: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<Designation>(`/admin/designations/${id}`, { designation: payload }),
  deactivate: (id: string) => api.delete(`/admin/designations/${id}`),
}

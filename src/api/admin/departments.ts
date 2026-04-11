import { api } from '../axios'
import type { Department } from '@/lib/types'

export const adminDepartmentsApi = {
  getAll: (params?: Record<string, string>) => api.get<Department[]>('/admin/departments', { params }),
  getOne: (id: string) => api.get<Department>(`/admin/departments/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Department>('/admin/departments', { department: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<Department>(`/admin/departments/${id}`, { department: payload }),
  deactivate: (id: string) => api.delete(`/admin/departments/${id}`),
}

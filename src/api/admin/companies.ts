import { api } from '../axios'
import type { Company } from '@/lib/types'

export const adminCompaniesApi = {
  getAll: () => api.get<Company[]>('/admin/companies'),
  getOne: (id: string) => api.get<Company>(`/admin/companies/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Company>('/admin/companies', { company: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<Company>(`/admin/companies/${id}`, { company: payload }),
  deactivate: (id: string) => api.delete(`/admin/companies/${id}`),
}

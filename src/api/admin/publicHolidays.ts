import { api } from '../axios'
import type { PublicHoliday } from '@/lib/types'

export const adminPublicHolidaysApi = {
  getAll: (year?: number) => api.get<PublicHoliday[]>('/admin/public_holidays', { params: year ? { year } : undefined }),
  create: (payload: Record<string, unknown>) => api.post<PublicHoliday>('/admin/public_holidays', { public_holiday: payload }),
  update: (id: string, payload: Record<string, unknown>) => api.put<PublicHoliday>(`/admin/public_holidays/${id}`, { public_holiday: payload }),
  delete: (id: string) => api.delete(`/admin/public_holidays/${id}`),
}

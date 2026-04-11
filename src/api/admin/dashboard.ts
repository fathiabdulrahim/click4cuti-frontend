import { api } from '../axios'
import type { AdminDashboardStats } from '@/lib/types'

export const adminDashboardApi = {
  get: () => api.get<AdminDashboardStats>('/admin/dashboard'),
}

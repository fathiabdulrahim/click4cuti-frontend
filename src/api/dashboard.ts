import { api } from './axios'
import type { DashboardStats } from '@/lib/types'

export const dashboardApi = {
  get: () => api.get<DashboardStats>('/dashboard'),
}

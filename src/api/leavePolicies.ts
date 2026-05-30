import { api } from './axios'
import type { LeavePolicy } from '@/lib/types'

export const leavePoliciesApi = {
  getAll: () => api.get<LeavePolicy[]>('/leave_policies'),
}
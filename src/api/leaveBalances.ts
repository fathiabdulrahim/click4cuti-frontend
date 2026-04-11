import { api } from './axios'
import type { LeaveBalance } from '@/lib/types'

export const leaveBalancesApi = {
  getAll: (year?: number) =>
    api.get<LeaveBalance[]>('/leave_balances', { params: year ? { year } : undefined }),
}

import { api } from '../axios'
import type { ClaimBalance } from '@/lib/types'

export const claimBalancesApi = {
  list: (userId: string, year?: number) =>
    api.get<ClaimBalance[]>(`/admin/users/${userId}/claim_balances`, {
      params: year ? { year } : undefined,
    }),
}

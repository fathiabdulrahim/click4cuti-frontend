import { useQuery } from '@tanstack/react-query'
import { leaveBalancesApi } from '@/api/leaveBalances'

export function useLeaveBalances(year?: number) {
  return useQuery({
    queryKey: ['leave_balances', year],
    queryFn: () => leaveBalancesApi.getAll(year).then((r) => r.data),
  })
}

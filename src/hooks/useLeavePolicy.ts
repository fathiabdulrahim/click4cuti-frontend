import { useQuery } from '@tanstack/react-query'
import { leavePoliciesApi } from '@/api/leavePolicies'

export function useLeavePolicy() {
  return useQuery({
    queryKey: ['leave_policies'],
    queryFn: () => leavePoliciesApi.getAll().then((r) => r.data[0]),
    staleTime: 5 * 60_000,
  })
}
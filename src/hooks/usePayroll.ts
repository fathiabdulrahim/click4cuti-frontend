import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { payrollApi, type PayrollUpdate } from '@/api/admin/payroll'

const key = (userId: string) => ['admin', 'users', userId, 'payroll'] as const

export function usePayroll(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => payrollApi.get(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useUpdatePayroll(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PayrollUpdate) =>
      payrollApi.update(userId, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

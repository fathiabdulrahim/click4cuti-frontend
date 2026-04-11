import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leavesApi, type ApplyLeavePayload } from '@/api/leaves'

export const LEAVES_KEY = ['leaves', 'list'] as const

export function useLeavesList(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...LEAVES_KEY, params],
    queryFn: () => leavesApi.getAll(params).then((r) => r.data),
  })
}

export function useLeave(id: string) {
  return useQuery({
    queryKey: ['leaves', id],
    queryFn: () => leavesApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useApplyLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ApplyLeavePayload) => leavesApi.apply(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAVES_KEY })
      qc.invalidateQueries({ queryKey: ['leave_balances'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCancelLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => leavesApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAVES_KEY })
      qc.invalidateQueries({ queryKey: ['leave_balances'] })
    },
  })
}

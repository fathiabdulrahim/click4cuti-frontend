import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supervisorsApi, type SupervisorPayload } from '@/api/admin/supervisors'

const key = (userId: string) => ['admin', 'users', userId, 'supervisors'] as const

export function useUserSupervisors(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => supervisorsApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useCreateSupervisor(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SupervisorPayload) =>
      supervisorsApi.create(userId, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useDeleteSupervisor(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => supervisorsApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

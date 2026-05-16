import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '@/api/admin/users'

const key = (id: string) => ['admin', 'users', id] as const

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: key(id),
    queryFn: () => adminUsersApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useUpdateAdminUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminUsersApi.update(id, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key(id) })
      qc.invalidateQueries({ queryKey: ['admin', 'users', 'list'] })
    },
  })
}

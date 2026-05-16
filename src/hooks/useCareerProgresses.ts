import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { careerProgressesApi, type CareerProgressPayload } from '@/api/admin/careerProgresses'

const key = (userId: string) => ['admin', 'users', userId, 'career-progresses'] as const

export function useCareerProgresses(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => careerProgressesApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useCreateCareerProgress(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CareerProgressPayload) =>
      careerProgressesApi.create(userId, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useDeleteCareerProgress(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => careerProgressesApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

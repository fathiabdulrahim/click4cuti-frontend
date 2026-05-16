import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminTrainingsApi } from '@/api/admin/trainings'
import type { TrainingPayload } from '@/api/trainings'

const key = (userId: string) => ['admin', 'users', userId, 'trainings'] as const

export function useAdminTrainings(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => adminTrainingsApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useAdminCreateTraining(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, file }: { payload: TrainingPayload; file?: File | null }) =>
      adminTrainingsApi.create(userId, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminUpdateTraining(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
      file,
    }: { id: string; payload: Partial<TrainingPayload>; file?: File | null }) =>
      adminTrainingsApi.update(userId, id, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminDeleteTraining(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminTrainingsApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

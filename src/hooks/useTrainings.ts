import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trainingsApi, type TrainingPayload } from '@/api/trainings'

const ROOT = ['profile', 'trainings'] as const

export function useTrainings() {
  return useQuery({ queryKey: ROOT, queryFn: () => trainingsApi.list().then((r) => r.data) })
}

export function useCreateTraining() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, file }: { payload: TrainingPayload; file?: File | null }) =>
      trainingsApi.create(payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateTraining() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
      file,
    }: {
      id: string
      payload: Partial<TrainingPayload>
      file?: File | null
    }) => trainingsApi.update(id, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteTraining() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => trainingsApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

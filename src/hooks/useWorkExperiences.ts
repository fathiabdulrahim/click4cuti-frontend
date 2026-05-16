import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workExperiencesApi, type WorkExperiencePayload } from '@/api/workExperiences'

const ROOT = ['profile', 'work-experiences'] as const

export function useWorkExperiences() {
  return useQuery({
    queryKey: ROOT,
    queryFn: () => workExperiencesApi.list().then((r) => r.data),
  })
}

export function useCreateWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WorkExperiencePayload) =>
      workExperiencesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WorkExperiencePayload> }) =>
      workExperiencesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => workExperiencesApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

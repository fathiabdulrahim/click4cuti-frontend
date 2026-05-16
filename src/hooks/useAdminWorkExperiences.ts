import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminWorkExperiencesApi } from '@/api/admin/workExperiences'
import type { WorkExperiencePayload } from '@/api/workExperiences'

const key = (userId: string) => ['admin', 'users', userId, 'work-experiences'] as const

export function useAdminWorkExperiences(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => adminWorkExperiencesApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useAdminCreateWorkExperience(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WorkExperiencePayload) =>
      adminWorkExperiencesApi.create(userId, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminUpdateWorkExperience(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WorkExperiencePayload> }) =>
      adminWorkExperiencesApi.update(userId, id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminDeleteWorkExperience(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminWorkExperiencesApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

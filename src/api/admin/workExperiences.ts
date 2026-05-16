import { api } from '../axios'
import type { WorkExperience } from '@/lib/types'
import type { WorkExperiencePayload } from '../workExperiences'

export const adminWorkExperiencesApi = {
  list: (userId: string) => api.get<WorkExperience[]>(`/admin/users/${userId}/work_experiences`),
  create: (userId: string, payload: WorkExperiencePayload) =>
    api.post<WorkExperience>(`/admin/users/${userId}/work_experiences`, { work_experience: payload }),
  update: (userId: string, id: string, payload: Partial<WorkExperiencePayload>) =>
    api.patch<WorkExperience>(`/admin/users/${userId}/work_experiences/${id}`, {
      work_experience: payload,
    }),
  destroy: (userId: string, id: string) => api.delete(`/admin/users/${userId}/work_experiences/${id}`),
}

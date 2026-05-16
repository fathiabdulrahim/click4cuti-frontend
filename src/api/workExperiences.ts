import { api } from './axios'
import type { WorkExperience } from '@/lib/types'

export interface WorkExperiencePayload {
  company_name: string
  position: string
  start_date: string
  end_date?: string | null
}

export const workExperiencesApi = {
  list: () => api.get<WorkExperience[]>('/work_experiences'),
  create: (payload: WorkExperiencePayload) =>
    api.post<WorkExperience>('/work_experiences', { work_experience: payload }),
  update: (id: string, payload: Partial<WorkExperiencePayload>) =>
    api.patch<WorkExperience>(`/work_experiences/${id}`, { work_experience: payload }),
  destroy: (id: string) => api.delete(`/work_experiences/${id}`),
}

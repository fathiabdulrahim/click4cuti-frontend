import { api } from '../axios'
import type { CareerProgress } from '@/lib/types'

export interface CareerProgressPayload {
  job_title: string
  effective_date: string
  manager_id?: string | null
  department_id?: string | null
  job_type?: string | null
  description?: string | null
}

export const careerProgressesApi = {
  list: (userId: string) =>
    api.get<CareerProgress[]>(`/admin/users/${userId}/career_progresses`),
  create: (userId: string, payload: CareerProgressPayload) =>
    api.post<CareerProgress>(`/admin/users/${userId}/career_progresses`, {
      career_progress: payload,
    }),
  update: (userId: string, id: string, payload: Partial<CareerProgressPayload>) =>
    api.patch<CareerProgress>(`/admin/users/${userId}/career_progresses/${id}`, {
      career_progress: payload,
    }),
  destroy: (userId: string, id: string) =>
    api.delete(`/admin/users/${userId}/career_progresses/${id}`),
}

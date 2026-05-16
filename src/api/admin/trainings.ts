import { api } from '../axios'
import type { Training } from '@/lib/types'
import type { TrainingPayload } from '../trainings'

function toFormData(payload: Partial<TrainingPayload>, file?: File | null) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) fd.append(k, String(v))
  }
  if (file) fd.append('certification', file)
  return fd
}

export const adminTrainingsApi = {
  list: (userId: string) => api.get<Training[]>(`/admin/users/${userId}/trainings`),
  create: (userId: string, payload: TrainingPayload, file?: File | null) =>
    api.post<Training>(`/admin/users/${userId}/trainings`, toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (userId: string, id: string, payload: Partial<TrainingPayload>, file?: File | null) =>
    api.patch<Training>(`/admin/users/${userId}/trainings/${id}`, toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  destroy: (userId: string, id: string) => api.delete(`/admin/users/${userId}/trainings/${id}`),
}

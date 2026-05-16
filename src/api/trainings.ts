import { api } from './axios'
import type { Training } from '@/lib/types'

export interface TrainingPayload {
  title: string
  start_date: string
  end_date: string
  description: string
  received_date: string
  expired_date: string
}

function toFormData(payload: Partial<TrainingPayload>, file?: File | null) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) fd.append(k, String(v))
  }
  if (file) fd.append('certification', file)
  return fd
}

export const trainingsApi = {
  list: () => api.get<Training[]>('/trainings'),
  create: (payload: TrainingPayload, file?: File | null) =>
    api.post<Training>('/trainings', toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, payload: Partial<TrainingPayload>, file?: File | null) =>
    api.patch<Training>(`/trainings/${id}`, toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  destroy: (id: string) => api.delete(`/trainings/${id}`),
}

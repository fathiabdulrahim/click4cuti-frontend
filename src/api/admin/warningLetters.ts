import { api } from '../axios'
import type { WarningLetter } from '@/lib/types'

export interface WarningLetterPayload {
  user_id: string
  reason: string
  details?: string | null
  action_taken?: string | null
  issued_date: string
}

function toFormData(payload: Partial<WarningLetterPayload>, file?: File | null) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) fd.append(`warning_letter[${k}]`, String(v))
  }
  if (file) fd.append('supporting_document', file)
  return fd
}

export const adminWarningLettersApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<WarningLetter[]>('/admin/warning_letters', { params }),
  getOne: (id: string) => api.get<WarningLetter>(`/admin/warning_letters/${id}`),
  acknowledge: (id: string) => api.put(`/admin/warning_letters/${id}`),
  create: (payload: WarningLetterPayload, file?: File | null) =>
    api.post<WarningLetter>('/admin/warning_letters', toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, payload: Partial<WarningLetterPayload>, file?: File | null) =>
    api.patch<WarningLetter>(`/admin/warning_letters/${id}`, toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

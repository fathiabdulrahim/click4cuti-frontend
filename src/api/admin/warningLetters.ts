import { api } from '../axios'
import type { WarningLetter } from '@/lib/types'

export const adminWarningLettersApi = {
  getAll: () => api.get<WarningLetter[]>('/admin/warning_letters'),
  getOne: (id: string) => api.get<WarningLetter>(`/admin/warning_letters/${id}`),
  acknowledge: (id: string) => api.put(`/admin/warning_letters/${id}`),
}

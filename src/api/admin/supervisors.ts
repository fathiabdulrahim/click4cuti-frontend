import { api } from '../axios'
import type { UserSupervisor, SupervisorCategory } from '@/lib/types'

export interface SupervisorPayload {
  supervisor_id: string
  category: SupervisorCategory
  level: 1 | 2
}

export const supervisorsApi = {
  list: (userId: string) =>
    api.get<UserSupervisor[]>(`/admin/users/${userId}/supervisors`),
  create: (userId: string, payload: SupervisorPayload) =>
    api.post<UserSupervisor>(`/admin/users/${userId}/supervisors`, { supervisor: payload }),
  destroy: (userId: string, id: string) =>
    api.delete(`/admin/users/${userId}/supervisors/${id}`),
}

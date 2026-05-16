import { api } from '../axios'
import type { Branch } from '@/lib/types'

export interface BranchPayload {
  name: string
  address?: string | null
  state?: string | null
  is_active?: boolean
}

export const branchesApi = {
  list: () => api.get<Branch[]>('/admin/branches'),
  create: (payload: BranchPayload) => api.post<Branch>('/admin/branches', { branch: payload }),
  update: (id: string, payload: Partial<BranchPayload>) =>
    api.patch<Branch>(`/admin/branches/${id}`, { branch: payload }),
  destroy: (id: string) => api.delete(`/admin/branches/${id}`),
}

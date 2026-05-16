import { api } from '../axios'
import type { ClaimType } from '@/lib/types'

export interface ClaimTypePayload {
  name: string
  code?: string | null
  description?: string | null
  default_application_limit?: number | null
  default_annual_limit?: number | null
  requires_document?: boolean
  is_active?: boolean
}

export const claimTypesApi = {
  list: () => api.get<ClaimType[]>('/admin/claim_types'),
  create: (payload: ClaimTypePayload) =>
    api.post<ClaimType>('/admin/claim_types', { claim_type: payload }),
  update: (id: string, payload: Partial<ClaimTypePayload>) =>
    api.patch<ClaimType>(`/admin/claim_types/${id}`, { claim_type: payload }),
  destroy: (id: string) => api.delete(`/admin/claim_types/${id}`),
}

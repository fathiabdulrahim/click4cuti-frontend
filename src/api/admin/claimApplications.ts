import { api } from '../axios'
import type { ClaimApplication } from '@/lib/types'

export interface ClaimApplicationPayload {
  claim_type_id: string
  amount: number
  claim_date: string
  reason: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  reviewer_remarks?: string | null
}

export const claimApplicationsApi = {
  list: (userId: string) =>
    api.get<ClaimApplication[]>(`/admin/users/${userId}/claim_applications`),
  create: (userId: string, payload: ClaimApplicationPayload) =>
    api.post<ClaimApplication>(`/admin/users/${userId}/claim_applications`, {
      claim_application: payload,
    }),
  update: (userId: string, id: string, payload: Partial<ClaimApplicationPayload>) =>
    api.patch<ClaimApplication>(`/admin/users/${userId}/claim_applications/${id}`, {
      claim_application: payload,
    }),
  destroy: (userId: string, id: string) =>
    api.delete(`/admin/users/${userId}/claim_applications/${id}`),
}

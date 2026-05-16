import { api } from '../axios'
import type { UserClaimPolicy } from '@/lib/types'

export interface ClaimPolicyPayload {
  application_limit?: number | null
  annual_limit?: number | null
  is_unlimited_application?: boolean
  is_unlimited_annual?: boolean
  is_included?: boolean
  remarks?: string | null
}

export const claimPoliciesApi = {
  list: (userId: string) =>
    api.get<UserClaimPolicy[]>(`/admin/users/${userId}/claim_policies`),
  update: (userId: string, id: string, payload: ClaimPolicyPayload) =>
    api.patch<UserClaimPolicy>(`/admin/users/${userId}/claim_policies/${id}`, {
      user_claim_policy: payload,
    }),
}

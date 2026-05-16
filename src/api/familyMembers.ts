import { api } from './axios'
import type { FamilyMember } from '@/lib/types'

export interface FamilyMemberPayload {
  relation: 'SPOUSE' | 'CHILD' | 'PARENT'
  first_name: string
  last_name?: string | null
  gender: 'MALE' | 'FEMALE'
  nric_or_passport?: string | null
  date_of_birth: string
  phone?: string | null
  email?: string | null
  address?: string | null
  employment_status: 'WORKING' | 'NOT_WORKING' | 'STUDYING' | 'RETIRED'
  oku_status?: boolean
}

export const familyMembersApi = {
  list: () => api.get<FamilyMember[]>('/family_members'),
  create: (payload: FamilyMemberPayload) =>
    api.post<FamilyMember>('/family_members', { family_member: payload }),
  update: (id: string, payload: Partial<FamilyMemberPayload>) =>
    api.patch<FamilyMember>(`/family_members/${id}`, { family_member: payload }),
  destroy: (id: string) => api.delete(`/family_members/${id}`),
}

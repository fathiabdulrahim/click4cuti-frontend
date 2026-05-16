import { api } from '../axios'
import type { FamilyMember } from '@/lib/types'
import type { FamilyMemberPayload } from '../familyMembers'

export const adminFamilyMembersApi = {
  list: (userId: string) => api.get<FamilyMember[]>(`/admin/users/${userId}/family_members`),
  create: (userId: string, payload: FamilyMemberPayload) =>
    api.post<FamilyMember>(`/admin/users/${userId}/family_members`, { family_member: payload }),
  update: (userId: string, id: string, payload: Partial<FamilyMemberPayload>) =>
    api.patch<FamilyMember>(`/admin/users/${userId}/family_members/${id}`, { family_member: payload }),
  destroy: (userId: string, id: string) => api.delete(`/admin/users/${userId}/family_members/${id}`),
}

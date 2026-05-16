import { api } from '../axios'
import type { EquipmentAssignment } from '@/lib/types'
import type { EquipmentAssignmentPayload } from '../equipmentAssignments'

function toFormData(payload: Partial<EquipmentAssignmentPayload>, file?: File | null) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) fd.append(k, String(v))
  }
  if (file) fd.append('supporting_document', file)
  return fd
}

export const adminEquipmentAssignmentsApi = {
  list: (userId: string) =>
    api.get<EquipmentAssignment[]>(`/admin/users/${userId}/equipment_assignments`),
  create: (userId: string, payload: EquipmentAssignmentPayload, file?: File | null) =>
    api.post<EquipmentAssignment>(
      `/admin/users/${userId}/equipment_assignments`,
      toFormData(payload, file),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
  update: (
    userId: string,
    id: string,
    payload: Partial<EquipmentAssignmentPayload>,
    file?: File | null,
  ) =>
    api.patch<EquipmentAssignment>(
      `/admin/users/${userId}/equipment_assignments/${id}`,
      toFormData(payload, file),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
  destroy: (userId: string, id: string) =>
    api.delete(`/admin/users/${userId}/equipment_assignments/${id}`),
}

import { api } from './axios'
import type { EquipmentAssignment } from '@/lib/types'

export interface EquipmentAssignmentPayload {
  equipment_type: string
  equipment_details: string
  date_received: string
  date_return?: string | null
}

function toFormData(payload: Partial<EquipmentAssignmentPayload>, file?: File | null) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) fd.append(k, String(v))
  }
  if (file) fd.append('supporting_document', file)
  return fd
}

export const equipmentAssignmentsApi = {
  list: () => api.get<EquipmentAssignment[]>('/equipment_assignments'),
  create: (payload: EquipmentAssignmentPayload, file?: File | null) =>
    api.post<EquipmentAssignment>('/equipment_assignments', toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, payload: Partial<EquipmentAssignmentPayload>, file?: File | null) =>
    api.patch<EquipmentAssignment>(`/equipment_assignments/${id}`, toFormData(payload, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  destroy: (id: string) => api.delete(`/equipment_assignments/${id}`),
}

import { api } from './axios'
import type { User } from '@/lib/types'

export type ProfileUpdatePayload = Partial<
  Pick<
    User,
    | 'full_name'
    | 'first_name'
    | 'last_name'
    | 'phone'
    | 'mobile_phone'
    | 'personal_email'
    | 'address'
    | 'mailing_address'
    | 'emergency_contact_name'
    | 'emergency_contact_phone'
    | 'nric'
    | 'nric_old'
    | 'nric_color'
    | 'date_of_birth'
    | 'place_of_birth'
    | 'race'
    | 'religion'
    | 'blood_type'
    | 'education_level'
    | 'marital_status'
    | 'nationality'
    | 'bumi_status'
    | 'driving_license_number'
    | 'driving_license_class'
    | 'driving_license_expiry'
    | 'notifications_enabled'
    | 'clock_in_selfie_enabled'
    | 'early_late_indicator_enabled'
    | 'attendance_confirmation_enabled'
  >
>

export const profileApi = {
  get: () => api.get<User>('/profile'),
  update: (payload: ProfileUpdatePayload) => api.put<User>('/profile', payload),
}

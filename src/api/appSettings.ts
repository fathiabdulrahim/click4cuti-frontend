import { api } from './axios'
import type { AppSettings } from '@/lib/types'

export const appSettingsApi = {
  get: () => api.get<AppSettings>('/app_settings'),
  update: (payload: Partial<AppSettings>) => api.patch<AppSettings>('/app_settings', payload),
}

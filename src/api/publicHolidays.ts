import { api } from './axios'
import type { PublicHoliday } from '@/lib/types'

export const publicHolidaysApi = {
  getAll: (year?: number) =>
    api.get<PublicHoliday[]>('/public_holidays', { params: year ? { year } : undefined }),
}

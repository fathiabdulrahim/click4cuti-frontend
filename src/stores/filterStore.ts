import { create } from 'zustand'
import type { LeaveStatus } from '@/lib/types'

interface FilterState {
  status: LeaveStatus | ''
  search: string
  dateFrom: string
  dateTo: string
  setStatus: (status: LeaveStatus | '') => void
  setSearch: (search: string) => void
  setDateRange: (from: string, to: string) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  status: '',
  search: '',
  dateFrom: '',
  dateTo: '',

  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo }),
  reset: () => set({ status: '', search: '', dateFrom: '', dateTo: '' }),
}))

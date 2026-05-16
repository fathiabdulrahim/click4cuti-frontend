import { api } from '../axios'
import type { PayrollPayload, UserBankDetail, UserStatutoryDetail, UserTaxRelief } from '@/lib/types'

export interface PayrollUpdate {
  bank_detail?: Partial<UserBankDetail>
  statutory_detail?: Partial<UserStatutoryDetail>
  tax_relief?: Partial<UserTaxRelief>
}

export const payrollApi = {
  get: (userId: string) => api.get<PayrollPayload>(`/admin/users/${userId}/payroll`),
  update: (userId: string, payload: PayrollUpdate) =>
    api.patch<PayrollPayload>(`/admin/users/${userId}/payroll`, { payroll: payload }),
}

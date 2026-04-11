import { api } from './axios'
import type { User, AdminUser } from '@/lib/types'

export interface LoginResponse {
  message: string
  user: User
}

export interface AdminLoginResponse {
  message: string
  admin_user: AdminUser
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/sign_in', { user: { email, password } }),

  logout: () =>
    api.delete('/auth/sign_out'),

  forgotPassword: (email: string) =>
    api.post('/auth/password', { user: { email } }),

  resetPassword: (token: string, password: string, passwordConfirmation: string) =>
    api.put('/auth/password', {
      user: { reset_password_token: token, password, password_confirmation: passwordConfirmation },
    }),

  adminLogin: (email: string, password: string) =>
    api.post<AdminLoginResponse>('/admin/auth/sign_in', { admin_user: { email, password } }),

  adminLogout: () =>
    api.delete('/admin/auth/sign_out'),

  adminForgotPassword: (email: string) =>
    api.post('/admin/auth/password', { admin_user: { email } }),
}

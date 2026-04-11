import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { queryClient } from '@/lib/query-client'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (response) => {
      const token = response.headers['authorization']?.replace('Bearer ', '') ?? ''
      setAuth(token, response.data.user)
      navigate('/dashboard')
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
    onError: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export function useAdminLogin() {
  const setAdminAuth = useAuthStore((s) => s.setAdminAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.adminLogin(email, password),
    onSuccess: (response) => {
      const token = response.headers['authorization']?.replace('Bearer ', '') ?? ''
      setAdminAuth(token, response.data.admin_user)
      navigate('/admin')
    },
  })
}

export function useAdminLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.adminLogout(),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      navigate('/admin/login')
    },
    onError: () => {
      clearAuth()
      queryClient.clear()
      navigate('/admin/login')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  })
}

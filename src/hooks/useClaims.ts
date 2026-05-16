import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { claimTypesApi, type ClaimTypePayload } from '@/api/admin/claimTypes'
import { claimPoliciesApi, type ClaimPolicyPayload } from '@/api/admin/claimPolicies'
import { claimBalancesApi } from '@/api/admin/claimBalances'
import {
  claimApplicationsApi,
  type ClaimApplicationPayload,
} from '@/api/admin/claimApplications'

// Claim Types ---------------------------------------------------
const TYPES = ['admin', 'claim-types'] as const

export function useClaimTypes() {
  return useQuery({ queryKey: TYPES, queryFn: () => claimTypesApi.list().then((r) => r.data) })
}
export function useCreateClaimType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: ClaimTypePayload) => claimTypesApi.create(p).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TYPES }),
  })
}
export function useUpdateClaimType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ClaimTypePayload> }) =>
      claimTypesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TYPES }),
  })
}
export function useDeleteClaimType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => claimTypesApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TYPES }),
  })
}

// Per-user Claim Policy ----------------------------------------
const policyKey = (userId: string) => ['admin', 'users', userId, 'claim-policies'] as const

export function useUserClaimPolicies(userId: string) {
  return useQuery({
    queryKey: policyKey(userId),
    queryFn: () => claimPoliciesApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}
export function useUpdateUserClaimPolicy(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ClaimPolicyPayload }) =>
      claimPoliciesApi.update(userId, id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: policyKey(userId) }),
  })
}

// Per-user Claim Balances --------------------------------------
const balKey = (userId: string, year?: number) =>
  ['admin', 'users', userId, 'claim-balances', year ?? 'current'] as const

export function useUserClaimBalances(userId: string, year?: number) {
  return useQuery({
    queryKey: balKey(userId, year),
    queryFn: () => claimBalancesApi.list(userId, year).then((r) => r.data),
    enabled: !!userId,
  })
}

// Per-user Claim Applications ----------------------------------
const histKey = (userId: string) => ['admin', 'users', userId, 'claim-applications'] as const

export function useUserClaimApplications(userId: string) {
  return useQuery({
    queryKey: histKey(userId),
    queryFn: () => claimApplicationsApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}
export function useCreateClaimApplication(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: ClaimApplicationPayload) =>
      claimApplicationsApi.create(userId, p).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: histKey(userId) }),
  })
}
export function useUpdateClaimApplication(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ClaimApplicationPayload> }) =>
      claimApplicationsApi.update(userId, id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: histKey(userId) }),
  })
}
export function useDeleteClaimApplication(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => claimApplicationsApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: histKey(userId) }),
  })
}

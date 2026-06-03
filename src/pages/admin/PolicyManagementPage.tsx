import { useState } from 'react'
import { useAdminLeavePolicies } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Clock, MoreVertical } from 'lucide-react'
import { CreatePolicyDialog } from '@/components/admin/CreatePolicyDialog'
import { EditPolicyDialog } from '@/components/admin/EditPolicyDialog'
import type { LeavePolicy } from '@/lib/types'

export default function PolicyManagementPage() {
  const { data: policies, isLoading } = useAdminLeavePolicies()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleEdit = (policy: LeavePolicy) => {
    setSelectedPolicy(policy)
    setShowEditDialog(true)
    setOpenMenuId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Policies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure company leave policies and types
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#FE4E01] hover:bg-[#FE4E01]/90"
        >
          + Create Policy
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !policies?.length ? (
        <EmptyState title="No policies found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy.id} className="border-0 shadow-sm bg-white overflow-hidden relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FE4E01]/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-[#FE4E01]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold truncate">{policy.name}</h3>
                      {policy.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {policy.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                      {policy.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setOpenMenuId(openMenuId === policy.id ? null : policy.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {openMenuId === policy.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                          <button
                            onClick={() => handleEdit(policy)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
                          >
                            Edit
                          </button>
                          {policy.is_active && (
                            <button
                              onClick={() => {
                                setSelectedPolicy(policy)
                                setShowEditDialog(true)
                                setOpenMenuId(null)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  {policy.advance_notice_days} days advance notice required
                </div>

                {policy.leave_types && policy.leave_types.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t">
                    {policy.leave_types.map((lt) => (
                      <Badge key={lt.id} variant="outline" className="text-[11px] font-normal">
                        {lt.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreatePolicyDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <EditPolicyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        policy={selectedPolicy}
      />
    </div>
  )
}

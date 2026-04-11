import { useAdminAgencies } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AgencyManagementPage() {
  const { data: agencies, isLoading } = useAdminAgencies()

  return (
    <div>
      <PageHeader title="Agency Management" description="Manage HR agencies" />
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !agencies?.length ? (
        <EmptyState title="No agencies found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell className="font-medium">{agency.name}</TableCell>
                <TableCell>{agency.email}</TableCell>
                <TableCell>{agency.phone ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={agency.is_active ? 'success' : 'secondary'}>
                    {agency.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

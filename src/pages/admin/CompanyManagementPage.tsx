import { useAdminCompanies } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CompanyManagementPage() {
  const { data: companies, isLoading } = useAdminCompanies()

  return (
    <div>
      <PageHeader title="Company Management" description="Manage client companies" />
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !companies?.length ? (
        <EmptyState title="No companies found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Registration No.</TableHead>
              <TableHead>HR Email</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.registration_number ?? '—'}</TableCell>
                <TableCell>{company.hr_email}</TableCell>
                <TableCell>{company.state ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={company.is_active ? 'success' : 'secondary'}>
                    {company.is_active ? 'Active' : 'Inactive'}
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

import { useAdminPublicHolidays } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

export default function HolidayManagementPage() {
  const year = new Date().getFullYear()
  const { data: holidays, isLoading } = useAdminPublicHolidays(year)

  return (
    <div>
      <PageHeader
        title={`Public Holidays ${year}`}
        description="Manage company public holidays"
      />
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !holidays?.length ? (
        <EmptyState title="No holidays configured" description="Add public holidays for this year." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>{formatDate(holiday.holiday_date)}</TableCell>
                <TableCell>
                  {holiday.is_mandatory ? (
                    <Badge variant="default">Mandatory</Badge>
                  ) : (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

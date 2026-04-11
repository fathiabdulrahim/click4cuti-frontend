import { useAdminPublicHolidays } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

export default function HolidayManagementPage() {
  const year = new Date().getFullYear()
  const { data: holidays, isLoading } = useAdminPublicHolidays(year)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Public Holidays {year}</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage company public holidays</p>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !holidays?.length ? (
        <EmptyState
          title="No holidays configured"
          description="Add public holidays for this year."
        />
      ) : (
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Holiday</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                          <CalendarDays className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-medium">{holiday.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(holiday.holiday_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={holiday.is_mandatory ? 'default' : 'secondary'}>
                        {holiday.is_mandatory ? 'Mandatory' : 'Optional'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

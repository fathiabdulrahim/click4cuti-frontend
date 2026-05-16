import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EquipmentAdminTab({ userId }: { userId: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">EquipmentAdminTab</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon. (userId: {userId})</p>
      </CardContent>
    </Card>
  )
}

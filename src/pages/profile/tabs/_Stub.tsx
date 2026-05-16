import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StubTab({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon.</p>
      </CardContent>
    </Card>
  )
}

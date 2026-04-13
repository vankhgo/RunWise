import { type ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border-dashed border-border/80 bg-card/80">
      <CardContent className="space-y-3 p-8 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
        {action ? <div className="pt-1">{action}</div> : null}
      </CardContent>
    </Card>
  )
}

import { BookmarkMinus, CalendarDays, CornerDownLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SavedPlanView } from "@/types/domain"

type SavedPlanCardProps = {
  item: SavedPlanView
  onReuse: (item: SavedPlanView) => void
  onRemove: (item: SavedPlanView) => void
}

export function SavedPlanCard({ item, onReuse, onRemove }: SavedPlanCardProps) {
  return (
    <Card className="rounded-3xl border-border/80">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold leading-tight">
              {item.customName || item.recommendation.output.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{item.recommendation.output.label}</p>
          </div>
          <Badge variant="outline">Saved</Badge>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.notes || item.recommendation.output.explanation}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} /> {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onReuse(item)}>
            <CornerDownLeft size={14} /> Use Again
          </Button>
          <Button type="button" variant="ghost" className="rounded-xl" onClick={() => onRemove(item)}>
            <BookmarkMinus size={14} /> Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

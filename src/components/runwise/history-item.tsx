import { Clock3, Repeat2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { RecommendationRecord } from "@/types/domain"

type HistoryItemProps = {
  item: RecommendationRecord
  onUseAgain: (item: RecommendationRecord) => void
}

export function HistoryItem({ item, onUseAgain }: HistoryItemProps) {
  const weatherSummary =
    item.weather.status === "ok"
      ? `${item.weather.condition ?? "unknown"} • ${
          typeof item.weather.tempC === "number" ? `${item.weather.tempC.toFixed(1)}°C` : "temp n/a"
        }`
      : "weather unavailable"

  return (
    <Card className="rounded-2xl border-border/70">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold leading-tight">{item.output.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.planner.targetDistanceKm} km • {item.planner.availableTimeMin} min •{" "}
              <span className="capitalize">{item.planner.preferredIntensity}</span> •{" "}
              {item.planner.runGoal.replace("_", " ")}
            </p>
          </div>
          <Badge variant="outline">{item.output.label}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} /> {new Date(item.createdAt).toLocaleString()}
          </span>
          <Badge variant="secondary" className="capitalize">
            {weatherSummary}
          </Badge>
        </div>

        <div>
          <Button type="button" variant="ghost" className="rounded-xl" onClick={() => onUseAgain(item)}>
            <Repeat2 size={14} /> Use Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { CloudSun, Droplets, MapPin, Timer, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecommendationRecord } from "@/types/domain"

type RecommendationCardProps = {
  recommendation: RecommendationRecord
  onSave: (recommendation: RecommendationRecord) => void
  saveDisabled?: boolean
}

export function RecommendationCard({ recommendation, onSave, saveDisabled }: RecommendationCardProps) {
  const { output, weather } = recommendation

  return (
    <Card className="rounded-[28px] border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-md">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft" className="text-xs">
            {output.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Recommendation
          </Badge>
        </div>
        <CardTitle className="text-2xl leading-tight sm:text-3xl">{output.title}</CardTitle>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{output.explanation}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
            <p className="text-xs text-muted-foreground">Suggested Distance</p>
            <p className="mt-1 text-sm font-semibold">{output.suggestedDistanceKm} km</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
            <p className="text-xs text-muted-foreground">Suggested Duration</p>
            <p className="mt-1 text-sm font-semibold">{output.suggestedDurationMin} min</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
            <p className="text-xs text-muted-foreground">Recommended Intensity</p>
            <p className="mt-1 text-sm font-semibold capitalize">{output.recommendedIntensity}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <CloudSun size={16} className="text-primary" />
            Weather-aware note
          </div>
          <p className="text-sm text-muted-foreground">{output.weatherNote}</p>
          {weather.status === "ok" ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {weather.locationLabel ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {weather.locationLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Droplets size={14} /> {(weather.precipMm ?? 0).toFixed(1)} mm
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap size={14} /> {(weather.windKph ?? 0).toFixed(0)} kph
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer size={14} /> {(weather.tempC ?? 0).toFixed(1)}
                {"\u00b0"}C
              </span>
            </div>
          ) : null}
        </div>

        <div>
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-xl px-5"
            onClick={() => onSave(recommendation)}
            disabled={saveDisabled}
          >
            Save Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

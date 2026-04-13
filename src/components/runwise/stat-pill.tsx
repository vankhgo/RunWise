import { Activity, Bookmark, Gauge } from "lucide-react"

import { cn } from "@/lib/utils"

type StatPillProps = {
  label: string
  value: string
  icon: "plans" | "saved" | "intensity"
}

const iconMap = {
  plans: Activity,
  saved: Bookmark,
  intensity: Gauge,
} as const

export function StatPill({ label, value, icon }: StatPillProps) {
  const Icon = iconMap[icon]

  return (
    <div
      className={cn(
        "flex min-w-[140px] items-center gap-3 rounded-2xl border border-border/80 bg-card/85 px-4 py-3 shadow-xs backdrop-blur",
      )}
    >
      <span className="rounded-xl bg-primary/10 p-2 text-primary">
        <Icon size={14} />
      </span>
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

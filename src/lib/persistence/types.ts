import type {
  PlannerInput,
  RecommendationOutput,
  RecommendationRecord,
  RunwiseStats,
  SavedPlan,
  SavedPlanView,
  WeatherSnapshot,
} from "@/types/domain"

export type SavePlanResult = {
  status: "saved" | "exists"
  savedPlan: SavedPlan
}

export interface PersistenceRepository {
  mode: "supabase" | "local"
  isReady: boolean
  getBlockerReason(): string | null
  saveGeneratedRecommendation(params: {
    planner: PlannerInput
    weather: WeatherSnapshot
    output: RecommendationOutput
  }): Promise<RecommendationRecord>
  listHistory(limit: number): Promise<RecommendationRecord[]>
  savePlan(params: {
    recommendationId: string
    customName?: string
    notes?: string
  }): Promise<SavePlanResult>
  removeSavedPlan(savedPlanId: string): Promise<void>
  listSavedPlans(): Promise<SavedPlanView[]>
  getStats(): Promise<RunwiseStats>
}

export function deriveStats(
  history: RecommendationRecord[],
  savedPlansCount: number,
): RunwiseStats {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000

  const plansLast7Days = history.filter((item) => new Date(item.createdAt).getTime() >= sevenDaysAgo).length

  const intensityCounts = history
    .filter((item) => new Date(item.createdAt).getTime() >= fourteenDaysAgo)
    .reduce<Record<string, number>>((acc, item) => {
      const key = item.output.recommendedIntensity
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

  const mostUsedIntensity =
    (Object.entries(intensityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as
      | "easy"
      | "moderate"
      | "hard"
      | undefined) ?? null

  return {
    plansLast7Days,
    savedPlansCount,
    mostUsedIntensity,
  }
}

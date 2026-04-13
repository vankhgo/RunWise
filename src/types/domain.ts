import type { CountryCode } from "@/lib/weather/locations"

export const intensityOptions = ["easy", "moderate", "hard"] as const
export type Intensity = (typeof intensityOptions)[number]

export const runGoalOptions = [
  "consistency",
  "endurance",
  "speed",
  "recovery",
  "stress_relief",
] as const
export type RunGoal = (typeof runGoalOptions)[number]

export const recommendationTypeOptions = [
  "easy_flow_run",
  "tempo_lite_session",
  "recovery_jog",
  "steady_endurance_run",
  "heat_adjusted_short_run",
  "weather_adjusted_easy_run",
] as const
export type RecommendationType = (typeof recommendationTypeOptions)[number]

export type PlannerInput = {
  targetDistanceKm: number
  availableTimeMin: number
  preferredIntensity: Intensity
  runGoal: RunGoal
  locationCountryCode: CountryCode
  locationPlaceValue: string
}

export type WeatherCondition = "clear" | "cloudy" | "rain" | "storm" | "unknown"

export type WeatherSnapshot = {
  status: "ok" | "unavailable" | "skipped"
  tempC?: number
  precipMm?: number
  windKph?: number
  condition?: WeatherCondition
  source?: string
  observedAt?: string
  locationLabel?: string
}

export type RecommendationOutput = {
  type: RecommendationType
  title: string
  label: string
  explanation: string
  weatherNote: string
  suggestedDistanceKm: number
  suggestedDurationMin: number
  recommendedIntensity: Intensity
}

export type RecommendationRecord = {
  id: string
  userId?: string
  createdAt: string
  updatedAt?: string
  planner: PlannerInput
  weather: WeatherSnapshot
  output: RecommendationOutput
}

export type SavedPlan = {
  id: string
  recommendationId: string
  customName?: string
  notes?: string
  createdAt: string
}

export type SavedPlanView = SavedPlan & {
  recommendation: RecommendationRecord
}

export type RunwiseStats = {
  plansLast7Days: number
  savedPlansCount: number
  mostUsedIntensity: Intensity | null
}

export type GenerateRecommendationResponse = {
  recommendation: RecommendationOutput
  weather: WeatherSnapshot
}

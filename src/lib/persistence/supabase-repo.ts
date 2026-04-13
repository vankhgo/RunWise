"use client"

import type { SupabaseClient } from "@supabase/supabase-js"

import { defaultLocationSelection, normalizeLocationSelection } from "@/lib/weather/locations"
import { deriveStats, type PersistenceRepository, type SavePlanResult } from "@/lib/persistence/types"
import { ensureAnonymousSession } from "@/lib/session/anonymous"
import { createClient } from "@/lib/supabase/client"
import type {
  Intensity,
  PlannerInput,
  RecommendationOutput,
  RecommendationRecord,
  SavedPlanView,
  WeatherSnapshot,
} from "@/types/domain"

type RecommendationRow = {
  id: string
  user_id: string
  target_distance_km: number
  available_time_min: number
  preferred_intensity: Intensity
  run_goal: PlannerInput["runGoal"]
  location_query: string | null
  weather_status: WeatherSnapshot["status"]
  weather_temp_c: number | null
  weather_precip_mm: number | null
  weather_wind_kph: number | null
  weather_condition: WeatherSnapshot["condition"] | null
  weather_observed_at: string | null
  recommendation_type: RecommendationOutput["type"]
  recommendation_title: string
  recommendation_label: string
  recommendation_explanation: string
  weather_note: string
  suggested_distance_km: number
  suggested_duration_min: number
  recommended_intensity: Intensity
  created_at: string
  updated_at: string
}

type SavedPlanRow = {
  id: string
  user_id: string
  recommendation_id: string
  custom_name: string | null
  notes: string | null
  created_at: string
  is_archived?: boolean
}

function serializeLocation(planner: PlannerInput) {
  return `${planner.locationCountryCode}|${planner.locationPlaceValue}`
}

function parseLocation(locationQuery: string | null) {
  if (!locationQuery) {
    return {
      locationCountryCode: defaultLocationSelection.countryCode,
      locationPlaceValue: defaultLocationSelection.placeValue,
    }
  }

  const [countryCode, placeValue] = locationQuery.split("|")
  const normalized = normalizeLocationSelection(countryCode, placeValue)

  return {
    locationCountryCode: normalized.countryCode,
    locationPlaceValue: normalized.placeValue,
  }
}

function toRecord(row: RecommendationRow): RecommendationRecord {
  const normalizedLocation = parseLocation(row.location_query)

  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    planner: {
      targetDistanceKm: Number(row.target_distance_km),
      availableTimeMin: Number(row.available_time_min),
      preferredIntensity: row.preferred_intensity,
      runGoal: row.run_goal,
      locationCountryCode: normalizedLocation.locationCountryCode,
      locationPlaceValue: normalizedLocation.locationPlaceValue,
    },
    weather: {
      status: row.weather_status,
      tempC: row.weather_temp_c ?? undefined,
      precipMm: row.weather_precip_mm ?? undefined,
      windKph: row.weather_wind_kph ?? undefined,
      condition: row.weather_condition ?? undefined,
      source: "open-meteo",
      observedAt: row.weather_observed_at ?? undefined,
    },
    output: {
      type: row.recommendation_type,
      title: row.recommendation_title,
      label: row.recommendation_label,
      explanation: row.recommendation_explanation,
      weatherNote: row.weather_note,
      suggestedDistanceKm: Number(row.suggested_distance_km),
      suggestedDurationMin: Number(row.suggested_duration_min),
      recommendedIntensity: row.recommended_intensity,
    },
  }
}

function fromDomain(params: {
  userId: string
  planner: PlannerInput
  weather: WeatherSnapshot
  output: RecommendationOutput
}) {
  const { userId, planner, weather, output } = params

  return {
    user_id: userId,
    target_distance_km: planner.targetDistanceKm,
    available_time_min: planner.availableTimeMin,
    preferred_intensity: planner.preferredIntensity,
    run_goal: planner.runGoal,
    location_query: serializeLocation(planner),
    weather_status: weather.status,
    weather_temp_c: weather.tempC ?? null,
    weather_precip_mm: weather.precipMm ?? null,
    weather_wind_kph: weather.windKph ?? null,
    weather_condition: weather.condition ?? null,
    weather_observed_at: weather.observedAt ?? null,
    recommendation_type: output.type,
    recommendation_title: output.title,
    recommendation_label: output.label,
    recommendation_explanation: output.explanation,
    weather_note: output.weatherNote,
    suggested_distance_km: output.suggestedDistanceKm,
    suggested_duration_min: output.suggestedDurationMin,
    recommended_intensity: output.recommendedIntensity,
  }
}

export async function createSupabaseRepository(): Promise<PersistenceRepository | null> {
  let supabase: SupabaseClient

  try {
    supabase = createClient()
  } catch {
    return null
  }

  const session = await ensureAnonymousSession(supabase)
  if (!session.userId) {
    return null
  }

  const userId = session.userId

  const check = await supabase.from("recommendations").select("id").limit(1)
  if (check.error && !check.error.message.toLowerCase().includes("row-level security")) {
    return null
  }

  const listHistoryImpl = async (limit: number) => {
    const result = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return (result.data as RecommendationRow[]).map(toRecord)
  }

  const listSavedPlansImpl = async () => {
    const savedResult = await supabase
      .from("saved_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (savedResult.error) {
      throw new Error(savedResult.error.message)
    }

    const savedRows = (savedResult.data as SavedPlanRow[]).filter((row) => !row.is_archived)
    if (savedRows.length === 0) return [] as SavedPlanView[]

    const recommendationIds = savedRows.map((row) => row.recommendation_id)

    const recommendationResult = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", userId)
      .in("id", recommendationIds)

    if (recommendationResult.error) {
      throw new Error(recommendationResult.error.message)
    }

    const byId = new Map(
      (recommendationResult.data as RecommendationRow[]).map((row) => [row.id, toRecord(row)]),
    )

    const views: SavedPlanView[] = []

    for (const row of savedRows) {
      const recommendation = byId.get(row.recommendation_id)
      if (!recommendation) continue

      views.push({
        id: row.id,
        recommendationId: row.recommendation_id,
        customName: row.custom_name ?? undefined,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
        recommendation,
      })
    }

    return views
  }

  return {
    mode: "supabase",
    isReady: true,
    getBlockerReason: () => null,
    async saveGeneratedRecommendation({ planner, weather, output }) {
      const payload = fromDomain({ userId, planner, weather, output })
      const inserted = await supabase
        .from("recommendations")
        .insert(payload)
        .select("*")
        .single<RecommendationRow>()

      if (inserted.error || !inserted.data) {
        throw new Error(inserted.error?.message ?? "Failed to save recommendation")
      }

      return toRecord(inserted.data)
    },
    async listHistory(limit) {
      return listHistoryImpl(limit)
    },
    async savePlan({ recommendationId, customName, notes }) {
      const payload = {
        user_id: userId,
        recommendation_id: recommendationId,
        custom_name: customName ?? null,
        notes: notes ?? null,
      }

      const result = await supabase
        .from("saved_plans")
        .upsert(payload, { onConflict: "user_id,recommendation_id", ignoreDuplicates: true })
        .select("*")

      if (result.error) {
        throw new Error(result.error.message)
      }

      const existingRows = result.data as SavedPlanRow[]
      const existing = existingRows[0]

      if (!existing) {
        const query = await supabase
          .from("saved_plans")
          .select("*")
          .eq("user_id", userId)
          .eq("recommendation_id", recommendationId)
          .single<SavedPlanRow>()

        if (query.error || !query.data) {
          throw new Error(query.error?.message ?? "Saved plan not found after save")
        }

        return {
          status: "exists",
          savedPlan: {
            id: query.data.id,
            recommendationId: query.data.recommendation_id,
            customName: query.data.custom_name ?? undefined,
            notes: query.data.notes ?? undefined,
            createdAt: query.data.created_at,
          },
        } satisfies SavePlanResult
      }

      return {
        status: "saved",
        savedPlan: {
          id: existing.id,
          recommendationId: existing.recommendation_id,
          customName: existing.custom_name ?? undefined,
          notes: existing.notes ?? undefined,
          createdAt: existing.created_at,
        },
      } satisfies SavePlanResult
    },
    async removeSavedPlan(savedPlanId: string) {
      const result = await supabase
        .from("saved_plans")
        .delete()
        .eq("id", savedPlanId)
        .eq("user_id", userId)

      if (result.error) {
        throw new Error(result.error.message)
      }
    },
    async listSavedPlans() {
      return listSavedPlansImpl()
    },
    async getStats() {
      const history = await listHistoryImpl(200)
      const saved = await listSavedPlansImpl()
      return deriveStats(history, saved.length)
    },
  }
}

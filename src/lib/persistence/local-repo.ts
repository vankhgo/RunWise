"use client"

import { deriveStats, type PersistenceRepository, type SavePlanResult } from "@/lib/persistence/types"
import type {
  PlannerInput,
  RecommendationOutput,
  RecommendationRecord,
  SavedPlan,
  SavedPlanView,
  WeatherSnapshot,
} from "@/types/domain"

const RECOMMENDATIONS_KEY = "runwise:recommendations"
const SAVED_PLANS_KEY = "runwise:saved_plans"

type LocalRecommendationRecord = RecommendationRecord

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function sortByDateDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

function getRecommendations() {
  return sortByDateDesc(readJson<LocalRecommendationRecord[]>(RECOMMENDATIONS_KEY, []))
}

function setRecommendations(items: LocalRecommendationRecord[]) {
  writeJson(RECOMMENDATIONS_KEY, items)
}

function getSavedPlans() {
  return sortByDateDesc(readJson<SavedPlan[]>(SAVED_PLANS_KEY, []))
}

function setSavedPlans(items: SavedPlan[]) {
  writeJson(SAVED_PLANS_KEY, items)
}

export function createLocalRepository(): PersistenceRepository {
  return {
    mode: "local",
    isReady: true,
    getBlockerReason: () => null,
    async saveGeneratedRecommendation(params: {
      planner: PlannerInput
      weather: WeatherSnapshot
      output: RecommendationOutput
    }) {
      const record: RecommendationRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        planner: params.planner,
        weather: params.weather,
        output: params.output,
      }

      const all = getRecommendations()
      all.unshift(record)
      setRecommendations(all)

      return record
    },
    async listHistory(limit: number) {
      return getRecommendations().slice(0, limit)
    },
    async savePlan({ recommendationId, customName, notes }) {
      const existing = getSavedPlans().find((item) => item.recommendationId === recommendationId)
      if (existing) {
        return {
          status: "exists",
          savedPlan: existing,
        } satisfies SavePlanResult
      }

      const savedPlan: SavedPlan = {
        id: crypto.randomUUID(),
        recommendationId,
        customName,
        notes,
        createdAt: new Date().toISOString(),
      }

      const all = getSavedPlans()
      all.unshift(savedPlan)
      setSavedPlans(all)

      return {
        status: "saved",
        savedPlan,
      }
    },
    async removeSavedPlan(savedPlanId: string) {
      const all = getSavedPlans().filter((item) => item.id !== savedPlanId)
      setSavedPlans(all)
    },
    async listSavedPlans() {
      const savedPlans = getSavedPlans()
      const recommendations = getRecommendations()
      const byId = new Map(recommendations.map((item) => [item.id, item]))

      const views: SavedPlanView[] = []

      for (const saved of savedPlans) {
        const recommendation = byId.get(saved.recommendationId)
        if (recommendation) {
          views.push({
            ...saved,
            recommendation,
          })
        }
      }

      return views
    },
    async getStats() {
      const history = getRecommendations()
      const savedCount = getSavedPlans().length
      return deriveStats(history, savedCount)
    },
  }
}

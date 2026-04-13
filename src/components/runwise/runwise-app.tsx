"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CloudSun, Compass, History, MapPin, Sparkles } from "lucide-react"

import { EmptyState } from "@/components/runwise/empty-state"
import { HistoryItem } from "@/components/runwise/history-item"
import { LoadingState } from "@/components/runwise/loading-state"
import { RecommendationCard } from "@/components/runwise/recommendation-card"
import { SavedPlanCard } from "@/components/runwise/saved-plan-card"
import { StatPill } from "@/components/runwise/stat-pill"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastViewport, useToasts } from "@/components/ui/toast"
import { PlannerForm } from "@/features/planner/components/PlannerForm"
import { usePlannerForm } from "@/features/planner/hooks/usePlannerForm"
import { plannerDefaults, type PlannerSchemaOutput } from "@/features/planner/schemas/plannerSchema"
import { createLocalRepository } from "@/lib/persistence/local-repo"
import { getRepository } from "@/lib/persistence"
import type { PersistenceRepository } from "@/lib/persistence/types"
import {
  type GenerateRecommendationResponse,
  type RecommendationRecord,
  type SavedPlanView,
  type RunwiseStats,
} from "@/types/domain"

const HISTORY_LIMIT = 30

const defaultStats: RunwiseStats = {
  plansLast7Days: 0,
  savedPlansCount: 0,
  mostUsedIntensity: null,
}

function MotionSection({ children, activeKey }: { children: React.ReactNode; activeKey: string }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function RunwiseApp() {
  const { form, persistLastInput, clearLastInput } = usePlannerForm()
  const { toasts, pushToast, dismissToast } = useToasts()

  const [repository, setRepository] = React.useState<PersistenceRepository | null>(null)
  const [activeTab, setActiveTab] = React.useState("planner")
  const [isBooting, setIsBooting] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const [latestRecommendation, setLatestRecommendation] = React.useState<RecommendationRecord | null>(null)
  const [history, setHistory] = React.useState<RecommendationRecord[]>([])
  const [savedPlans, setSavedPlans] = React.useState<SavedPlanView[]>([])
  const [stats, setStats] = React.useState<RunwiseStats>(defaultStats)

  const [statusMessage, setStatusMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const isRepositoryReady = Boolean(repository)

  const refreshData = React.useCallback(async (repoArg?: PersistenceRepository) => {
    const repo = repoArg ?? repository
    if (!repo) return

    const [nextHistory, nextSaved, nextStats] = await Promise.all([
      repo.listHistory(HISTORY_LIMIT),
      repo.listSavedPlans(),
      repo.getStats(),
    ])

    setHistory(nextHistory)
    setSavedPlans(nextSaved)
    setStats(nextStats)
    setLatestRecommendation((prev) => prev ?? nextHistory[0] ?? null)
  }, [repository])

  React.useEffect(() => {
    let active = true

    const init = async () => {
      let usedInitTimeoutFallback = false

      try {
        const repo = await Promise.race<PersistenceRepository>([
          getRepository(),
          new Promise<PersistenceRepository>((resolve) => {
            setTimeout(() => {
              usedInitTimeoutFallback = true
              resolve(createLocalRepository())
            }, 3500)
          }),
        ])
        if (!active) return
        setRepository(repo)
        await refreshData(repo)

        if (usedInitTimeoutFallback) {
          setStatusMessage("Storage init timed out. Switched to local persistence.")
        } else if (repo.mode === "local") {
          setStatusMessage(
            "Using local persistence. Connect Supabase tables for cross-device storage.",
          )
        }
      } catch {
        if (!active) return
        const local = createLocalRepository()
        setRepository(local)
        await refreshData(local)
        setStatusMessage("Switched to local persistence due to repository setup issues.")
      } finally {
        if (active) {
          setIsBooting(false)
        }
      }
    }

    init()

    return () => {
      active = false
    }
  }, [refreshData])

  const generateRecommendation = React.useCallback(
    async (values: PlannerSchemaOutput) => {
      if (!repository) {
        setErrorMessage("Planner storage is still initializing. Please try again in a moment.")
        return
      }

      setIsSubmitting(true)
      setErrorMessage("")
      setStatusMessage("")

      try {
        persistLastInput(values)

        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("Recommendation request failed")
        }

        const data = (await response.json()) as GenerateRecommendationResponse

        const persisted = await repository.saveGeneratedRecommendation({
          planner: values,
          weather: data.weather,
          output: data.recommendation,
        })

        setLatestRecommendation(persisted)
        await refreshData(repository)

        setStatusMessage("Recommendation ready. You can save this plan if it fits today.")
      } catch {
        setErrorMessage("Could not generate recommendation right now. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [persistLastInput, refreshData, repository],
  )

  const onSaveRecommendation = React.useCallback(
    async (recommendation: RecommendationRecord) => {
      if (!repository) {
        setErrorMessage("Storage is still initializing. Please try saving again shortly.")
        return
      }

      setIsSaving(true)
      setErrorMessage("")

      try {
        const result = await repository.savePlan({ recommendationId: recommendation.id })
        await refreshData(repository)

        setStatusMessage(
          result.status === "exists"
            ? "This recommendation is already in Saved Plans."
            : "Plan saved to Saved Plans.",
        )

        if (result.status === "exists") {
          pushToast({
            variant: "info",
            title: "Already saved",
            description: "This run plan is already in your saved plans.",
          })
        } else {
          pushToast({
            variant: "success",
            title: "Plan saved",
            description: "Saved to your plans.",
          })
        }
      } catch {
        setErrorMessage("Unable to save this plan. Please try again.")
        pushToast({
          variant: "error",
          title: "Could not save plan",
          description: "Failed to save plan. Please try again.",
        })
      } finally {
        setIsSaving(false)
      }
    },
    [pushToast, refreshData, repository],
  )

  const onRemoveSaved = React.useCallback(
    async (item: SavedPlanView) => {
      if (!repository) {
        setErrorMessage("Storage is still initializing. Please try removing again shortly.")
        return
      }

      try {
        await repository.removeSavedPlan(item.id)
        await refreshData(repository)
        setStatusMessage("Saved plan removed.")
      } catch {
        setErrorMessage("Unable to remove saved plan.")
      }
    },
    [refreshData, repository],
  )

  const onReusePlannerInput = React.useCallback(
    (record: RecommendationRecord) => {
      form.reset(record.planner)
      setActiveTab("planner")
      setStatusMessage("Planner prefilled from a previous recommendation.")
    },
    [form],
  )

  const onReuseSaved = React.useCallback(
    (item: SavedPlanView) => {
      form.reset(item.recommendation.planner)
      setActiveTab("planner")
      setStatusMessage("Planner prefilled from saved plan.")
    },
    [form],
  )

  const onResetPlanner = React.useCallback(() => {
    form.reset(plannerDefaults)
    clearLastInput()
    setLatestRecommendation(null)
    setErrorMessage("")
    setStatusMessage("Planner reset to default values.")
    setActiveTab("planner")
  }, [clearLastInput, form])

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-gradient-to-br from-[#f8fbff] via-[#f4fff9] to-background p-6 shadow-sm sm:p-8">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute -left-12 -bottom-16 h-44 w-44 rounded-full bg-sky-300/10 blur-3xl" aria-hidden />

        <div className="relative flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles size={14} /> Runwise
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Plan Today&apos;s Run Fast</h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              Enter distance, time, intensity, and goal. Runwise returns a practical recommendation with a weather-aware adjustment.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <StatPill label="Plans in 7 days" value={`${stats.plansLast7Days}`} icon="plans" />
            <StatPill label="Saved plans" value={`${stats.savedPlansCount}`} icon="saved" />
            <StatPill
              label="Most-used intensity"
              value={stats.mostUsedIntensity ? stats.mostUsedIntensity : "N/A"}
              icon="intensity"
            />
          </motion.div>
        </div>
      </section>

      <section>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="planner">
              <Compass size={15} className="mr-1.5" /> Planner
            </TabsTrigger>
            <TabsTrigger value="saved">
              <MapPin size={15} className="mr-1.5" /> Saved Plans
            </TabsTrigger>
            <TabsTrigger value="history">
              <History size={15} className="mr-1.5" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            <MotionSection activeKey="planner">
              <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                <PlannerForm
                  form={form}
                  isSubmitting={isSubmitting}
                  isInitializing={!isRepositoryReady}
                  onSubmit={generateRecommendation}
                  onReset={onResetPlanner}
                />

                {isBooting ? (
                  <LoadingState />
                ) : latestRecommendation ? (
                  <RecommendationCard
                    recommendation={latestRecommendation}
                    onSave={onSaveRecommendation}
                    saveDisabled={isSaving}
                  />
                ) : (
                  <EmptyState
                    title="No recommendation yet"
                    description="Fill in your planner inputs and generate your first run recommendation."
                  />
                )}
              </div>
            </MotionSection>
          </TabsContent>

          <TabsContent value="saved">
            <MotionSection activeKey="saved">
              {isBooting ? (
                <LoadingState />
              ) : savedPlans.length === 0 ? (
                <EmptyState
                  title="No saved plans yet"
                  description="Save a recommendation from the Planner tab to build your personal plan library."
                  action={
                    <Button type="button" onClick={() => setActiveTab("planner")}>
                      Go to Planner
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedPlans.map((item) => (
                    <SavedPlanCard
                      key={item.id}
                      item={item}
                      onReuse={onReuseSaved}
                      onRemove={onRemoveSaved}
                    />
                  ))}
                </div>
              )}
            </MotionSection>
          </TabsContent>

          <TabsContent value="history">
            <MotionSection activeKey="history">
              {isBooting ? (
                <LoadingState />
              ) : history.length === 0 ? (
                <EmptyState
                  title="No history yet"
                  description="Once you generate recommendations, your recent planning history will show here."
                  action={
                    <Button type="button" onClick={() => setActiveTab("planner")}>
                      Generate Recommendation
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <HistoryItem key={item.id} item={item} onUseAgain={onReusePlannerInput} />
                  ))}
                </div>
              )}
            </MotionSection>
          </TabsContent>
        </Tabs>
      </section>

      <Card className="rounded-2xl border-border/70 bg-card/80">
        <CardContent className="flex flex-col gap-2 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-muted-foreground">
            <CloudSun size={14} /> Weather-aware planning with graceful fallback when weather is unavailable.
          </p>
          <p className="text-xs text-muted-foreground">
            Persistence mode: <span className="font-medium text-foreground">{repository?.mode ?? "loading"}</span>
          </p>
        </CardContent>
      </Card>

      <div aria-live="polite" className="min-h-6 text-sm">
        {errorMessage ? <p className="text-destructive">{errorMessage}</p> : null}
        {!errorMessage && statusMessage ? <p className="text-muted-foreground">{statusMessage}</p> : null}
      </div>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </main>
  )
}

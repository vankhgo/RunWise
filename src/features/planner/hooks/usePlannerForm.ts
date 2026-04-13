"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  plannerDefaults,
  plannerSchema,
  type PlannerSchemaInput,
  type PlannerSchemaOutput,
} from "@/features/planner/schemas/plannerSchema"

const STORAGE_KEY = "runwise:last-planner"

export function usePlannerForm() {
  const form = useForm<PlannerSchemaInput, unknown, PlannerSchemaOutput>({
    resolver: zodResolver(plannerSchema),
    defaultValues: plannerDefaults,
    mode: "onSubmit",
  })

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = plannerSchema.safeParse(JSON.parse(raw))
      if (!parsed.success) return

      form.reset(parsed.data)
    } catch {
      // Ignore invalid local data.
    }
  }, [form])

  const persistLastInput = React.useCallback((values: PlannerSchemaOutput) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  }, [])

  const clearLastInput = React.useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    form,
    persistLastInput,
    clearLastInput,
  }
}

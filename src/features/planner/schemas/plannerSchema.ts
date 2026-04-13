import { z } from "zod"

import {
  countryCodes,
  defaultLocationSelection,
  getDefaultPlaceForCountry,
  isSupportedPlaceForCountry,
} from "@/lib/weather/locations"
import { intensityOptions, runGoalOptions } from "@/types/domain"

export const plannerSchema = z
  .object({
    targetDistanceKm: z.coerce
      .number()
      .min(1, "Distance must be at least 1 km")
      .max(30, "Distance must be 30 km or less"),
    availableTimeMin: z.coerce
      .number()
      .min(15, "Time must be at least 15 minutes")
      .max(180, "Time must be 180 minutes or less"),
    preferredIntensity: z.enum(intensityOptions),
    runGoal: z.enum(runGoalOptions),
    locationCountryCode: z.enum(countryCodes),
    locationPlaceValue: z.string().min(1, "Please choose a location"),
  })
  .superRefine((data, ctx) => {
    if (!isSupportedPlaceForCountry(data.locationCountryCode, data.locationPlaceValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["locationPlaceValue"],
        message: "Please choose a valid location for the selected country",
      })
    }
  })

export type PlannerSchemaInput = z.input<typeof plannerSchema>
export type PlannerSchemaOutput = z.output<typeof plannerSchema>

export const plannerDefaults: PlannerSchemaOutput = {
  targetDistanceKm: 5,
  availableTimeMin: 45,
  preferredIntensity: "moderate",
  runGoal: "consistency",
  locationCountryCode: defaultLocationSelection.countryCode,
  locationPlaceValue:
    getDefaultPlaceForCountry(defaultLocationSelection.countryCode)?.value ??
    defaultLocationSelection.placeValue,
}

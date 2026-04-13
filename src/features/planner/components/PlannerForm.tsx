"use client"

import * as React from "react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  getDefaultPlaceForCountry,
  getPlacesByCountry,
  isSupportedPlaceForCountry,
  supportedCountries,
} from "@/lib/weather/locations"
import type {
  PlannerSchemaInput,
  PlannerSchemaOutput,
} from "@/features/planner/schemas/plannerSchema"

type PlannerFormProps = {
  form: UseFormReturn<PlannerSchemaInput, unknown, PlannerSchemaOutput>
  isSubmitting: boolean
  isInitializing: boolean
  onSubmit: (values: PlannerSchemaOutput) => void
  onReset: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function PlannerForm({ form, isSubmitting, isInitializing, onSubmit, onReset }: PlannerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const selectedCountryCode = watch("locationCountryCode")
  const selectedPlaceValue = watch("locationPlaceValue")

  const countryRegister = register("locationCountryCode")
  const placeRegister = register("locationPlaceValue")

  const availablePlaces = React.useMemo(
    () => getPlacesByCountry(selectedCountryCode),
    [selectedCountryCode],
  )

  React.useEffect(() => {
    if (!isSupportedPlaceForCountry(selectedCountryCode, selectedPlaceValue)) {
      const fallbackPlace = getDefaultPlaceForCountry(selectedCountryCode)?.value
      if (fallbackPlace) {
        setValue("locationPlaceValue", fallbackPlace, { shouldValidate: true })
      }
    }
  }, [selectedCountryCode, selectedPlaceValue, setValue])

  return (
    <Card className="rounded-[24px] border-border/80 bg-card/95">
      <CardHeader>
        <CardTitle className="text-xl">Plan Your Run</CardTitle>
        <CardDescription>
          Set your constraints and get a practical recommendation for today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="targetDistanceKm">Target Distance (km)</Label>
            <Input
              id="targetDistanceKm"
              type="number"
              min={1}
              max={30}
              step={0.5}
              inputMode="decimal"
              {...register("targetDistanceKm")}
            />
            <FieldError message={errors.targetDistanceKm?.message} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="availableTimeMin">Available Time (min)</Label>
            <Input
              id="availableTimeMin"
              type="number"
              min={15}
              max={180}
              step={5}
              inputMode="numeric"
              {...register("availableTimeMin")}
            />
            <FieldError message={errors.availableTimeMin?.message} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="preferredIntensity">Preferred Intensity</Label>
            <Select id="preferredIntensity" {...register("preferredIntensity")}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </Select>
            <FieldError message={errors.preferredIntensity?.message} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="runGoal">Run Goal</Label>
            <Select id="runGoal" {...register("runGoal")}>
              <option value="consistency">Consistency</option>
              <option value="endurance">Endurance</option>
              <option value="speed">Speed</option>
              <option value="recovery">Recovery</option>
              <option value="stress_relief">Stress Relief</option>
            </Select>
            <FieldError message={errors.runGoal?.message} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="locationCountryCode">Country</Label>
            <Select
              id="locationCountryCode"
              {...countryRegister}
              onChange={(event) => {
                countryRegister.onChange(event)
                const nextCountry = event.target.value
                const nextPlace = getDefaultPlaceForCountry(nextCountry)?.value
                if (nextPlace) {
                  setValue("locationPlaceValue", nextPlace, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              }}
            >
              {supportedCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </Select>
            <FieldError message={errors.locationCountryCode?.message} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="locationPlaceValue">Location</Label>
            <Select id="locationPlaceValue" {...placeRegister}>
              {availablePlaces.map((place) => (
                <option key={place.value} value={place.value}>
                  {place.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">
              Weather is based on your selected country and location.
            </p>
            <FieldError message={errors.locationPlaceValue?.message} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl px-5"
              disabled={isSubmitting || isInitializing}
            >
              {isSubmitting ? "Generating..." : isInitializing ? "Initializing..." : "Get Recommendation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 rounded-xl px-5"
              onClick={onReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

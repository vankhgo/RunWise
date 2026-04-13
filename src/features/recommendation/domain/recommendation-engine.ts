import {
  type Intensity,
  type PlannerInput,
  type RecommendationOutput,
  type RecommendationType,
  type WeatherSnapshot,
} from "@/types/domain"

const paceByIntensity: Record<Intensity, number> = {
  easy: 7.2,
  moderate: 6.1,
  hard: 5.1,
}

const intensityOrder: Intensity[] = ["easy", "moderate", "hard"]

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10
}

function downgradeIntensity(intensity: Intensity): Intensity {
  const index = intensityOrder.indexOf(intensity)
  return intensityOrder[Math.max(0, index - 1)]
}

function isStormLikeCondition(condition?: string) {
  return condition === "storm"
}

function buildWeatherNote(weather: WeatherSnapshot, type: RecommendationType) {
  if (weather.status !== "ok") {
    return "Weather data unavailable. Recommendation is based on your inputs only."
  }

  const temp = weather.tempC
  const precip = weather.precipMm
  const wind = weather.windKph

  if (type === "heat_adjusted_short_run") {
    return `Warm conditions (${temp ?? "--"}\u00b0C) detected. Keep this run shorter and controlled, and hydrate early.`
  }

  if (type === "weather_adjusted_easy_run") {
    if ((precip ?? 0) >= 2) {
      return `Rain is active (${precip?.toFixed(1) ?? "--"} mm). Keep effort lighter and focus on steady footing.`
    }
    if ((wind ?? 0) >= 25) {
      return `Wind is elevated (${wind?.toFixed(0) ?? "--"} kph). Hold a controlled pace instead of pushing hard.`
    }
  }

  return `Current weather looks manageable (${temp ?? "--"}\u00b0C, ${(precip ?? 0).toFixed(1)} mm, ${(wind ?? 0).toFixed(0)} kph).`
}

function pickType(params: {
  goal: PlannerInput["runGoal"]
  weather: WeatherSnapshot
  adjustedByWeather: boolean
  severeWeather: boolean
  intensity: Intensity
}): RecommendationType {
  const { goal, adjustedByWeather, severeWeather, intensity } = params

  if (severeWeather) return "heat_adjusted_short_run"
  if (adjustedByWeather) return "weather_adjusted_easy_run"
  if (goal === "speed" && intensity !== "easy") return "tempo_lite_session"
  if (goal === "recovery") return "recovery_jog"
  if (goal === "endurance") return "steady_endurance_run"
  return "easy_flow_run"
}

function formatTitle(type: RecommendationType, distance: number, duration: number) {
  const roundedDistance = roundToSingleDecimal(distance)

  switch (type) {
    case "tempo_lite_session":
      return `${duration}-Minute Tempo-lite Session`
    case "recovery_jog":
      return `Recovery Jog (${roundedDistance}K)`
    case "steady_endurance_run":
      return `Moderate Steady Endurance Run`
    case "heat_adjusted_short_run":
      return "Heat-Aware Short Run"
    case "weather_adjusted_easy_run":
      return "Weather-Adjusted Easy Run"
    case "easy_flow_run":
    default:
      return `Easy ${roundedDistance}K Flow Run`
  }
}

function formatLabel(type: RecommendationType) {
  switch (type) {
    case "tempo_lite_session":
      return "Tempo-lite"
    case "recovery_jog":
      return "Recovery"
    case "steady_endurance_run":
      return "Steady"
    case "heat_adjusted_short_run":
      return "Heat-aware"
    case "weather_adjusted_easy_run":
      return "Weather-adjusted"
    case "easy_flow_run":
    default:
      return "Easy flow"
  }
}

function buildExplanation(params: {
  input: PlannerInput
  recommendedIntensity: Intensity
  suggestedDistanceKm: number
  weather: WeatherSnapshot
}) {
  const { input, recommendedIntensity, suggestedDistanceKm, weather } = params

  const lineOne = `Built around your ${input.availableTimeMin}-minute window and ${input.runGoal.replace("_", " ")} goal, this plan targets ${roundToSingleDecimal(suggestedDistanceKm)} km at ${recommendedIntensity} effort.`

  const neededMin = input.targetDistanceKm * paceByIntensity[input.preferredIntensity]
  const adjustedForTime = neededMin > input.availableTimeMin * 1.1

  const lineTwo = adjustedForTime
    ? `The distance was adjusted to stay realistic for today's available time while keeping the session productive.`
    : `The distance stays close to your target so you can execute without overextending.`

  const lineThree =
    weather.status === "ok"
      ? `Weather context is included in the final recommendation note to keep the effort practical today.`
      : `Weather data was unavailable, so this recommendation is based on your planning inputs only.`

  return `${lineOne} ${lineTwo} ${lineThree}`
}

export function generateRecommendation(input: PlannerInput, weather: WeatherSnapshot): RecommendationOutput {
  let recommendedIntensity: Intensity = input.preferredIntensity

  if (input.runGoal === "recovery" || input.runGoal === "stress_relief") {
    recommendedIntensity = "easy"
  }

  let suggestedDistanceKm = input.targetDistanceKm

  if (input.runGoal === "speed") suggestedDistanceKm *= 0.85
  if (input.runGoal === "recovery") suggestedDistanceKm *= 0.75
  if (input.runGoal === "stress_relief") suggestedDistanceKm *= 0.8
  if (input.runGoal === "endurance") suggestedDistanceKm *= 1.05

  let estimatedMin = suggestedDistanceKm * paceByIntensity[recommendedIntensity]

  if (estimatedMin > input.availableTimeMin * 1.1) {
    suggestedDistanceKm = Math.max(1.5, input.availableTimeMin / paceByIntensity[recommendedIntensity])
    estimatedMin = suggestedDistanceKm * paceByIntensity[recommendedIntensity]
  }

  let adjustedByWeather = false
  let severeWeather = false

  if (weather.status === "ok") {
    const temp = weather.tempC ?? 0
    const precip = weather.precipMm ?? 0
    const wind = weather.windKph ?? 0

    if (temp >= 35 || isStormLikeCondition(weather.condition)) {
      severeWeather = true
      adjustedByWeather = true
      recommendedIntensity = "easy"
      suggestedDistanceKm = Math.max(1.5, Math.min(suggestedDistanceKm * 0.6, input.targetDistanceKm * 0.7))
    } else {
      if (temp >= 30) {
        adjustedByWeather = true
        suggestedDistanceKm *= 0.8
        if (recommendedIntensity === "hard") {
          recommendedIntensity = "moderate"
        }
      }

      if (precip >= 2 || weather.condition === "rain") {
        adjustedByWeather = true
        recommendedIntensity = downgradeIntensity(recommendedIntensity)
      }

      if (wind >= 25 && recommendedIntensity === "hard") {
        adjustedByWeather = true
        recommendedIntensity = "moderate"
      }
    }
  }

  suggestedDistanceKm = clamp(roundToSingleDecimal(suggestedDistanceKm), 1.5, 30)

  const suggestedDurationMin = clamp(
    Math.round(suggestedDistanceKm * paceByIntensity[recommendedIntensity]),
    10,
    180,
  )

  const type = pickType({
    goal: input.runGoal,
    weather,
    adjustedByWeather,
    severeWeather,
    intensity: recommendedIntensity,
  })

  return {
    type,
    title: formatTitle(type, suggestedDistanceKm, suggestedDurationMin),
    label: formatLabel(type),
    explanation: buildExplanation({
      input,
      recommendedIntensity,
      suggestedDistanceKm,
      weather,
    }),
    weatherNote: buildWeatherNote(weather, type),
    suggestedDistanceKm,
    suggestedDurationMin,
    recommendedIntensity,
  }
}

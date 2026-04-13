import { getPlaceBySelection, normalizeLocationSelection } from "@/lib/weather/locations"
import { type PlannerInput, type WeatherCondition, type WeatherSnapshot } from "@/types/domain"

type CacheEntry = {
  expiresAt: number
  data: WeatherSnapshot
}

const weatherCache = new Map<string, CacheEntry>()

function getCacheTtlMs() {
  const ttlMin = Number(process.env.WEATHER_CACHE_TTL_MIN ?? "15")
  return Math.max(1, ttlMin) * 60 * 1000
}

async function fetchWithTimeout(url: string, timeoutMs = 1200) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    })

    return response
  } finally {
    clearTimeout(timeout)
  }
}

function normalizeWeatherCondition(code: number | undefined): WeatherCondition {
  if (typeof code !== "number") return "unknown"
  if (code === 0 || code === 1) return "clear"
  if (code === 2 || code === 3 || code === 45 || code === 48) return "cloudy"
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain"
  if ([95, 96, 99].includes(code)) return "storm"
  return "unknown"
}

async function fetchCurrentWeather(params: {
  latitude: number
  longitude: number
  locationLabel: string
}): Promise<WeatherSnapshot> {
  const cacheKey = `${params.latitude.toFixed(3)},${params.longitude.toFixed(3)}`
  const cached = weatherCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", params.latitude.toString())
  url.searchParams.set("longitude", params.longitude.toString())
  url.searchParams.set("current", "temperature_2m,precipitation,wind_speed_10m,weather_code")

  const response = await fetchWithTimeout(url.toString(), 1200)
  if (!response.ok) {
    return {
      status: "unavailable",
      source: "open-meteo",
      locationLabel: params.locationLabel,
    }
  }

  const data = await response.json()
  const current = data?.current

  if (!current) {
    return {
      status: "unavailable",
      source: "open-meteo",
      locationLabel: params.locationLabel,
    }
  }

  const snapshot: WeatherSnapshot = {
    status: "ok",
    tempC: Number(current.temperature_2m),
    precipMm: Number(current.precipitation),
    windKph: Number(current.wind_speed_10m),
    condition: normalizeWeatherCondition(current.weather_code),
    source: "open-meteo",
    observedAt: new Date().toISOString(),
    locationLabel: params.locationLabel,
  }

  weatherCache.set(cacheKey, {
    expiresAt: Date.now() + getCacheTtlMs(),
    data: snapshot,
  })

  return snapshot
}

export async function getWeatherSnapshot(selection: Pick<PlannerInput, "locationCountryCode" | "locationPlaceValue">): Promise<WeatherSnapshot> {
  try {
    const normalized = normalizeLocationSelection(
      selection.locationCountryCode,
      selection.locationPlaceValue,
    )

    const { country, place } = getPlaceBySelection(normalized.countryCode, normalized.placeValue)

    return await fetchCurrentWeather({
      latitude: place.latitude,
      longitude: place.longitude,
      locationLabel: `${place.label}, ${country.label}`,
    })
  } catch {
    return {
      status: "unavailable",
      source: "open-meteo",
    }
  }
}

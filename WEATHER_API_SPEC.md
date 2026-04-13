# Runwise Weather API Specification (MVP)

## Why Weather Matters for Runwise

Runwise exists to make today’s run decision easier. Weather is one of the most immediate factors affecting feasibility, comfort, and safety. Incorporating weather keeps recommendations believable and increases user trust.

## MVP Weather Provider

Default provider: **Open-Meteo**

- No API key required for MVP.
- Supports geocoding + current weather.
- Sufficient for lightweight recommendation adjustments.

Provider must be wrapped by an internal adapter so it can be swapped later.

## Required Weather Data (Current)

- Temperature (`temp_c`)
- Precipitation (`precip_mm`)
- Wind speed (`wind_kph`)
- Condition category (`condition`), normalized from provider code
- Observation timestamp (`observed_at`)

## Optional Future Data

- Humidity
- Feels-like temperature
- Air quality
- Hourly forecast window around planned run time

## Location Handling

Planner provides structured location selection:

1. `location_country_code`
2. `location_place_value` (validated against selected country)

If an invalid pair reaches backend, normalize to app default supported location and continue with `status: unavailable` fallback only if weather fetch itself fails.

## API Integration Expectations

### Location Resolution Step

- Input: country code + place value
- Output: latitude, longitude, resolved place label from supported location catalog

### Current Weather Step

- Input: latitude/longitude
- Output: normalized weather snapshot

### Normalization Contract

Backend must output:

```ts
{
  status: "ok" | "unavailable";
  tempC?: number;
  precipMm?: number;
  windKph?: number;
  condition?: "clear" | "cloudy" | "rain" | "storm" | "unknown";
  observedAt?: string;
  source: "open-meteo";
}
```

## How Weather Affects Recommendation Logic

- `temp_c >= 30`: reduce suggested distance and cap intensity to moderate.
- `precip_mm >= 2` or rain condition: reduce intensity one level.
- `wind_kph >= 25`: avoid high-intensity recommendation types.
- severe condition (`storm` or very high heat): recommend shortened easy session or indoor alternative.

Weather modifies recommendation parameters and adds a user-facing weather note. It does not replace core logic based on planner inputs.

## Failure and Fallback Behavior

Weather failures must never block recommendation generation.

Failure scenarios:

- location resolution failure
- weather endpoint timeout
- provider response parse error

Fallback behavior:

- Set weather status to `unavailable`.
- Generate recommendation from planner inputs only.
- Render explicit fallback note: `Weather data unavailable. Recommendation is based on your inputs only.`

## Caching Expectations

- Cache normalized weather snapshot by `(lat, lon)` key.
- Cache TTL: `15 minutes` (default).
- Allow stale-if-error behavior up to `60 minutes` for resilience.

## Operational Requirements

- Weather adapter logs provider latency and error type.
- Timeout budget: 1200ms recommended.
- Retry at most once for transient 5xx failures.

## Environment Variables

- `WEATHER_PROVIDER=open-meteo`
- `WEATHER_CACHE_TTL_MIN=15`
- `DEFAULT_LOCATION_LAT`
- `DEFAULT_LOCATION_LON`
- `WEATHER_API_KEY` (optional, future providers)

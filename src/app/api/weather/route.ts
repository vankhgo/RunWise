import { NextResponse } from "next/server"

import { defaultLocationSelection, normalizeLocationSelection } from "@/lib/weather/locations"
import { getWeatherSnapshot } from "@/lib/weather/openMeteo"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get("country") ?? defaultLocationSelection.countryCode
  const place = searchParams.get("place") ?? defaultLocationSelection.placeValue

  const normalized = normalizeLocationSelection(country, place)

  const weather = await getWeatherSnapshot({
    locationCountryCode: normalized.countryCode,
    locationPlaceValue: normalized.placeValue,
  })

  return NextResponse.json(weather)
}

import { NextResponse } from "next/server"

import { plannerSchema } from "@/features/planner/schemas/plannerSchema"
import { generateRecommendation } from "@/features/recommendation/domain/recommendation-engine"
import { getWeatherSnapshot } from "@/lib/weather/openMeteo"
import { type GenerateRecommendationResponse } from "@/types/domain"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = plannerSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid planner input",
          issues: parsed.error.issues,
        },
        { status: 400 },
      )
    }

    const input = parsed.data
    const weather = await getWeatherSnapshot({
      locationCountryCode: input.locationCountryCode,
      locationPlaceValue: input.locationPlaceValue,
    })
    const recommendation = generateRecommendation(input, weather)

    const response: GenerateRecommendationResponse = {
      recommendation,
      weather,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json(
      {
        message: "Unable to generate recommendation",
      },
      { status: 500 },
    )
  }
}

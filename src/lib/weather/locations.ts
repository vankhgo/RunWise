export const countryCodes = ["MY", "SG", "ID", "TH", "AU", "NZ"] as const

export type CountryCode = (typeof countryCodes)[number]

export type SupportedPlace = {
  label: string
  value: string
  latitude: number
  longitude: number
}

export type SupportedCountry = {
  code: CountryCode
  label: string
  places: SupportedPlace[]
}

export const supportedCountries: SupportedCountry[] = [
  {
    code: "MY",
    label: "Malaysia",
    places: [
      { label: "Kuching", value: "kuching", latitude: 1.5533, longitude: 110.3592 },
      { label: "Kuala Lumpur", value: "kuala_lumpur", latitude: 3.139, longitude: 101.6869 },
      { label: "Johor Bahru", value: "johor_bahru", latitude: 1.4927, longitude: 103.7414 },
      { label: "Penang", value: "penang", latitude: 5.4141, longitude: 100.3288 },
      { label: "Kota Kinabalu", value: "kota_kinabalu", latitude: 5.9804, longitude: 116.0735 },
    ],
  },
  {
    code: "SG",
    label: "Singapore",
    places: [{ label: "Singapore", value: "singapore", latitude: 1.3521, longitude: 103.8198 }],
  },
  {
    code: "ID",
    label: "Indonesia",
    places: [
      { label: "Jakarta", value: "jakarta", latitude: -6.2088, longitude: 106.8456 },
      { label: "Bandung", value: "bandung", latitude: -6.9175, longitude: 107.6191 },
      { label: "Surabaya", value: "surabaya", latitude: -7.2575, longitude: 112.7521 },
      { label: "Bali", value: "bali", latitude: -8.4095, longitude: 115.1889 },
    ],
  },
  {
    code: "TH",
    label: "Thailand",
    places: [
      { label: "Bangkok", value: "bangkok", latitude: 13.7563, longitude: 100.5018 },
      { label: "Chiang Mai", value: "chiang_mai", latitude: 18.7883, longitude: 98.9853 },
      { label: "Phuket", value: "phuket", latitude: 7.8804, longitude: 98.3923 },
    ],
  },
  {
    code: "AU",
    label: "Australia",
    places: [
      { label: "Sydney", value: "sydney", latitude: -33.8688, longitude: 151.2093 },
      { label: "Melbourne", value: "melbourne", latitude: -37.8136, longitude: 144.9631 },
      { label: "Brisbane", value: "brisbane", latitude: -27.4698, longitude: 153.0251 },
      { label: "Perth", value: "perth", latitude: -31.9523, longitude: 115.8613 },
      { label: "Adelaide", value: "adelaide", latitude: -34.9285, longitude: 138.6007 },
      { label: "Gold Coast", value: "gold_coast", latitude: -28.0167, longitude: 153.4 },
    ],
  },
  {
    code: "NZ",
    label: "New Zealand",
    places: [
      { label: "Auckland", value: "auckland", latitude: -36.8509, longitude: 174.7645 },
      { label: "Wellington", value: "wellington", latitude: -41.2866, longitude: 174.7756 },
      { label: "Christchurch", value: "christchurch", latitude: -43.532, longitude: 172.6362 },
      { label: "Queenstown", value: "queenstown", latitude: -45.0312, longitude: 168.6626 },
      { label: "Dunedin", value: "dunedin", latitude: -45.8788, longitude: 170.5028 },
    ],
  },
]

export const defaultLocationSelection = {
  countryCode: "MY" as CountryCode,
  placeValue: "kuching",
}

export function getCountryByCode(code: CountryCode | string) {
  return supportedCountries.find((country) => country.code === code)
}

export function getPlacesByCountry(code: CountryCode | string) {
  return getCountryByCode(code)?.places ?? []
}

export function isSupportedCountry(code: string): code is CountryCode {
  return countryCodes.includes(code as CountryCode)
}

export function isSupportedPlaceForCountry(countryCode: CountryCode | string, placeValue: string) {
  return getPlacesByCountry(countryCode).some((place) => place.value === placeValue)
}

export function getDefaultPlaceForCountry(countryCode: CountryCode | string) {
  const places = getPlacesByCountry(countryCode)
  return places[0]
}

export function normalizeLocationSelection(
  countryCode?: string,
  placeValue?: string,
): { countryCode: CountryCode; placeValue: string } {
  const safeCountry: CountryCode = isSupportedCountry(countryCode ?? "")
    ? (countryCode as CountryCode)
    : defaultLocationSelection.countryCode

  const safePlace = isSupportedPlaceForCountry(safeCountry, placeValue ?? "")
    ? (placeValue as string)
    : (getDefaultPlaceForCountry(safeCountry)?.value ?? defaultLocationSelection.placeValue)

  return {
    countryCode: safeCountry,
    placeValue: safePlace,
  }
}

export function getPlaceBySelection(countryCode?: string, placeValue?: string) {
  const normalized = normalizeLocationSelection(countryCode, placeValue)
  const country = getCountryByCode(normalized.countryCode)
  const place = country?.places.find((item) => item.value === normalized.placeValue)

  if (!country || !place) {
    const fallbackCountry = getCountryByCode(defaultLocationSelection.countryCode)
    const fallbackPlace = fallbackCountry?.places.find(
      (item) => item.value === defaultLocationSelection.placeValue,
    )

    return {
      country: fallbackCountry!,
      place: fallbackPlace!,
    }
  }

  return {
    country,
    place,
  }
}

export function getLocationDisplayLabel(countryCode?: string, placeValue?: string) {
  const { country, place } = getPlaceBySelection(countryCode, placeValue)
  return `${place.label}, ${country.label}`
}

import type { EventInput } from '@fullcalendar/core'

export interface HolidayCountry {
  code: string
  name: string
  color: string
}

interface PublicHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  types: string[]
}

export const holidayCountries: HolidayCountry[] = [
  { code: 'US', name: 'United States', color: '#5877d8' },
  { code: 'GB', name: 'United Kingdom', color: '#a66acb' },
  { code: 'SG', name: 'Singapore', color: '#e18a4d' },
  { code: 'HK', name: 'Hong Kong', color: '#d65c7e' },
  { code: 'JP', name: 'Japan', color: '#39a18a' },
]

const additionalCountryColors = [
  '#5877d8',
  '#a66acb',
  '#e18a4d',
  '#d65c7e',
  '#39a18a',
  '#4f9b9b',
  '#c48b37',
  '#6c83a5',
]
const holidayCache = new Map<string, Promise<PublicHoliday[]>>()
const countryByCode = new Map(holidayCountries.map((country) => [country.code, country]))
let availableCountriesRequest: Promise<HolidayCountry[]> | undefined

function isAvailableCountry(value: unknown): value is { countryCode: string; name: string } {
  if (typeof value !== 'object' || value === null) return false
  const country = value as Record<string, unknown>

  return (
    typeof country.countryCode === 'string' &&
    /^[A-Z]{2}$/.test(country.countryCode) &&
    typeof country.name === 'string' &&
    country.name.trim().length > 0
  )
}

function colorForCountry(code: string) {
  let hash = 0
  for (const character of code) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }
  return additionalCountryColors[hash % additionalCountryColors.length]!
}

export function fetchAvailableCountries(): Promise<HolidayCountry[]> {
  if (availableCountriesRequest) return availableCountriesRequest

  const request = fetch('https://date.nager.at/api/v3/AvailableCountries')
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`The country service returned ${response.status}.`)
      }

      const data: unknown = await response.json()
      if (!Array.isArray(data) || !data.every(isAvailableCountry)) {
        throw new Error('The country service returned invalid data.')
      }

      const countries = new Map(
        data.map(({ countryCode, name }) => [
          countryCode,
          {
            code: countryCode,
            name,
            color: colorForCountry(countryCode),
          },
        ]),
      )
      for (const country of holidayCountries) {
        countries.set(country.code, country)
      }

      const availableCountries = [...countries.values()].sort((first, second) =>
        first.name.localeCompare(second.name),
      )
      countryByCode.clear()
      for (const country of availableCountries) {
        countryByCode.set(country.code, country)
      }

      return availableCountries
    })
    .catch((error: unknown) => {
      availableCountriesRequest = undefined
      throw error
    })

  availableCountriesRequest = request
  return request
}

function isPublicHoliday(value: unknown): value is PublicHoliday {
  if (typeof value !== 'object' || value === null) return false
  const holiday = value as Record<string, unknown>

  return (
    typeof holiday.date === 'string' &&
    typeof holiday.localName === 'string' &&
    typeof holiday.name === 'string' &&
    typeof holiday.countryCode === 'string' &&
    Array.isArray(holiday.types) &&
    holiday.types.every((type) => typeof type === 'string')
  )
}

function fetchCountryHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
  const cacheKey = `${year}-${countryCode}`
  const cached = holidayCache.get(cacheKey)
  if (cached) return cached

  const request = fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`The holiday service returned ${response.status} for ${countryCode}.`)
      }

      const data: unknown = await response.json()
      if (!Array.isArray(data) || !data.every(isPublicHoliday)) {
        throw new Error(`The holiday service returned invalid data for ${countryCode}.`)
      }

      return data.filter(isPublicHoliday)
    })
    .then(
      (holidays) => holidays,
      (error: unknown) => {
        holidayCache.delete(cacheKey)
        throw error
      },
    )

  holidayCache.set(cacheKey, request)
  return request
}

export async function fetchHolidayEvents(
  rangeStart: string,
  rangeEnd: string,
  countryCodes: string[],
): Promise<EventInput[]> {
  const startYear = Number(rangeStart.slice(0, 4))
  const endYear = Number(rangeEnd.slice(0, 4))

  if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) {
    throw new Error('The calendar requested an invalid date range.')
  }

  const requestedCountries = [...new Set(countryCodes)].filter((code) => countryByCode.has(code))
  const requests: Promise<PublicHoliday[]>[] = []

  for (let year = startYear; year <= endYear; year += 1) {
    for (const countryCode of requestedCountries) {
      requests.push(fetchCountryHolidays(year, countryCode))
    }
  }

  const holidayGroups = await Promise.all(requests)

  return holidayGroups.flatMap((holidays) =>
    holidays.map((holiday) => {
      const country = countryByCode.get(holiday.countryCode)
      if (!country) {
        throw new Error(`The holiday service returned an unsupported country: ${holiday.countryCode}.`)
      }

      return {
        id: `${holiday.countryCode}-${holiday.date}-${holiday.name}`,
        title: holiday.localName || holiday.name,
        start: holiday.date,
        allDay: true,
        backgroundColor: country.color,
        borderColor: country.color,
        extendedProps: {
          countryCode: country.code,
          countryName: country.name,
          holidayName: holiday.name,
          types: holiday.types,
        },
      }
    }),
  )
}

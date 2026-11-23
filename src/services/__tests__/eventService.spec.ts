import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAvailableCountries, fetchHolidayEvents, holidayCountries } from '../eventService'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchHolidayEvents', () => {
  it('loads the supported country catalog while preserving the original countries', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).endsWith('/AvailableCountries')) {
        return new Response(
          JSON.stringify([{ countryCode: 'CA', countryName: 'Canada' }]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify([
          {
            date: '2099-07-01',
            localName: 'Canada Day',
            name: 'Canada Day',
            countryCode: 'CA',
            types: ['Public'],
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const countries = await fetchAvailableCountries()
    const events = await fetchHolidayEvents('2099-01-01', '2099-02-01', ['CA'])

    expect(countries.map(({ code }) => code)).toContain('CA')
    expect(countries.map(({ code }) => code)).toEqual(
      expect.arrayContaining(holidayCountries.map(({ code }) => code)),
    )
    expect(events[0]?.extendedProps?.countryCode).toBe('CA')
    expect(events[0]?.backgroundColor).toBeTruthy()
  })

  it('loads holiday events from every selected country', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const parts = String(input).split('/')
      const countryCode = parts[parts.length - 1] ?? ''
      return new Response(
        JSON.stringify([
          {
            date: '2099-01-01',
            localName: `${countryCode} New Year`,
            name: 'New Year',
            countryCode,
            types: ['Public'],
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const events = await fetchHolidayEvents(
      '2099-01-01',
      '2099-02-01',
      holidayCountries.map(({ code }) => code),
    )

    expect(fetchMock).toHaveBeenCalledTimes(holidayCountries.length)
    expect(events).toHaveLength(holidayCountries.length)
    expect(events.map((event) => event.extendedProps?.countryCode)).toEqual(
      holidayCountries.map(({ code }) => code),
    )
    expect(events.every((event) => event.allDay)).toBe(true)
  })

  it('loads each year when the visible range crosses a year boundary', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      const parts = url.split('/')
      const year = parts[parts.length - 2] ?? ''
      return new Response(
        JSON.stringify([
          {
            date: `${year}-01-01`,
            localName: 'New Year',
            name: 'New Year',
            countryCode: 'SG',
            types: ['Public'],
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const events = await fetchHolidayEvents('2097-12-01', '2098-02-01', ['SG'])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(events).toHaveLength(2)
    expect(events.map((event) => event.start)).toEqual(['2097-01-01', '2098-01-01'])
  })

  it('reports an unavailable holiday service', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 503 })),
    )

    await expect(fetchHolidayEvents('2096-01-01', '2096-02-01', ['US'])).rejects.toThrow(
      'The holiday service returned 503 for US.',
    )
  })
})

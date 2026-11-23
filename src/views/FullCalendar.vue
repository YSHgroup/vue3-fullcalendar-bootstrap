<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import type {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventSourceFuncArg,
  EventInput,
} from '@fullcalendar/core'
import {
  fetchAvailableCountries,
  fetchHolidayEvents,
  holidayCountries,
} from '@/services/eventService'

interface PersonalEvent extends EventInput {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  extendedProps: {
    isPersonal: true
    notes: string
  }
}

interface MiniCalendarDay {
  date: Date
  inCurrentMonth: boolean
}

const storageKey = 'world-calendar-personal-events'
const selectedCountries = ref(holidayCountries.map(({ code }) => code))
const availableCountries = ref([...holidayCountries])
const countrySearch = ref('')
const countryLoadError = ref('')
const calendarRef = ref<{ getApi: () => CalendarApi } | null>(null)
const calendarTitle = ref('')
const currentView = ref('dayGridMonth')
const miniMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const calendarEvents = ref<EventApi[]>([])
const pendingRequests = ref(0)
const holidayError = ref('')
const eventNotice = ref('')
const isEventModalOpen = ref(false)
const eventTitle = ref('')
const eventStart = ref('')
const eventEnd = ref('')
const eventNotes = ref('')
const formError = ref('')

function isPersonalEvent(value: unknown): value is PersonalEvent {
  if (typeof value !== 'object' || value === null) return false
  const event = value as Record<string, unknown>
  const extendedProps = event.extendedProps

  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.start === 'string' &&
    typeof event.end === 'string' &&
    typeof event.backgroundColor === 'string' &&
    typeof event.borderColor === 'string' &&
    typeof extendedProps === 'object' &&
    extendedProps !== null &&
    (extendedProps as Record<string, unknown>).isPersonal === true &&
    typeof (extendedProps as Record<string, unknown>).notes === 'string'
  )
}

function readPersonalEvents(): PersonalEvent[] {
  try {
    const savedEvents = window.localStorage.getItem(storageKey)
    if (!savedEvents) return []

    const parsed: unknown = JSON.parse(savedEvents)
    if (!Array.isArray(parsed) || !parsed.every(isPersonalEvent)) {
      throw new Error('Saved events have an unexpected format.')
    }

    return parsed
  } catch (error) {
    eventNotice.value =
      error instanceof Error
        ? `Saved events could not be loaded: ${error.message}`
        : 'Saved events could not be loaded from this browser.'
    return []
  }
}

const personalEvents = ref<PersonalEvent[]>(readPersonalEvents())
const isLoading = computed(() => pendingRequests.value > 0)
const filteredCountries = computed(() => {
  const search = countrySearch.value.trim().toLocaleLowerCase()
  if (!search) return availableCountries.value

  return availableCountries.value.filter(
    ({ code, name }) =>
      name.toLocaleLowerCase().includes(search) || code.toLocaleLowerCase().includes(search),
  )
})
const miniMonthLabel = computed(() =>
  new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(miniMonth.value),
)

const miniCalendarDays = computed<MiniCalendarDay[]>(() => {
  const year = miniMonth.value.getFullYear()
  const month = miniMonth.value.getMonth()
  const offset = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, month, index - offset + 1)
    return { date, inCurrentMonth: date.getMonth() === month }
  })
})

const upcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return calendarEvents.value
    .filter((event) => event.start && event.start >= today)
    .sort((first, second) => first.start!.getTime() - second.start!.getTime())
    .slice(0, 5)
})

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function changeMiniMonth(offset: number) {
  miniMonth.value = new Date(
    miniMonth.value.getFullYear(),
    miniMonth.value.getMonth() + offset,
    1,
  )
}

function goToDate(date: Date) {
  calendarRef.value?.getApi().gotoDate(date)
}

function selectMiniDay(date: Date) {
  goToDate(date)
}

function toggleCountry(code: string) {
  selectedCountries.value = selectedCountries.value.includes(code)
    ? selectedCountries.value.filter((selectedCode) => selectedCode !== code)
    : [...selectedCountries.value, code]

  calendarRef.value?.getApi().refetchEvents()
}

async function loadAvailableCountries() {
  countryLoadError.value = ''
  try {
    availableCountries.value = await fetchAvailableCountries()
    calendarRef.value?.getApi().refetchEvents()
  } catch (error) {
    countryLoadError.value =
      error instanceof Error
        ? `More countries could not be loaded: ${error.message}`
        : 'More countries could not be loaded. Check your connection and try again.'
  }
}

function changeView(view: string) {
  calendarRef.value?.getApi().changeView(view)
}

function moveCalendar(amount: number) {
  const api = calendarRef.value?.getApi()
  if (api) {
    if (amount < 0) {
      api.prev()
    } else {
      api.next()
    }
  }
}

function showToday() {
  const today = new Date()
  miniMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  goToDate(today)
}

function formatLocalDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function openEventModal(selection?: DateSelectArg) {
  const start = selection?.start ?? new Date()
  const end = selection?.end ?? new Date(start.getTime() + 60 * 60 * 1000)

  eventTitle.value = ''
  eventNotes.value = ''
  eventStart.value = formatLocalDateTime(start)
  eventEnd.value = formatLocalDateTime(end)
  formError.value = ''
  eventNotice.value = ''
  isEventModalOpen.value = true
}

function persistPersonalEvents() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(personalEvents.value))
    eventNotice.value = 'Your event is saved on this browser.'
  } catch (error) {
    eventNotice.value =
      error instanceof Error
        ? `The event was added for this session but could not be saved: ${error.message}`
        : 'The event was added for this session but could not be saved in this browser.'
  }
}

function saveEvent() {
  const start = new Date(eventStart.value)
  const end = new Date(eventEnd.value)

  if (!eventTitle.value.trim()) {
    formError.value = 'Add a title for your event.'
    return
  }
  if (!eventStart.value || !eventEnd.value || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    formError.value = 'Choose a valid start and end time.'
    return
  }
  if (end <= start) {
    formError.value = 'The end time must be after the start time.'
    return
  }

  personalEvents.value.push({
    id: crypto.randomUUID(),
    title: eventTitle.value.trim(),
    start: start.toISOString(),
    end: end.toISOString(),
    backgroundColor: '#4357d8',
    borderColor: '#4357d8',
    extendedProps: { isPersonal: true, notes: eventNotes.value.trim() },
  })
  persistPersonalEvents()
  calendarRef.value?.getApi().refetchEvents()
  isEventModalOpen.value = false
}

function deletePersonalEvent(id: string) {
  personalEvents.value = personalEvents.value.filter((event) => event.id !== id)
  persistPersonalEvents()
  calendarRef.value?.getApi().refetchEvents()
}

function eventDateLabel(event: EventApi) {
  if (!event.start) return ''
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(event.start)
}

onMounted(() => {
  void loadAvailableCountries()
})

const calendarOptions: CalendarOptions = {
  plugins: [bootstrap5Plugin, dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin],
  themeSystem: 'bootstrap5',
  initialView: 'dayGridMonth',
  headerToolbar: false,
  height: 'auto',
  firstDay: 0,
  fixedWeekCount: false,
  navLinks: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: 3,
  eventDisplay: 'block',
  nowIndicator: true,
  events: async (info: EventSourceFuncArg) => {
    pendingRequests.value += 1
    try {
      const holidays = await fetchHolidayEvents(
        info.startStr,
        info.endStr,
        selectedCountries.value,
      )
      return [...holidays, ...personalEvents.value]
    } finally {
      pendingRequests.value -= 1
    }
  },
  datesSet: ({ view }) => {
    calendarTitle.value = view.title
    currentView.value = view.type
    const currentDate = view.calendar.getDate()
    miniMonth.value = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  },
  eventsSet: (events) => {
    calendarEvents.value = events
  },
  eventSourceFailure: (error) => {
    holidayError.value =
      error instanceof Error
        ? `Holiday data could not be loaded: ${error.message}`
        : 'Holiday data could not be loaded. Check your connection and try again.'
  },
  eventSourceSuccess: () => {
    holidayError.value = ''
  },
  select: (selection) => {
    openEventModal(selection)
    calendarRef.value?.getApi().unselect()
  },
}
</script>

<template>
  <div class="calendar-app">
    <aside class="sidebar">
      <a
        class="brand"
        href="#"
        aria-label="Daymark home"
      >
        <span class="brand-mark"><i class="bi bi-calendar2-week-fill" /></span>
        <span>daymark<span class="brand-period">.</span></span>
      </a>

      <button
        class="create-event-button"
        type="button"
        @click="openEventModal()"
      >
        <i class="bi bi-plus-lg" />
        <span>New event</span>
      </button>

      <section
        class="mini-calendar"
        aria-label="Date navigator"
      >
        <div class="mini-calendar-heading">
          <h2>{{ miniMonthLabel }}</h2>
          <div class="mini-month-actions">
            <button
              type="button"
              aria-label="Previous month"
              @click="changeMiniMonth(-1)"
            >
              <i class="bi bi-chevron-left" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              @click="changeMiniMonth(1)"
            >
              <i class="bi bi-chevron-right" />
            </button>
          </div>
        </div>
        <div
          class="mini-calendar-grid mini-calendar-weekdays"
          aria-hidden="true"
        >
          <span
            v-for="(day, index) in weekDays"
            :key="`${day}-${index}`"
          >{{ day }}</span>
        </div>
        <div class="mini-calendar-grid">
          <button
            v-for="{ date, inCurrentMonth } in miniCalendarDays"
            :key="dateKey(date)"
            type="button"
            class="mini-day"
            :class="{
              'outside-month': !inCurrentMonth,
              'is-today': dateKey(date) === dateKey(new Date()),
            }"
            :aria-label="new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date)"
            @click="selectMiniDay(date)"
          >
            {{ date.getDate() }}
          </button>
        </div>
      </section>

      <section class="country-filters">
        <div class="section-heading">
          <h2>Holiday calendars</h2>
          <span>{{ selectedCountries.length }}/{{ availableCountries.length }}</span>
        </div>
        <input
          v-model="countrySearch"
          class="country-search"
          type="search"
          placeholder="Find a country"
          aria-label="Find a country"
        >
        <label
          v-for="country in filteredCountries"
          :key="country.code"
          class="country-filter"
        >
          <input
            type="checkbox"
            :checked="selectedCountries.includes(country.code)"
            @change="toggleCountry(country.code)"
          >
          <span
            class="country-color"
            :style="{ '--country-color': country.color }"
          />
          <span class="country-name">{{ country.name }}</span>
          <span class="country-code">{{ country.code }}</span>
        </label>
        <p
          v-if="countryLoadError"
          class="country-load-error"
          role="alert"
        >
          {{ countryLoadError }}
          <button
            type="button"
            @click="loadAvailableCountries"
          >
            Retry
          </button>
        </p>
      </section>

      <div class="sidebar-footer">
        <span class="privacy-indicator"><i class="bi bi-shield-check" /></span>
        <span><strong>Your calendar, your space</strong><small>Personal events stay on this device.</small></span>
      </div>
    </aside>

    <main class="main-content">
      <header class="page-header">
        <div>
          <p class="eyebrow">
            YOUR WORLD, IN SYNC
          </p>
          <h1>Make room for what matters.</h1>
          <p class="page-subtitle">
            A little more clarity for every day ahead.
          </p>
        </div>
        <div class="header-date">
          <span class="live-dot" />
          <span>{{ new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date()) }}</span>
        </div>
      </header>

      <div
        v-if="holidayError"
        class="alert alert-warning alert-dismissible holiday-alert"
        role="alert"
      >
        <i class="bi bi-exclamation-circle-fill me-2" />{{ holidayError }}
        <button
          type="button"
          class="btn-close"
          aria-label="Dismiss"
          @click="holidayError = ''"
        />
      </div>
      <div
        v-if="eventNotice"
        class="alert alert-info event-notice"
        role="status"
      >
        <i class="bi bi-info-circle me-2" />{{ eventNotice }}
        <button
          type="button"
          class="btn-close"
          aria-label="Dismiss"
          @click="eventNotice = ''"
        />
      </div>

      <section
        class="calendar-card"
        aria-label="Calendar"
      >
        <div class="calendar-toolbar">
          <div class="toolbar-date">
            <h2>{{ calendarTitle }}</h2>
            <span
              v-if="isLoading"
              class="loading-label"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
              />
              Updating holidays
            </span>
          </div>
          <div class="toolbar-actions">
            <div
              class="calendar-navigation"
              aria-label="Calendar navigation"
            >
              <button
                type="button"
                aria-label="Previous period"
                @click="moveCalendar(-1)"
              >
                <i class="bi bi-chevron-left" />
              </button>
              <button
                type="button"
                aria-label="Next period"
                @click="moveCalendar(1)"
              >
                <i class="bi bi-chevron-right" />
              </button>
            </div>
            <button
              type="button"
              class="today-button"
              @click="showToday"
            >
              Today
            </button>
            <div
              class="view-switcher"
              role="group"
              aria-label="Calendar view"
            >
              <button
                v-for="view in [
                  { id: 'dayGridMonth', label: 'Month' },
                  { id: 'timeGridWeek', label: 'Week' },
                  { id: 'timeGridDay', label: 'Day' },
                  { id: 'listMonth', label: 'Agenda' },
                ]"
                :key="view.id"
                type="button"
                :class="{ active: currentView === view.id }"
                @click="changeView(view.id)"
              >
                {{ view.label }}
              </button>
            </div>
          </div>
        </div>

        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
        />
      </section>

      <section class="upcoming-section">
        <div class="upcoming-heading">
          <div>
            <p class="eyebrow">
              JUST AROUND THE CORNER
            </p>
            <h2>Coming up</h2>
          </div>
          <span class="upcoming-count">{{ upcomingEvents.length }} events</span>
        </div>

        <div
          v-if="upcomingEvents.length"
          class="upcoming-list"
        >
          <article
            v-for="event in upcomingEvents"
            :key="event.id"
            class="upcoming-event"
          >
            <span
              class="upcoming-event-color"
              :style="{ '--event-color': event.backgroundColor || event.borderColor || '#73809a' }"
            />
            <div class="upcoming-event-info">
              <strong>{{ event.title }}</strong>
              <span>{{ eventDateLabel(event) }}<template v-if="event.extendedProps.isPersonal"> · Personal event</template></span>
              <small v-if="event.extendedProps.notes">{{ event.extendedProps.notes }}</small>
            </div>
            <button
              v-if="event.extendedProps.isPersonal"
              type="button"
              class="delete-event-button"
              :aria-label="`Delete ${event.title}`"
              @click="deletePersonalEvent(String(event.id))"
            >
              <i class="bi bi-trash3" />
            </button>
          </article>
        </div>
        <p
          v-else
          class="empty-upcoming"
        >
          No upcoming events in this view. Try another month or turn on more holiday calendars.
        </p>
      </section>

      <footer class="page-footer">
        <span>Thoughtfully keeping the world in view.</span>
        <span>Holidays by <a
          href="https://date.nager.at/"
          target="_blank"
          rel="noreferrer"
        >Nager.Date</a></span>
      </footer>
    </main>

    <Teleport to="body">
      <div
        v-if="isEventModalOpen"
        class="event-modal-backdrop"
        role="presentation"
        @click.self="isEventModalOpen = false"
        @keydown.esc="isEventModalOpen = false"
      >
        <section
          class="event-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div class="event-modal-header">
            <div>
              <p class="eyebrow">
                MAKE IT YOURS
              </p>
              <h2 id="event-modal-title">
                Add a personal event
              </h2>
            </div>
            <button
              type="button"
              class="modal-close-button"
              aria-label="Close dialog"
              @click="isEventModalOpen = false"
            >
              <i class="bi bi-x-lg" />
            </button>
          </div>
          <form @submit.prevent="saveEvent">
            <label
              class="form-label"
              for="event-title"
            >Event title</label>
            <input
              id="event-title"
              v-model="eventTitle"
              class="form-control"
              maxlength="100"
              placeholder="A moment worth making time for"
              required
              autofocus
            >
            <div class="event-time-fields">
              <div>
                <label
                  class="form-label"
                  for="event-start"
                >Starts</label>
                <input
                  id="event-start"
                  v-model="eventStart"
                  class="form-control"
                  type="datetime-local"
                  required
                >
              </div>
              <div>
                <label
                  class="form-label"
                  for="event-end"
                >Ends</label>
                <input
                  id="event-end"
                  v-model="eventEnd"
                  class="form-control"
                  type="datetime-local"
                  required
                >
              </div>
            </div>
            <label
              class="form-label"
              for="event-notes"
            >Notes <span class="optional-label">Optional</span></label>
            <textarea
              id="event-notes"
              v-model="eventNotes"
              class="form-control"
              rows="3"
              maxlength="500"
              placeholder="Add a little context"
            />
            <p
              v-if="formError"
              class="form-error"
              role="alert"
            >
              {{ formError }}
            </p>
            <div class="event-modal-actions">
              <button
                class="btn btn-light"
                type="button"
                @click="isEventModalOpen = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-primary"
                type="submit"
              >
                <i class="bi bi-plus-lg me-1" /> Add event
              </button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-app {
  --ink: #1d2942;
  --muted: #7d8799;
  --line: #e8ebf1;
  --accent: #4357d8;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  color: var(--ink);
  background: #f7f8fb;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 32px 22px 24px;
  background: #fff;
  border-right: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  color: var(--ink);
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.8px;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(145deg, #7182f0, #4357d8);
  border-radius: 12px;
  box-shadow: 0 5px 12px #4357d833;
}

.brand-period {
  color: var(--accent);
}

.create-event-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  margin: 35px 0 34px;
  color: #fff;
  font-weight: 650;
  background: var(--accent);
  border: 0;
  border-radius: 12px;
  box-shadow: 0 8px 18px #4357d82b;
  transition: background 160ms ease, transform 160ms ease;
}

.create-event-button:hover {
  background: #3448c5;
  transform: translateY(-1px);
}

.mini-calendar-heading,
.section-heading,
.calendar-toolbar,
.toolbar-actions,
.calendar-navigation,
.upcoming-heading,
.event-modal-header,
.event-modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mini-calendar-heading h2,
.section-heading h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.mini-month-actions,
.calendar-navigation {
  display: flex;
  gap: 3px;
}

.mini-month-actions button,
.calendar-navigation button {
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  color: #7f899a;
  background: transparent;
  border: 0;
  border-radius: 7px;
}

.mini-month-actions button:hover,
.calendar-navigation button:hover {
  color: var(--accent);
  background: #f1f3ff;
}

.mini-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 3px 1px;
  margin-top: 10px;
}

.mini-calendar-weekdays {
  margin-top: 18px;
  color: #a0a8b7;
  font-size: 10px;
  font-weight: 650;
  text-align: center;
}

.mini-day {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  color: #566176;
  font-size: 11px;
  background: transparent;
  border: 0;
  border-radius: 50%;
}

.mini-day:hover {
  color: var(--accent);
  background: #f0f2ff;
}

.mini-day.outside-month {
  color: #c1c6d0;
}

.mini-day.is-today {
  color: #fff;
  font-weight: 700;
  background: var(--accent);
}

.country-filters {
  margin-top: 35px;
}

.country-search {
  width: 100%;
  min-width: 0;
  margin-bottom: 12px;
  padding: 8px 10px;
  color: #526077;
  font-size: 12px;
  background: #fff;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
}

.country-search:focus {
  border-color: #9da9e8;
  outline: 2px solid #e8ebff;
}

.country-load-error {
  margin: 8px 0 0;
  color: #a34a41;
  font-size: 11px;
}

.country-load-error button {
  padding: 0;
  color: inherit;
  font-weight: 650;
  background: none;
  border: 0;
  text-decoration: underline;
}

.section-heading {
  margin-bottom: 13px;
}

.section-heading > span {
  color: #9aa2b0;
  font-size: 11px;
  font-weight: 600;
}

.country-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 39px;
  cursor: pointer;
}

.country-filter input {
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: var(--accent);
}

.country-color {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  background: var(--country-color);
  border-radius: 50%;
}

.country-name {
  flex: 1;
  color: #526077;
  font-size: 12px;
}

.country-code {
  color: #a5adba;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.4px;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 25px;
}

.privacy-indicator {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  color: #60806c;
  background: #edf5ef;
  border-radius: 10px;
}

.sidebar-footer strong,
.sidebar-footer small {
  display: block;
}

.sidebar-footer strong {
  color: #546071;
  font-size: 10px;
  font-weight: 650;
}

.sidebar-footer small {
  margin-top: 3px;
  color: #969eac;
  font-size: 9px;
}

.main-content {
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 42px clamp(24px, 4vw, 64px) 25px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 7px;
  color: #8d96a8;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.65px;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -1.2px;
}

.page-subtitle {
  margin: 7px 0 0;
  color: #8790a0;
  font-size: 13px;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 4px;
  color: #768195;
  font-size: 11px;
  white-space: nowrap;
}

.live-dot {
  width: 7px;
  height: 7px;
  background: #75b887;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #75b8871c;
}

.calendar-card {
  padding: 22px 25px 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eceef3;
  border-radius: 17px;
  box-shadow: 0 8px 30px #23345b08;
}

.calendar-toolbar {
  gap: 18px;
  margin-bottom: 19px;
}

.toolbar-date {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.toolbar-date h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.6px;
  white-space: nowrap;
}

.loading-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #929bac;
  font-size: 10px;
  white-space: nowrap;
}

.loading-label :deep(.spinner-border) {
  width: 12px;
  height: 12px;
  border-width: 1.5px;
}

.toolbar-actions {
  gap: 9px;
}

.calendar-navigation {
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: 9px;
}

.calendar-navigation button {
  width: 30px;
  height: 30px;
}

.today-button,
.view-switcher {
  height: 34px;
  color: #647087;
  font-size: 11px;
  font-weight: 600;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 9px;
}

.today-button {
  padding: 0 12px;
}

.today-button:hover {
  color: var(--accent);
  background: #f5f6ff;
}

.view-switcher {
  display: flex;
  align-items: center;
  padding: 3px;
  background: #f6f7fa;
}

.view-switcher button {
  height: 26px;
  padding: 0 9px;
  color: #7c8698;
  font-size: 10px;
  font-weight: 600;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.view-switcher button.active {
  color: #3349c6;
  background: #fff;
  box-shadow: 0 1px 3px #1c2a4418;
}

.calendar-card :deep(.fc) {
  --fc-border-color: #edf0f4;
  --fc-page-bg-color: #fff;
  --fc-neutral-bg-color: #f8f9fb;
  --fc-today-bg-color: #f5f6ff;
  color: #46536a;
  font-size: 11px;
}

.calendar-card :deep(.fc .fc-scrollgrid) {
  border: 0;
}

.calendar-card :deep(.fc .fc-scrollgrid-section > td),
.calendar-card :deep(.fc .fc-scrollgrid-section > th) {
  border: 0;
}

.calendar-card :deep(.fc .fc-col-header-cell) {
  padding: 0 0 10px;
  border: 0;
}

.calendar-card :deep(.fc .fc-col-header-cell-cushion) {
  color: #9aa3b2;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-decoration: none;
  text-transform: uppercase;
}

.calendar-card :deep(.fc .fc-daygrid-day) {
  min-height: 105px;
}

.calendar-card :deep(.fc .fc-daygrid-day-frame) {
  min-height: 105px;
  padding: 7px 8px 4px;
}

.calendar-card :deep(.fc .fc-daygrid-day-top) {
  flex-direction: row;
  margin-bottom: 4px;
}

.calendar-card :deep(.fc .fc-daygrid-day-number) {
  color: #68748a;
  font-size: 10px;
  text-decoration: none;
}

.calendar-card :deep(.fc .fc-day-today .fc-daygrid-day-number) {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  color: #fff;
  background: var(--accent);
  border-radius: 50%;
}

.calendar-card :deep(.fc .fc-day-other .fc-daygrid-day-number) {
  color: #bbc1cc;
}

.calendar-card :deep(.fc .fc-daygrid-day-events) {
  margin-top: 1px;
}

.calendar-card :deep(.fc .fc-daygrid-event) {
  padding: 2px 4px;
  border: 0;
  border-radius: 4px;
}

.calendar-card :deep(.fc .fc-event-title) {
  overflow: hidden;
  font-size: 9px;
  font-weight: 600;
  text-overflow: ellipsis;
}

.calendar-card :deep(.fc .fc-daygrid-more-link) {
  color: var(--accent);
  font-size: 9px;
  text-decoration: none;
}

.calendar-card :deep(.fc .fc-timegrid-slot-label-cushion),
.calendar-card :deep(.fc .fc-list-day-text),
.calendar-card :deep(.fc .fc-list-day-side-text) {
  color: #758096;
  text-decoration: none;
}

.calendar-card :deep(.fc .fc-list-event-title a) {
  color: var(--ink);
  text-decoration: none;
}

.calendar-card :deep(.fc .fc-highlight) {
  background: #eef0ff;
}

.holiday-alert,
.event-notice {
  position: relative;
  padding-right: 42px;
  font-size: 12px;
  border-radius: 10px;
}

.holiday-alert .btn-close,
.event-notice .btn-close {
  position: absolute;
  top: 50%;
  right: 12px;
  padding: 7px;
  transform: translateY(-50%);
}

.upcoming-section {
  margin-top: 35px;
}

.upcoming-heading {
  margin-bottom: 14px;
}

.upcoming-heading .eyebrow {
  margin-bottom: 4px;
}

.upcoming-heading h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.upcoming-count {
  color: #919aab;
  font-size: 10px;
}

.upcoming-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.upcoming-event {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 63px;
  padding: 11px 12px;
  background: #fff;
  border: 1px solid #eceef3;
  border-radius: 12px;
}

.upcoming-event-color {
  width: 8px;
  height: 30px;
  flex: 0 0 8px;
  background: var(--event-color);
  border-radius: 5px;
}

.upcoming-event-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.upcoming-event-info strong {
  overflow: hidden;
  color: #3e4b62;
  font-size: 10px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upcoming-event-info span {
  color: #949dad;
  font-size: 9px;
}

.upcoming-event-info small {
  overflow: hidden;
  color: #818b9d;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-event-button {
  color: #a5adba;
  background: transparent;
  border: 0;
}

.delete-event-button:hover {
  color: #d34b60;
}

.empty-upcoming {
  margin: 0;
  padding: 17px;
  color: #929bac;
  font-size: 11px;
  background: #fff;
  border: 1px dashed #dfe3eb;
  border-radius: 11px;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 38px;
  color: #a1a8b5;
  font-size: 9px;
}

.page-footer a {
  color: #6877c5;
  text-decoration: none;
}

.event-modal-backdrop {
  position: fixed;
  z-index: 1055;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #1b254588;
  backdrop-filter: blur(4px);
}

.event-modal {
  width: min(100%, 480px);
  padding: 25px;
  background: #fff;
  border: 1px solid #ffffff80;
  border-radius: 17px;
  box-shadow: 0 24px 70px #17213a30;
}

.event-modal-header {
  align-items: flex-start;
  margin-bottom: 23px;
}

.event-modal-header h2 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.modal-close-button {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  color: #7f899a;
  background: #f5f6f9;
  border: 0;
  border-radius: 8px;
}

.event-modal .form-label {
  margin: 14px 0 6px;
  color: #566176;
  font-size: 11px;
  font-weight: 650;
}

.event-modal .form-control {
  min-height: 41px;
  color: #344056;
  font-size: 12px;
  border-color: #e4e7ee;
  border-radius: 9px;
  box-shadow: none;
}

.event-modal .form-control:focus {
  border-color: #8995ed;
  box-shadow: 0 0 0 3px #4357d817;
}

.event-modal textarea.form-control {
  min-height: 80px;
  resize: vertical;
}

.event-time-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.optional-label {
  margin-left: 4px;
  color: #a2aab7;
  font-size: 9px;
  font-weight: 400;
}

.form-error {
  margin: 11px 0 0;
  color: #bd374d;
  font-size: 11px;
}

.event-modal-actions {
  justify-content: flex-end;
  gap: 8px;
  margin-top: 22px;
}

.event-modal-actions .btn {
  min-height: 37px;
  padding: 0 14px;
  font-size: 11px;
  border-radius: 8px;
}

.event-modal-actions .btn-primary {
  background: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 1150px) {
  .calendar-app {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .sidebar {
    padding-right: 18px;
    padding-left: 18px;
  }

  .calendar-card {
    padding: 18px;
  }

  .calendar-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 760px) {
  .calendar-app {
    display: block;
  }

  .sidebar {
    position: static;
    min-height: 0;
    padding: 15px 18px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .sidebar .brand {
    font-size: 18px;
  }

  .sidebar .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .create-event-button {
    position: absolute;
    top: 13px;
    right: 17px;
    min-height: 36px;
    margin: 0;
    padding: 0 12px;
    font-size: 11px;
  }

  .mini-calendar,
  .sidebar-footer {
    display: none;
  }

  .country-filters {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 13px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .country-filters::-webkit-scrollbar {
    display: none;
  }

  .section-heading {
    flex: 0 0 auto;
    margin: 0 5px 0 0;
  }

  .country-search {
    flex: 0 0 145px;
    margin: 0;
    padding: 6px 8px;
    font-size: 10px;
  }

  .country-load-error {
    flex: 0 0 100%;
  }

  .section-heading h2 {
    white-space: nowrap;
  }

  .section-heading > span,
  .country-filter input,
  .country-code {
    display: none;
  }

  .country-filter {
    flex: 0 0 auto;
    gap: 6px;
    min-height: 28px;
    padding: 0 8px;
    background: #f7f8fb;
    border-radius: 20px;
  }

  .country-name {
    font-size: 10px;
    white-space: nowrap;
  }

  .main-content {
    padding: 26px 15px 20px;
  }

  .page-header {
    align-items: flex-start;
    margin-bottom: 19px;
  }

  .page-header h1 {
    font-size: 22px;
    letter-spacing: -0.7px;
  }

  .page-subtitle {
    font-size: 11px;
  }

  .header-date {
    display: none;
  }

  .calendar-card {
    padding: 14px 10px 12px;
    border-radius: 13px;
  }

  .calendar-toolbar {
    gap: 12px;
    margin: 2px 4px 13px;
  }

  .toolbar-date h2 {
    font-size: 18px;
  }

  .loading-label {
    font-size: 0;
  }

  .toolbar-actions {
    width: 100%;
    gap: 6px;
  }

  .calendar-navigation {
    margin-right: auto;
  }

  .view-switcher button {
    padding: 0 7px;
    font-size: 9px;
  }

  .calendar-card :deep(.fc .fc-daygrid-day),
  .calendar-card :deep(.fc .fc-daygrid-day-frame) {
    min-height: 70px;
  }

  .calendar-card :deep(.fc .fc-daygrid-day-frame) {
    padding: 4px 3px 2px;
  }

  .calendar-card :deep(.fc .fc-daygrid-event) {
    padding: 1px 2px;
  }

  .calendar-card :deep(.fc .fc-event-title) {
    font-size: 8px;
  }

  .calendar-card :deep(.fc .fc-daygrid-day-number) {
    font-size: 9px;
  }

  .upcoming-section {
    margin-top: 25px;
  }

  .upcoming-list {
    grid-template-columns: 1fr;
  }

  .page-footer {
    margin-top: 28px;
    font-size: 8px;
  }
}

@media (max-width: 390px) {
  .view-switcher button {
    padding: 0 5px;
  }

  .calendar-navigation button {
    width: 26px;
  }

  .today-button {
    padding: 0 8px;
  }
}
</style>

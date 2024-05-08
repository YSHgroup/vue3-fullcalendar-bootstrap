export interface CustomEvent {
  id?: string | number
  title: string
  start: string | Date | null
  end: string | Date | null
  contentText?: string
}
export interface Timeslot {
  start: string | Date | null
  end: string | Date | null
}
export interface SelectedSlot {
  modal: boolean
  times: Timeslot
}
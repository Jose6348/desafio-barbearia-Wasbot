export const OPENING_MINUTES = 9 * 60
export const CLOSING_MINUTES = 19 * 60
export const LUNCH_START_MINUTES = 12 * 60
export const LUNCH_END_MINUTES = 13 * 60

export const SLOT_MINUTES = 15
export const MAX_DAYS_AHEAD = 30

export const CLOSED_WEEKDAYS: readonly number[] = [0]

export function isClosedWeekday(date: Date): boolean {
  return CLOSED_WEEKDAYS.includes(date.getDay())
}

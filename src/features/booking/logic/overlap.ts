import { LUNCH_END_MINUTES, LUNCH_START_MINUTES } from '../../../domain/schedule'

export type Interval = { start: number; end: number }

export function intervalsOverlap(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end
}

export function crossesLunch(interval: Interval): boolean {
  return intervalsOverlap(interval, {
    start: LUNCH_START_MINUTES,
    end: LUNCH_END_MINUTES,
  })
}

import { getProfessionalsForService } from '../../../domain/professionals'
import {
  CLOSING_MINUTES,
  LUNCH_END_MINUTES,
  LUNCH_START_MINUTES,
  OPENING_MINUTES,
  SLOT_MINUTES,
} from '../../../domain/schedule'
import { getServiceById } from '../../../domain/services'
import type {
  Appointment,
  ProfessionalChoice,
  ServiceId,
} from '../../../domain/types'
import { isSameDay, minutesSinceMidnight } from '../../../shared/lib/date'
import { hhmmToMinutes, minutesToHHmm } from '../../../shared/lib/time'
import { crossesLunch, intervalsOverlap, type Interval } from './overlap'

export function generateDaySlots(): string[] {
  const slots: string[] = []
  for (let m = OPENING_MINUTES; m < CLOSING_MINUTES; m += SLOT_MINUTES) {
    if (m >= LUNCH_START_MINUTES && m < LUNCH_END_MINUTES) continue
    slots.push(minutesToHHmm(m))
  }
  return slots
}

type AvailabilityParams = {
  serviceId: ServiceId
  professional: ProfessionalChoice
  date: string
  appointments: Appointment[]
  now: Date
}

export function getAvailableSlots(params: AvailabilityParams): string[] {
  const { serviceId, professional, date, appointments, now } = params
  const duration = getServiceById(serviceId).durationMin

  const candidateIds =
    professional === 'any'
      ? getProfessionalsForService(serviceId).map((p) => p.id)
      : [professional]

  const cutoffMinutes = isSameDay(date, now) ? minutesSinceMidnight(now) : -1

  return generateDaySlots().filter((slot) => {
    const start = hhmmToMinutes(slot)
    const interval: Interval = { start, end: start + duration }

    if (interval.end > CLOSING_MINUTES) return false
    if (crossesLunch(interval)) return false
    if (start <= cutoffMinutes) return false

    return candidateIds.some((profId) =>
      !appointments.some(
        (appt) =>
          appt.professionalId === profId &&
          appt.date === date &&
          intervalsOverlap(interval, {
            start: hhmmToMinutes(appt.startTime),
            end: hhmmToMinutes(appt.endTime),
          }),
      ),
    )
  })
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appointment } from '../../domain/types'

type AppointmentsState = {
  appointments: Appointment[]
  add: (appointment: Appointment) => void
  remove: (id: string) => void
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set) => ({
      appointments: [],
      add: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
      remove: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),
    }),
    { name: 'barbearia:appointments:v1' },
  ),
)

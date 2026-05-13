import { AppointmentsList } from '../features/appointments/components/AppointmentsList'
import { SiteFooter, SiteHeader } from '../shared/components/SiteShell'

export function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <AppointmentsList />
      <SiteFooter />
    </div>
  )
}

import { BookingFlow } from '../features/booking/components/BookingFlow'
import { SiteFooter, SiteHeader } from '../shared/components/SiteShell'

export function BookingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <BookingFlow />
      <SiteFooter />
    </div>
  )
}

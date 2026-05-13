import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { BookingPage } from './pages/BookingPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agendar" element={<BookingPage />} />
        <Route path="/meus-agendamentos" element={<AppointmentsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

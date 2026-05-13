import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `hover:text-gold transition-colors${isActive ? ' text-gold' : ''}`

export function SiteHeader() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-ink/5 bg-paper">
      <Link to="/" className="flex items-center gap-3">
        <div className="size-10 bg-ink flex items-center justify-center text-gold font-serif text-2xl leading-none">
          B
        </div>
        <div className="leading-tight">
          <div className="font-serif text-xl tracking-tight uppercase">
            Barbearia Heritage
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-ink/40">
            Est. ritual &amp; precisão
          </div>
        </div>
      </Link>
      <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest items-center">
        <NavLink to="/" end className={navLinkClass}>
          Início
        </NavLink>
        <NavLink to="/agendar" className={navLinkClass}>
          Agendar
        </NavLink>
        <NavLink to="/meus-agendamentos" className={navLinkClass}>
          Meus horários
        </NavLink>
        <Link
          to="/agendar"
          className="ml-2 bg-ink text-paper px-4 py-2 hover:bg-gold hover:text-ink transition-colors"
        >
          Reservar
        </Link>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/5 py-10 px-6 md:px-12 mt-20 text-[10px] uppercase tracking-[0.3em] flex flex-wrap gap-6 justify-between text-ink/40">
      <span>© {new Date().getFullYear()} Barbearia Heritage</span>
      <span>Seg a Sáb · 09:00 — 19:00 · Almoço 12:00 — 13:00</span>
      <span>R. da Tradição, 123 — Centro</span>
    </footer>
  )
}

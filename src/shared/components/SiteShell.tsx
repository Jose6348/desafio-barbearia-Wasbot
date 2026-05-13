import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `hover:text-gold transition-colors${isActive ? ' text-gold' : ''}`

export function SiteHeader() {
  return (
    <nav className="flex items-center justify-between gap-3 px-4 md:px-12 py-4 md:py-6 border-b border-ink/5 bg-paper">
      <Link to="/" className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="size-9 md:size-10 shrink-0 bg-ink flex items-center justify-center text-gold font-serif text-2xl leading-none">
          B
        </div>
        <div className="leading-tight min-w-0">
          <div className="font-serif text-base md:text-xl tracking-tight uppercase truncate">
            Barbearia Heritage
          </div>
          <div className="hidden md:block text-[9px] uppercase tracking-[0.3em] text-ink/40">
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

      <div className="flex md:hidden gap-4 text-[10px] font-bold uppercase tracking-widest items-center shrink-0">
        <NavLink to="/agendar" className={navLinkClass}>
          Agendar
        </NavLink>
        <NavLink to="/meus-agendamentos" className={navLinkClass}>
          Meus
        </NavLink>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/5 py-10 px-4 md:px-12 mt-20 text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] flex flex-col md:flex-row gap-3 md:gap-6 md:justify-between text-ink/40">
      <span>© {new Date().getFullYear()} Barbearia Heritage</span>
      <span>Seg a Sáb · 09:00 — 19:00 · Almoço 12:00 — 13:00</span>
      <span>R. da Tradição, 123 — Centro</span>
    </footer>
  )
}

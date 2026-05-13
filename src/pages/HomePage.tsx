import { Link } from 'react-router-dom'
import { PROFESSIONALS } from '../domain/professionals'
import { SERVICES, getServiceById } from '../domain/services'
import { SiteFooter, SiteHeader } from '../shared/components/SiteShell'

export function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-16 md:pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink/40">
              Desde 1998 · Centro
            </span>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mt-4 mb-6 italic">
              Tradição em cada corte,<br />
              <span className="text-gold">excelência</span> em cada detalhe.
            </h1>
            <p className="max-w-xl text-ink/60 text-lg">
              Reserve com nossos mestres em poucos toques. Sem cadastro, sem pagamento
              online — só ritual.
            </p>
            <div className="mt-10 flex gap-4 items-center">
              <Link
                to="/agendar"
                className="bg-ink text-paper px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-gold hover:text-ink transition-colors"
              >
                Reservar agora
              </Link>
              <Link
                to="/meus-agendamentos"
                className="text-xs uppercase tracking-widest text-ink/60 hover:text-gold transition-colors"
              >
                Ver meus horários →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 border-l border-ink/10 pl-8 hidden lg:block">
            <div className="space-y-4 text-sm">
              <InfoRow label="Funcionamento" value="Seg — Sáb · 09—19h" />
              <InfoRow label="Almoço" value="12:00 — 13:00" />
              <InfoRow label="Intervalos" value="A cada 15 min" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                Menu
              </span>
              <h2 className="font-serif text-4xl mt-2 italic">O cardápio da casa</h2>
            </div>
            <Link
              to="/agendar"
              className="hidden md:block text-xs uppercase tracking-widest text-paper/60 hover:text-gold"
            >
              Reservar →
            </Link>
          </div>
          <div className="divide-y divide-paper/10">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="py-6 grid grid-cols-12 gap-4 items-baseline"
              >
                <h3 className="col-span-12 md:col-span-4 font-serif text-2xl">
                  {s.name}
                </h3>
                <p className="col-span-8 md:col-span-5 text-sm text-paper/50">
                  {s.description}
                </p>
                <p className="col-span-2 md:col-span-1 text-xs uppercase tracking-widest text-paper/40">
                  {s.durationMin}min
                </p>
                <p className="col-span-2 md:col-span-2 text-right font-serif text-2xl text-gold">
                  R$ {s.priceBRL}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto py-24">
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
            Equipe
          </span>
          <h2 className="font-serif text-4xl mt-2 italic">Os mestres da casa</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {PROFESSIONALS.map((p) => (
            <div
              key={p.id}
              className="border border-ink/10 p-8 hover:border-gold transition-colors group"
            >
              <div className="size-20 rounded-full bg-ink text-gold font-serif text-3xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-ink transition-colors">
                {p.name[0]}
              </div>
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="text-sm text-ink/50 mt-1">{p.role}</p>
              <div className="mt-6 pt-6 border-t border-ink/5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink/40 mb-3">
                  Realiza
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.services.map((sid) => (
                    <span
                      key={sid}
                      className="text-[10px] uppercase tracking-widest border border-ink/15 px-2 py-1"
                    >
                      {getServiceById(sid).name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink/40">{label}</p>
      <p className="font-serif text-xl">{value}</p>
    </div>
  )
}

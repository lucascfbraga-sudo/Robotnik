import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Search, BarChart3, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "StatBall — Estatísticas completas de futebol" },
      { name: "description", content: "Selecione um time e veja os últimos 20 jogos com todas as estatísticas: chutes, escanteios, cartões, faltas, laterais e mais." },
    ],
  }),
});

const POPULAR_TEAMS: { id: number; name: string; country: string; color: string }[] = [
  { id: 33, name: "Manchester United", country: "England", color: "#DA020E" },
  { id: 40, name: "Liverpool", country: "England", color: "#C8102E" },
  { id: 50, name: "Manchester City", country: "England", color: "#6CABDD" },
  { id: 42, name: "Arsenal", country: "England", color: "#EF0107" },
  { id: 49, name: "Chelsea", country: "England", color: "#034694" },
  { id: 541, name: "Real Madrid", country: "Spain", color: "#FEBE10" },
  { id: 529, name: "Barcelona", country: "Spain", color: "#A50044" },
  { id: 496, name: "Juventus", country: "Italy", color: "#000000" },
  { id: 489, name: "AC Milan", country: "Italy", color: "#FB090B" },
  { id: 505, name: "Inter", country: "Italy", color: "#0068A8" },
  { id: 157, name: "Bayern München", country: "Germany", color: "#DC052D" },
  { id: 85, name: "Paris Saint Germain", country: "France", color: "#004170" },
  { id: 127, name: "Flamengo", country: "Brazil", color: "#D50000" },
  { id: 131, name: "Corinthians", country: "Brazil", color: "#000000" },
  { id: 118, name: "Palmeiras", country: "Brazil", color: "#006437" },
  { id: 126, name: "São Paulo", country: "Brazil", color: "#E30613" },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3 w-3" /> Estatísticas em tempo real
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Todas as estatísticas de cada jogo, em um só lugar
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Chutes, escanteios, cartões, faltas, laterais, posse de bola e muito mais.
          Escolha um time e mergulhe nos últimos 20 jogos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <Feature icon={<Search className="h-4 w-4" />} label="Busca instantânea" />
          <Feature icon={<BarChart3 className="h-4 w-4" />} label="20+ estatísticas por jogo" />
          <Feature icon={<Trophy className="h-4 w-4" />} label="Ligas do mundo todo" />
        </div>
      </section>

      {/* Popular teams */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Times em destaque</h2>
          <span className="text-xs text-muted-foreground">Ou use a busca acima</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {POPULAR_TEAMS.map((t) => (
            <Link
              key={t.id}
              to="/team/$teamId"
              params={{ teamId: String(t.id) }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-accent"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                style={{ background: t.color }}
              />
              <img
                src={`https://media.api-sports.io/football/teams/${t.id}.png`}
                alt=""
                className="mb-3 h-12 w-12 object-contain"
                loading="lazy"
              />
              <div className="relative">
                <div className="truncate text-sm font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.country}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
      <span className="text-primary">{icon}</span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}

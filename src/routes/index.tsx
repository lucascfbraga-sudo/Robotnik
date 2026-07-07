import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Search, BarChart3, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "StatBall — Estatísticas de futebol" },
      { name: "description", content: "Selecione um time e veja os últimos jogos com placar, estádio, estatísticas e mais." },
    ],
  }),
});

// TheSportsDB IDs (idTeam).
const POPULAR_TEAMS: { id: string; name: string; country: string; color: string }[] = [
  { id: "133612", name: "Manchester United", country: "England", color: "#DA020E" },
  { id: "133602", name: "Liverpool", country: "England", color: "#C8102E" },
  { id: "133613", name: "Manchester City", country: "England", color: "#6CABDD" },
  { id: "133604", name: "Arsenal", country: "England", color: "#EF0107" },
  { id: "133610", name: "Chelsea", country: "England", color: "#034694" },
  { id: "133738", name: "Real Madrid", country: "Spain", color: "#FEBE10" },
  { id: "133739", name: "Barcelona", country: "Spain", color: "#A50044" },
  { id: "133665", name: "Juventus", country: "Italy", color: "#000000" },
  { id: "133670", name: "AC Milan", country: "Italy", color: "#FB090B" },
  { id: "133676", name: "Inter Milan", country: "Italy", color: "#0068A8" },
  { id: "133650", name: "Bayern München", country: "Germany", color: "#DC052D" },
  { id: "133643", name: "Paris Saint-Germain", country: "France", color: "#004170" },
  { id: "134429", name: "Flamengo", country: "Brazil", color: "#D50000" },
  { id: "134432", name: "Corinthians", country: "Brazil", color: "#000000" },
  { id: "134430", name: "Palmeiras", country: "Brazil", color: "#006437" },
  { id: "134431", name: "São Paulo", country: "Brazil", color: "#E30613" },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-16 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3 w-3" /> Dados de futebol
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Últimos jogos e estatísticas em um só lugar
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Escolha um time e veja seus jogos mais recentes com placar, estádio e as estatísticas disponíveis para cada partida.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <Feature icon={<Search className="h-4 w-4" />} label="Busca instantânea" />
          <Feature icon={<BarChart3 className="h-4 w-4" />} label="Estatísticas de partida" />
          <Feature icon={<Trophy className="h-4 w-4" />} label="Ligas do mundo todo" />
        </div>
      </section>

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
              params={{ teamId: t.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-accent"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                style={{ background: t.color }}
              />
              <div
                className="mb-3 grid h-12 w-12 place-items-center rounded-lg text-sm font-bold text-white"
                style={{ background: t.color }}
              >
                {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
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

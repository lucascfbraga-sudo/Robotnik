import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFixture, type MatchStat } from "@/lib/sportsdb.functions";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/match/$fixtureId")({
  component: MatchPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Não conseguimos carregar esta partida</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Voltar para a home</Link>
    </div>
  ),
});

/* PT-BR labels for common TheSportsDB stat keys */
const STAT_LABELS: Record<string, string> = {
  "Shots on Goal": "Chutes ao gol",
  "Shots off Goal": "Chutes para fora",
  "Total Shots": "Total de chutes",
  "Blocked Shots": "Chutes bloqueados",
  "Fouls": "Faltas",
  "Corner Kicks": "Escanteios",
  "Corners": "Escanteios",
  "Offsides": "Impedimentos",
  "Ball Possession": "Posse de bola",
  "Possession": "Posse de bola",
  "Yellow Cards": "Cartões amarelos",
  "Red Cards": "Cartões vermelhos",
  "Goalkeeper Saves": "Defesas do goleiro",
  "Saves": "Defesas",
  "Total passes": "Total de passes",
  "Passes": "Passes",
  "Passes accurate": "Passes certos",
  "Passes %": "Precisão de passes",
};

function MatchPage() {
  const { fixtureId } = Route.useParams();
  const fn = useServerFn(getFixture);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fixture", fixtureId],
    queryFn: () => fn({ data: { id: fixtureId } }),
    staleTime: 1000 * 60,
  });

  if (isLoading) return <MatchSkeleton />;
  if (isError)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  if (!data) return null;

  const { fixture: f, statistics } = data;
  const date = f.date ? new Date(f.date) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/team/$teamId"
        params={{ teamId: f.home.id }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Scoreboard */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {f.league && (
            <span className="inline-flex items-center gap-1.5">
              {f.leagueBadge && <img src={f.leagueBadge} alt="" className="h-4 w-4 object-contain" />}
              {f.league}
              {f.round ? ` · Rodada ${f.round}` : ""}
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-8">
          <TeamSide side="home" name={f.home.name} badge={f.home.badge} />
          <div className="text-center">
            <div className="text-4xl font-extrabold tabular-nums sm:text-6xl">
              {f.home.score ?? "-"}
              <span className="mx-2 text-muted-foreground">:</span>
              {f.away.score ?? "-"}
            </div>
            {f.status && (
              <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                {f.status}
              </div>
            )}
          </div>
          <TeamSide side="away" name={f.away.name} badge={f.away.badge} />
        </div>

        {(f.venue || f.city) && (
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {[f.venue, f.city].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Estatísticas</h2>
        {statistics.length > 0 ? (
          <StatsPanel stats={statistics} />
        ) : (
          <EmptyBlock>Estatísticas não estão disponíveis para esta partida na base do TheSportsDB.</EmptyBlock>
        )}
      </section>
    </div>
  );
}

function TeamSide({ side, name, badge }: { side: "home" | "away"; name: string; badge: string | null }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${side === "home" ? "sm:items-end" : "sm:items-start"}`}>
      {badge ? (
        <img src={badge} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
      ) : (
        <div className="h-16 w-16 rounded-lg bg-secondary sm:h-20 sm:w-20" />
      )}
      <div className="text-center text-sm font-bold sm:text-base">{name}</div>
    </div>
  );
}

function StatsPanel({ stats }: { stats: MatchStat[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="space-y-4">
        {stats.map((s) => (
          <StatRow key={s.label} label={STAT_LABELS[s.label] ?? s.label} home={s.home} away={s.away} />
        ))}
      </div>
    </div>
  );
}

function StatRow({ label, home, away }: { label: string; home: number | null; away: number | null }) {
  const h = home ?? 0;
  const a = away ?? 0;
  const total = h + a;
  const hPct = total > 0 ? (h / total) * 100 : 50;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className={`font-mono tabular-nums font-bold ${h >= a ? "text-foreground" : "text-muted-foreground"}`}>
          {home ?? "—"}
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`font-mono tabular-nums font-bold ${a >= h ? "text-foreground" : "text-muted-foreground"}`}>
          {away ?? "—"}
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full transition-all" style={{ width: `${hPct}%`, background: "var(--color-primary)" }} />
        <div className="h-full transition-all" style={{ width: `${100 - hPct}%`, background: "var(--color-success)" }} />
      </div>
    </div>
  );
}

function EmptyBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function MatchSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="skeleton h-64 rounded-3xl" />
      <div className="mt-8 skeleton h-96 rounded-2xl" />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFixture, type FixtureStat, type FixtureEvent } from "@/lib/api-football.functions";
import { Calendar, MapPin, Flag as Whistle, ArrowLeft, Goal, RectangleVertical, RefreshCw } from "lucide-react";

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

/* Mapeamento de tipos de estatística vindas em inglês → PT-BR */
const STAT_LABELS: Record<string, string> = {
  "Shots on Goal": "Chutes ao gol",
  "Shots off Goal": "Chutes para fora",
  "Total Shots": "Total de chutes",
  "Blocked Shots": "Chutes bloqueados",
  "Shots insidebox": "Chutes dentro da área",
  "Shots outsidebox": "Chutes de fora da área",
  "Fouls": "Faltas",
  "Corner Kicks": "Escanteios",
  "Offsides": "Impedimentos",
  "Ball Possession": "Posse de bola",
  "Yellow Cards": "Cartões amarelos",
  "Red Cards": "Cartões vermelhos",
  "Goalkeeper Saves": "Defesas do goleiro",
  "Total passes": "Total de passes",
  "Passes accurate": "Passes certos",
  "Passes %": "Precisão de passes",
  "expected_goals": "xG (gols esperados)",
  "goals_prevented": "Gols evitados",
};

/* Ordem de exibição preferida */
const STAT_ORDER = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Shots off Goal",
  "Blocked Shots",
  "Shots insidebox",
  "Shots outsidebox",
  "Corner Kicks",
  "Offsides",
  "Fouls",
  "Yellow Cards",
  "Red Cards",
  "Goalkeeper Saves",
  "Total passes",
  "Passes accurate",
  "Passes %",
  "expected_goals",
  "goals_prevented",
];

function MatchPage() {
  const { fixtureId } = Route.useParams();
  const id = Number(fixtureId);
  const fn = useServerFn(getFixture);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fixture", id],
    queryFn: () => fn({ data: { id } }),
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

  const { fixture: f, statistics, events } = data;
  const date = new Date(f.fixture.date);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/team/$teamId"
        params={{ teamId: String(f.teams.home.id) }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Scoreboard */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <img src={f.league.logo} alt="" className="h-4 w-4 object-contain" />
            {f.league.name} · {f.league.round}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-8">
          <TeamSide side="home" name={f.teams.home.name} logo={f.teams.home.logo} />
          <div className="text-center">
            <div className="text-4xl font-extrabold tabular-nums sm:text-6xl">
              {f.goals.home ?? "-"}
              <span className="mx-2 text-muted-foreground">:</span>
              {f.goals.away ?? "-"}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              {f.fixture.status.long}
            </div>
            {f.score.halftime.home != null && (
              <div className="mt-1 text-xs text-muted-foreground">
                1ºT: {f.score.halftime.home} - {f.score.halftime.away}
              </div>
            )}
          </div>
          <TeamSide side="away" name={f.teams.away.name} logo={f.teams.away.logo} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {f.fixture.venue?.name && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {f.fixture.venue.name}
              {f.fixture.venue.city ? `, ${f.fixture.venue.city}` : ""}
            </span>
          )}
          {f.fixture.referee && (
            <span className="inline-flex items-center gap-1">
              <Whistle className="h-3 w-3" /> {f.fixture.referee}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Estatísticas</h2>
        {statistics.length >= 2 ? (
          <StatsPanel home={statistics[0]} away={statistics[1]} />
        ) : (
          <EmptyBlock>Estatísticas indisponíveis para esta partida.</EmptyBlock>
        )}
      </section>

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Timeline</h2>
        {events.length > 0 ? (
          <Timeline events={events} homeTeamId={f.teams.home.id} />
        ) : (
          <EmptyBlock>Sem eventos registrados.</EmptyBlock>
        )}
      </section>
    </div>
  );
}

function TeamSide({ side, name, logo }: { side: "home" | "away"; name: string; logo: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${side === "home" ? "sm:items-end" : "sm:items-start"}`}>
      <img src={logo} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
      <div className="text-center text-sm font-bold sm:text-base">{name}</div>
    </div>
  );
}

function StatsPanel({ home, away }: { home: FixtureStat; away: FixtureStat }) {
  const map = new Map<string, { h: number | string | null; a: number | string | null }>();
  for (const s of home.statistics) map.set(s.type, { h: s.value, a: null });
  for (const s of away.statistics) {
    const cur = map.get(s.type) ?? { h: null, a: null };
    cur.a = s.value;
    map.set(s.type, cur);
  }

  const ordered = [
    ...STAT_ORDER.filter((k) => map.has(k)),
    ...Array.from(map.keys()).filter((k) => !STAT_ORDER.includes(k)),
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="space-y-4">
        {ordered.map((type) => {
          const v = map.get(type)!;
          return <StatRow key={type} label={STAT_LABELS[type] ?? type} home={v.h} away={v.a} />;
        })}
      </div>
    </div>
  );
}

function StatRow({
  label,
  home,
  away,
}: {
  label: string;
  home: number | string | null;
  away: number | string | null;
}) {
  const hNum = toNum(home);
  const aNum = toNum(away);
  const total = hNum + aNum;
  const hPct = total > 0 ? (hNum / total) * 100 : 50;
  const isPercent = typeof home === "string" && home.endsWith("%");

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className={`font-mono tabular-nums font-bold ${hNum >= aNum ? "text-foreground" : "text-muted-foreground"}`}>
          {formatVal(home)}
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`font-mono tabular-nums font-bold ${aNum >= hNum ? "text-foreground" : "text-muted-foreground"}`}>
          {formatVal(away)}
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full transition-all"
          style={{
            width: `${isPercent ? toNum(home) : hPct}%`,
            background: "var(--color-primary)",
          }}
        />
        <div
          className="h-full transition-all"
          style={{
            width: `${isPercent ? toNum(away) : 100 - hPct}%`,
            background: "var(--color-success)",
          }}
        />
      </div>
    </div>
  );
}

function toNum(v: number | string | null): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const cleaned = v.replace("%", "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
function formatVal(v: number | string | null): string {
  if (v == null) return "—";
  return String(v);
}

function Timeline({ events, homeTeamId }: { events: FixtureEvent[]; homeTeamId: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <ol className="relative space-y-3 border-l-2 border-border pl-6">
        {events.map((ev, i) => {
          const home = ev.team.id === homeTeamId;
          return (
            <li key={i} className="relative">
              <div className="absolute -left-[29px] top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-secondary">
                <EventIcon type={ev.type} detail={ev.detail} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
                  {ev.time.elapsed}'{ev.time.extra ? `+${ev.time.extra}` : ""}
                </span>
                <span className={`text-xs uppercase tracking-wide ${home ? "text-primary" : "text-success"}`}>
                  {ev.team.name}
                </span>
              </div>
              <div className="mt-0.5 text-sm text-foreground">
                <span className="text-muted-foreground">{ev.detail}:</span>{" "}
                <span className="font-medium">{ev.player.name ?? "—"}</span>
                {ev.assist.name && (
                  <span className="text-xs text-muted-foreground"> (assist.: {ev.assist.name})</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EventIcon({ type, detail }: { type: string; detail: string }) {
  if (type === "Goal") return <Goal className="h-3 w-3 text-success" />;
  if (type === "Card")
    return (
      <RectangleVertical
        className={`h-3 w-3 ${detail.toLowerCase().includes("red") ? "text-danger fill-danger" : "text-warning fill-warning"}`}
      />
    );
  if (type === "subst") return <RefreshCw className="h-3 w-3 text-muted-foreground" />;
  return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />;
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

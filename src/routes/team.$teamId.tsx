import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTeam, getLastFixtures, type Fixture } from "@/lib/api-football.functions";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/team/$teamId")({
  component: TeamPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Não conseguimos carregar este time</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Voltar para a home</Link>
    </div>
  ),
});

function TeamPage() {
  const { teamId } = Route.useParams();
  const id = Number(teamId);
  const teamFn = useServerFn(getTeam);
  const fixturesFn = useServerFn(getLastFixtures);

  const teamQ = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamFn({ data: { id } }),
    staleTime: 1000 * 60 * 60,
  });

  const fixturesQ = useQuery({
    queryKey: ["fixtures", id, 20],
    queryFn: () => fixturesFn({ data: { teamId: id, last: 20 } }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Team header */}
      <header className="mb-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        {teamQ.isLoading ? (
          <div className="flex items-center gap-5">
            <div className="skeleton h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-7 w-64" />
              <div className="skeleton h-4 w-40" />
            </div>
          </div>
        ) : teamQ.data ? (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-secondary p-3">
              <img src={teamQ.data.team.logo} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-extrabold tracking-tight">{teamQ.data.team.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{teamQ.data.team.country}</span>
                {teamQ.data.team.founded && <span>Fundado em {teamQ.data.team.founded}</span>}
                {teamQ.data.venue?.name && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {teamQ.data.venue.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Fixtures */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Últimos 20 jogos</h2>
          <span className="text-xs text-muted-foreground">Clique em um jogo para ver as estatísticas</span>
        </div>

        {fixturesQ.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : fixturesQ.data && fixturesQ.data.length > 0 ? (
          <div className="space-y-2">
            {fixturesQ.data.map((f) => (
              <FixtureRow key={f.fixture.id} fixture={f} teamId={id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Nenhum jogo encontrado.
          </div>
        )}
      </section>
    </div>
  );
}

function FixtureRow({ fixture: f, teamId }: { fixture: Fixture; teamId: number }) {
  const date = new Date(f.fixture.date);
  const isHome = f.teams.home.id === teamId;
  const teamGoals = isHome ? f.goals.home : f.goals.away;
  const oppGoals = isHome ? f.goals.away : f.goals.home;
  const result =
    teamGoals == null || oppGoals == null
      ? null
      : teamGoals > oppGoals
      ? "W"
      : teamGoals < oppGoals
      ? "L"
      : "D";

  return (
    <Link
      to="/match/$fixtureId"
      params={{ fixtureId: String(f.fixture.id) }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 transition hover:border-primary/40 hover:bg-accent"
    >
      <div className="hidden shrink-0 sm:block">
        <img src={f.league.logo} alt="" className="h-8 w-8 object-contain opacity-80" />
      </div>

      <div className="w-20 shrink-0 text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
        </div>
        <div className="mt-0.5">{date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
      </div>

      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className={`truncate text-sm ${isHome ? "font-bold text-foreground" : "text-muted-foreground"}`}>
            {f.teams.home.name}
          </span>
          <img src={f.teams.home.logo} alt="" className="h-6 w-6 shrink-0 object-contain" />
        </div>
        <div className="shrink-0 rounded-lg bg-secondary px-3 py-1 text-center font-mono text-sm font-bold tabular-nums">
          {f.goals.home ?? "-"} <span className="text-muted-foreground">:</span> {f.goals.away ?? "-"}
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <img src={f.teams.away.logo} alt="" className="h-6 w-6 shrink-0 object-contain" />
          <span className={`truncate text-sm ${!isHome ? "font-bold text-foreground" : "text-muted-foreground"}`}>
            {f.teams.away.name}
          </span>
        </div>
      </div>

      {result && (
        <div
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold ${
            result === "W"
              ? "bg-success/15 text-success"
              : result === "L"
              ? "bg-danger/15 text-danger"
              : "bg-warning/15 text-warning"
          }`}
        >
          {result === "W" ? "V" : result === "L" ? "D" : "E"}
        </div>
      )}
      <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
    </Link>
  );
}

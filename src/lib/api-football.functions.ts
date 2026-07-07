import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ---------- Types (subset of API-Football responses) ---------- */

export type Team = {
  team: { id: number; name: string; code?: string | null; country?: string | null; logo: string; founded?: number | null };
  venue?: { id: number | null; name: string | null; city: string | null; capacity: number | null };
};

export type Fixture = {
  fixture: {
    id: number;
    date: string;
    status: { long: string; short: string; elapsed: number | null };
    venue?: { id: number | null; name: string | null; city: string | null };
    referee?: string | null;
  };
  league: { id: number; name: string; country: string; logo: string; season: number; round: string };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
  };
};

export type FixtureStat = {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: number | string | null }>;
};

export type FixtureEvent = {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
};

/* ---------- Server functions ---------- */

export const searchTeams = createServerFn({ method: "GET" })
  .inputValidator((d: { q: string }) => z.object({ q: z.string().min(2).max(60) }).parse(d))
  .handler(async ({ data }) => {
    const { apiFootball } = await import("./api-football.server");
    return apiFootball<Team[]>("/teams", { search: data.q });
  });

export const getTeam = createServerFn({ method: "GET" })
  .inputValidator((d: { id: number }) => z.object({ id: z.number().int().positive() }).parse(d))
  .handler(async ({ data }) => {
    const { apiFootball } = await import("./api-football.server");
    const res = await apiFootball<Team[]>("/teams", { id: data.id });
    if (!res[0]) throw new Error("Time não encontrado");
    return res[0];
  });

// Try most recent seasons first. Football seasons span two years, so around
// mid-year both the finishing season (N-1) and the starting one (N) can have
// played matches. We collect from newest to oldest until we have enough.
const RECENT_SEASONS = [2026, 2025, 2024, 2023, 2022, 2021];

export const getLastFixtures = createServerFn({ method: "GET" })
  .inputValidator((d: { teamId: number; last?: number }) =>
    z.object({ teamId: z.number().int().positive(), last: z.number().int().min(1).max(50).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { apiFootball } = await import("./api-football.server");
    const limit = data.last ?? 20;
    const now = Date.now();
    const collected: Fixture[] = [];
    for (const season of RECENT_SEASONS) {
      try {
        const chunk = await apiFootball<Fixture[]>("/fixtures", { team: data.teamId, season });
        collected.push(...chunk);
      } catch {
        // Season not available on this plan — skip and try older ones.
        continue;
      }
      const playedSoFar = collected.filter(
        (f) => ["FT", "AET", "PEN"].includes(f.fixture.status.short) && new Date(f.fixture.date).getTime() <= now,
      ).length;
      if (playedSoFar >= limit) break;
    }
    return collected
      .filter((f) => ["FT", "AET", "PEN"].includes(f.fixture.status.short) && new Date(f.fixture.date).getTime() <= now)
      .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
      .slice(0, limit);
  });

export const getFixture = createServerFn({ method: "GET" })
  .inputValidator((d: { id: number }) => z.object({ id: z.number().int().positive() }).parse(d))
  .handler(async ({ data }) => {
    const { apiFootball } = await import("./api-football.server");
    const [fixture, statistics, events] = await Promise.all([
      apiFootball<Fixture[]>("/fixtures", { id: data.id }),
      apiFootball<FixtureStat[]>("/fixtures/statistics", { fixture: data.id }),
      apiFootball<FixtureEvent[]>("/fixtures/events", { fixture: data.id }),
    ]);
    if (!fixture[0]) throw new Error("Partida não encontrada");
    return { fixture: fixture[0], statistics, events };
  });

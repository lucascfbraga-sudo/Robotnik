import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ---------- Raw shapes from TheSportsDB (only fields we use) ---------- */

type RawTeam = {
  idTeam: string;
  strTeam: string;
  strTeamAlternate?: string | null;
  strCountry?: string | null;
  strLeague?: string | null;
  strBadge?: string | null;
  strStadium?: string | null;
  strStadiumLocation?: string | null;
  intStadiumCapacity?: string | null;
  intFormedYear?: string | null;
  strDescriptionEN?: string | null;
  strSport?: string | null;
};

type RawEvent = {
  idEvent: string;
  strEvent: string;
  strLeague: string | null;
  strLeagueBadge?: string | null;
  strSeason?: string | null;
  strRound?: string | null;
  dateEvent: string | null;
  strTime: string | null;
  strTimestamp?: string | null;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeamBadge?: string | null;
  strAwayTeamBadge?: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus?: string | null;
  strPostponed?: string | null;
  strVenue?: string | null;
  strCity?: string | null;
  strThumb?: string | null;
  strSport?: string | null;
};

type RawEventStat = {
  idStatistic: string;
  strStat: string;
  intHome: string | null;
  intAway: string | null;
};

/* ---------- Public shapes (what the UI consumes) ---------- */

export type Team = {
  id: string;
  name: string;
  country: string | null;
  league: string | null;
  badge: string | null;
  stadium: string | null;
  city: string | null;
  founded: number | null;
  description: string | null;
};

export type Fixture = {
  id: string;
  date: string | null; // ISO
  league: string | null;
  leagueBadge: string | null;
  round: string | null;
  season: string | null;
  status: string | null;
  home: { id: string; name: string; badge: string | null; score: number | null };
  away: { id: string; name: string; badge: string | null; score: number | null };
  venue: string | null;
  city: string | null;
  thumb: string | null;
};

export type MatchStat = { label: string; home: number | null; away: number | null };

/* ---------- Helpers ---------- */

function toIsoDate(dateEvent: string | null, strTime: string | null, strTimestamp?: string | null): string | null {
  if (strTimestamp) {
    // strTimestamp comes as "YYYY-MM-DD HH:MM:SS" in UTC
    const iso = strTimestamp.replace(" ", "T") + "Z";
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  if (dateEvent) {
    const time = strTime && strTime !== "00:00:00" ? strTime : "00:00:00";
    const d = new Date(`${dateEvent}T${time}Z`);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

function mapTeam(t: RawTeam): Team {
  return {
    id: t.idTeam,
    name: t.strTeam,
    country: t.strCountry ?? null,
    league: t.strLeague ?? null,
    badge: t.strBadge ?? null,
    stadium: t.strStadium ?? null,
    city: t.strStadiumLocation ?? null,
    founded: t.intFormedYear ? Number(t.intFormedYear) : null,
    description: t.strDescriptionEN ?? null,
  };
}

function mapFixture(e: RawEvent): Fixture {
  return {
    id: e.idEvent,
    date: toIsoDate(e.dateEvent, e.strTime, e.strTimestamp),
    league: e.strLeague ?? null,
    leagueBadge: e.strLeagueBadge ?? null,
    round: e.strRound ?? null,
    season: e.strSeason ?? null,
    status: e.strStatus ?? null,
    home: {
      id: e.idHomeTeam,
      name: e.strHomeTeam,
      badge: e.strHomeTeamBadge ?? null,
      score: e.intHomeScore != null ? Number(e.intHomeScore) : null,
    },
    away: {
      id: e.idAwayTeam,
      name: e.strAwayTeam,
      badge: e.strAwayTeamBadge ?? null,
      score: e.intAwayScore != null ? Number(e.intAwayScore) : null,
    },
    venue: e.strVenue ?? null,
    city: e.strCity ?? null,
    thumb: e.strThumb ?? null,
  };
}

/* ---------- Server functions ---------- */

export const searchTeams = createServerFn({ method: "GET" })
  .inputValidator((d: { q: string }) => z.object({ q: z.string().min(2).max(60) }).parse(d))
  .handler(async ({ data }) => {
    const { sportsdb } = await import("./sportsdb.server");
    const res = await sportsdb<{ teams: RawTeam[] | null } | null>("/searchteams.php", { t: data.q });
    const teams = (res?.teams ?? []).filter((t) => (t.strSport ?? "Soccer") === "Soccer");
    return teams.map(mapTeam);
  });

export const getTeam = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { sportsdb } = await import("./sportsdb.server");
    const res = await sportsdb<{ teams: RawTeam[] | null } | null>("/lookupteam.php", { id: data.id });
    const t = res?.teams?.[0];
    if (!t) throw new Error("Time não encontrado");
    return mapTeam(t);
  });

export const getLastFixtures = createServerFn({ method: "GET" })
  .inputValidator((d: { teamId: string }) => z.object({ teamId: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { sportsdb } = await import("./sportsdb.server");
    // Free key returns the last 5 played matches for the team.
    const res = await sportsdb<{ results: RawEvent[] | null } | null>("/eventslast.php", { id: data.teamId });
    const events = res?.results ?? [];
    return events
      .map(mapFixture)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  });

export const getFixture = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { sportsdb } = await import("./sportsdb.server");
    const [detail, stats] = await Promise.all([
      sportsdb<{ events: RawEvent[] | null } | null>("/lookupevent.php", { id: data.id }),
      sportsdb<{ eventstats: RawEventStat[] | null } | null>("/lookupeventstats.php", { id: data.id }),
    ]);
    const ev = detail?.events?.[0];
    if (!ev) throw new Error("Partida não encontrada");
    const fixture = mapFixture(ev);
    const statistics: MatchStat[] = (stats?.eventstats ?? []).map((s) => ({
      label: s.strStat,
      home: s.intHome != null ? Number(s.intHome) : null,
      away: s.intAway != null ? Number(s.intAway) : null,
    }));
    return { fixture, statistics };
  });

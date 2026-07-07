const BASE = "https://v3.football.api-sports.io";

export type ApiFootballResponse<T> = {
  errors?: unknown;
  results?: number;
  response: T;
};

export async function apiFootball<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY não configurada");

  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": key },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API-Football ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as ApiFootballResponse<T> & { results?: number; paging?: unknown };
  console.log("[api-football]", path, JSON.stringify(params), "results=", json.results, "errors=", JSON.stringify(json.errors));
  if (json.errors && !Array.isArray(json.errors) && Object.keys(json.errors as object).length > 0) {
    throw new Error(`API-Football: ${JSON.stringify(json.errors)}`);
  }
  return json.response;
}

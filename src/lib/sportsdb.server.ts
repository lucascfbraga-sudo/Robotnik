const BASE = "https://www.thesportsdb.com/api/v1/json";

export async function sportsdb<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const key = process.env.SPORTSDB_KEY || "123";
  const url = new URL(`${BASE}/${key}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TheSportsDB ${res.status}: ${body.slice(0, 200)}`);
  }
  // API returns 200 with an empty body for empty results — normalize to null.
  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

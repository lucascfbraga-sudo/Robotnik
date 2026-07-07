import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2 } from "lucide-react";
import { searchTeams } from "@/lib/sportsdb.functions";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const search = useServerFn(searchTeams);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["search-teams", debounced],
    queryFn: () => search({ data: { q: debounced } }),
    enabled: debounced.length >= 2,
    staleTime: 60_000,
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar time..."
          className="w-full rounded-xl border border-border bg-secondary/60 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && debounced.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover shadow-2xl shadow-black/40">
          {data && data.length > 0 ? (
            data.slice(0, 12).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setOpen(false);
                  setQ("");
                  navigate({ to: "/team/$teamId", params: { teamId: t.id } });
                }}
                className="flex w-full items-center gap-3 border-b border-border/50 px-3 py-2.5 text-left hover:bg-accent transition last:border-b-0"
              >
                {t.badge ? (
                  <img src={t.badge} alt="" className="h-8 w-8 shrink-0 object-contain" />
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded bg-secondary" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {[t.country, t.league].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
              </button>
            ))
          ) : !isFetching ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Nenhum time encontrado</div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">Buscando...</div>
          )}
        </div>
      )}
    </div>
  );
}

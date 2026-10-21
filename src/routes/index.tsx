import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { formatBRL } from "@/lib/format";
import {
  Bot,
  Zap,
  ShieldCheck,
  Key,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
} from "lucide-react";
import heroImg from "@/assets/robotnik-hero.webp";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "ROBOTNIK — Bot de automação para Poke Alliance" },
      { name: "description", content: "Assine o ROBOTNIK, o bot oficial de automação para Poke Alliance. Planos de acesso, chaves de ativação automáticas e painel completo da sua assinatura." },
    ],
  }),
});

interface PlanRow {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  price: number;
  display_order: number;
}

function HomePage() {
  const { session } = useAuth();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["public-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("id,name,description,duration_days,price,display_order")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PlanRow[];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              Feito para Poke Alliance
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Automatize sua conta no <span className="text-gradient-electric">Poke Alliance</span> com o ROBOTNIK.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              Assine um plano, receba sua chave de ativação na hora e acompanhe tudo em um painel feito para o jogador: validade da assinatura, histórico de pagamentos e download do bot.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#planos"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground glow-primary transition hover:bg-primary/90"
              >
                <Zap className="h-4 w-4" /> Ver planos
              </a>
              <Link
                to={session ? "/app" : "/auth"}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-6 py-3 text-sm font-bold text-foreground transition hover:bg-secondary"
              >
                <Download className="h-4 w-4" /> {session ? "Ir para o painel" : "Já tenho conta"}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Chave entregue automaticamente</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Painel de validade em tempo real</span>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
              <img src={heroImg} alt="Ilustração do bot ROBOTNIK, um robô futurista azul elétrico com circuitos brilhantes" className="h-full w-full object-cover" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Bot, title: "Bot dedicado", desc: "Automação feita especificamente para as mecânicas do Poke Alliance." },
            { icon: Key, title: "Chave automática", desc: "Após o pagamento ser aprovado, sua chave de ativação é liberada na hora." },
            { icon: Clock, title: "Validade clara", desc: "Veja no painel quantos dias restam e renove antes de expirar." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan">Planos de acesso</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Escolha o período do seu acesso</h2>
          <p className="mt-3 text-sm text-muted-foreground">Todos os planos dão direito ao bot completo. A diferença é apenas a duração da chave.</p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            Nenhum plano publicado ainda. Volte em breve.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {plans.map((p, i) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${i === 1 ? "border-primary bg-card shadow-xl shadow-primary/10" : "border-border bg-card/60"}`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                    Mais popular
                  </span>
                )}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.duration_days} dias de acesso</p>
                <div className="mt-5 text-3xl font-extrabold">{formatBRL(p.price)}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.description ?? "Acesso completo ao bot ROBOTNIK."}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Chave de {p.duration_days} dias</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Suporte via Discord</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Atualizações incluídas</li>
                </ul>
                <Link
                  to={session ? "/app" : "/auth"}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition ${i === 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-secondary/60 text-foreground hover:bg-secondary"}`}
                >
                  <ShieldCheck className="h-4 w-4" /> Assinar {p.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" /> ROBOTNIK — bot para Poke Alliance
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/suporte" className="hover:text-foreground">Suporte</Link>
            <Link to="/termos" className="hover:text-foreground">Termos</Link>
            <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

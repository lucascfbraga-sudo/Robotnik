import { Outlet, createRootRouteWithContext, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/useAuth";
import { Bot } from "lucide-react";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ROBOTNIK — Bot de automação para Poke Alliance" },
      { name: "description", content: "Assine o ROBOTNIK, o bot oficial de automação para Poke Alliance. Planos de acesso, chaves de ativação automáticas e painel completo da sua assinatura." },
      { property: "og:title", content: "ROBOTNIK — Bot de automação para Poke Alliance" },
      { property: "og:description", content: "Assine o ROBOTNIK, receba sua chave automaticamente e acompanhe sua assinatura em um painel completo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
}

function Header() {
  const { session } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Bot className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">ROBOTNIK</span>
        </Link>
        <Link
          to={session ? "/app" : "/auth"}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-bold text-foreground transition hover:bg-secondary"
        >
          {session ? "Ir para o painel" : "Entrar"}
        </Link>
      </div>
    </header>
  );
}

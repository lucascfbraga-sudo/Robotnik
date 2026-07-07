import { Outlet, createRootRouteWithContext, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SearchBar } from "@/components/SearchBar";
import { Trophy } from "lucide-react";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StatBall — Estatísticas completas de futebol" },
      { name: "description", content: "Selecione um time e veja os últimos 20 jogos com todas as estatísticas: chutes, escanteios, cartões, faltas, laterais e mais." },
      { property: "og:title", content: "StatBall — Estatísticas completas de futebol" },
      { property: "og:description", content: "Selecione um time e veja os últimos 20 jogos com todas as estatísticas: chutes, escanteios, cartões, faltas, laterais e mais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "StatBall — Estatísticas completas de futebol" },
      { name: "twitter:description", content: "Selecione um time e veja os últimos 20 jogos com todas as estatísticas: chutes, escanteios, cartões, faltas, laterais e mais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7d41dd88-0296-4135-8e76-694bb29901ac/id-preview-9499ae2f--c241d02e-5cf8-439a-b86f-01ccce152cee.lovable.app-1783385091718.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7d41dd88-0296-4135-8e76-694bb29901ac/id-preview-9499ae2f--c241d02e-5cf8-439a-b86f-01ccce152cee.lovable.app-1783385091718.png" },
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
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Trophy className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">StatBall</span>
        </Link>
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

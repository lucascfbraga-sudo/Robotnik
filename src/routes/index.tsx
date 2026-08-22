import { createFileRoute } from "@tanstack/react-router";
import { GameCanvas } from "@/components/game/GameCanvas";
import { CaptureSidebar } from "@/components/game/CaptureSidebar";
import { Zap, Coins, Users, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "PokeIdle — Protótipo" },
      { name: "description", content: "Um protótipo de jogo idle 2D construído com React e Konva." },
    ],
  }),
});

function HomePage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0d1117] text-white font-sans">
      {/* HUD Superior */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-[#1a202c] bg-[#0d1117]/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Energia</div>
              <div className="text-sm font-bold">4.2k / 5.0k</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Moedas</div>
              <div className="text-sm font-bold">1.2M</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2">
            <div className="h-7 w-7 rounded-full border-2 border-[#0d1117] bg-gray-800" />
            <div className="h-7 w-7 rounded-full border-2 border-[#0d1117] bg-gray-700" />
            <div className="h-7 w-7 rounded-full border-2 border-[#0d1117] bg-blue-600 flex items-center justify-center text-[10px] font-bold">+12</div>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a202c] bg-[#161b22] hover:bg-[#1c2128] transition-colors">
            <Users className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a202c] bg-[#161b22] hover:bg-[#1c2128] transition-colors">
            <Shield className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Game Viewport */}
      <main className="relative h-full w-full">
        <GameCanvas />
      </main>

      {/* Interface Lateral Direita */}
      <aside className="absolute top-20 right-6 z-20">
        <CaptureSidebar />
      </aside>

      {/* Barra de Ações Inferior */}
      <footer className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-[#1a202c] bg-[#0d1117]/90 p-2 backdrop-blur-xl shadow-2xl">
        {['Mapa', 'Equipe', 'Inventário', 'Quests', 'Loja'].map((tab) => (
          <button
            key={tab}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-[#161b22]"
          >
            {tab}
          </button>
        ))}
      </footer>
    </div>
  );
}

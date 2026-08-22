import { Trophy, Play, Info } from "lucide-react";

interface Creature {
  id: string;
  name: string;
  level: number;
  spriteUrl: string;
}

const MOCK_CREATURES: Creature[] = [
  { id: '1', name: 'Brave Charizard', level: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
  { id: '2', name: 'Brave Charizard', level: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
  { id: '3', name: 'Brave Charizard', level: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
  { id: '4', name: 'Brave Charizard', level: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
];

export function CaptureSidebar() {
  return (
    <div className="flex w-80 flex-col rounded-xl border border-[#1a202c] bg-[#0d1117] p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500/20 text-pink-500">
            <Trophy className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Captura</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#161b22] px-2 py-0.5 text-[10px] font-medium text-[#ffd700]">
            4 selvagens
          </span>
          <button className="text-[10px] font-medium text-blue-400 underline decoration-blue-400/30 underline-offset-4 hover:text-blue-300">
            Loja
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 border-b border-[#1a202c] pb-4">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-red-500/80" />
          <span className="text-xs font-semibold text-white">296</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-blue-500/80" />
          <span className="text-xs font-semibold text-white">99</span>
        </div>
      </div>

      <div className="space-y-2">
        {MOCK_CREATURES.map((creature) => (
          <div
            key={creature.id}
            className="flex items-center justify-between rounded-lg border border-[#1a202c] bg-[#161b22] p-2 transition-colors hover:bg-[#1c2128]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-md bg-[#0d1117]">
                <img
                  src={creature.spriteUrl}
                  alt={creature.name}
                  className="h-full w-full object-contain pixelated"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">{creature.name}</div>
                <div className="text-[9px] text-gray-400">Lv {creature.level}</div>
              </div>
            </div>
            <button className="rounded border border-[#2d3748] bg-[#1a202c] px-3 py-1 text-[10px] font-bold text-white transition-colors hover:bg-[#2d3748]">
              Lançar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

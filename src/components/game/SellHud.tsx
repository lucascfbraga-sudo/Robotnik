import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';

interface Item {
  id: string;
  name: string;
  price: number;
  icon: string;
}

const INITIAL_ITEMS: Item[] = [
  { id: '1', name: 'Poção', price: 100, icon: '🧪' },
  { id: '2', name: 'Pokebola', price: 200, icon: '🔴' },
  { id: '3', name: 'Pedra de Fogo', price: 500, icon: '🔥' },
  { id: '4', name: 'Doce Raro', price: 1000, icon: '🍬' },
];

export function SellHud() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  const handleSell = (item: Item) => {
    // Simular venda
    setItems(prev => prev.filter(i => i.id !== item.id));
    toast.success(`Vendeu ${item.name} por ${item.price} moedas!`);
    
    // Se acabar os itens, repõe para o exemplo
    if (items.length <= 1) {
      setTimeout(() => setItems(INITIAL_ITEMS), 2000);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a202c] bg-[#161b22] shadow-lg hover:bg-[#1c2128] transition-all hover:scale-105"
        title="Abrir Loja/Venda"
      >
        <ShoppingBag className="h-6 w-6 text-yellow-500" />
      </button>
    );
  }

  return (
    <div className="w-64 rounded-2xl border border-[#1a202c] bg-[#0d1117]/95 p-4 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="mb-4 flex items-center justify-between border-b border-[#1a202c] pb-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-yellow-500" />
          <h3 className="text-xs font-black uppercase tracking-wider">Vender Itens (NPC)</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="py-8 text-center text-[10px] text-gray-500 font-bold uppercase">
            Sem itens para vender
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSell(item)}
              className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-[#161b22]/50 p-2 hover:border-emerald-500/50 hover:bg-[#161b22] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.name}</div>
                  <div className="text-xs font-black text-emerald-500">{item.price} $</div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 text-black text-[9px] font-black px-2 py-1 rounded-md uppercase">
                Vender
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-[#1a202c]">
        <p className="text-[9px] text-gray-500 font-bold uppercase leading-tight italic">
          Clique no item para vender instantaneamente ao NPC.
        </p>
      </div>
    </div>
  );
}

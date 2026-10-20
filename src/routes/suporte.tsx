import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/suporte")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Suporte — ROBOTNIK" },
      { name: "description", content: "Entre em contato com o suporte do ROBOTNIK para dúvidas sobre pagamentos, chaves e assinatura." },
    ],
  }),
});

interface FaqRow {
  id: string;
  question: string;
  answer: string;
}

function SupportPage() {
  const { data: settings } = useQuery({
    queryKey: ["support-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key,value").in("key", ["support_email", "support_discord"]);
      const map: Record<string, string> = {};
      (data ?? []).forEach((row) => {
        map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
      });
      return map;
    },
  });

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["support-faq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("id,question,answer")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as FaqRow[];
    },
  });

  const email = settings?.support_email?.replace(/"/g, "") || "suporte@robotnik.gg";
  const discord = settings?.support_discord?.replace(/"/g, "") || "discord.gg/robotnik";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-3">
        <LifeBuoy className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-extrabold">Central de suporte</h1>
      </div>
      <p className="mt-3 text-muted-foreground">
        Precisa de ajuda com pagamento, chave de ativação ou sua assinatura? Fale com a gente.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">E-mail</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </a>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-5">
          <MessageCircle className="h-5 w-5" style={{ color: "var(--cyan)" }} />
          <div>
            <div className="text-sm font-semibold">Discord</div>
            <div className="text-sm text-muted-foreground">{discord}</div>
          </div>
        </div>
      </div>

      <h2 className="mt-14 text-xl font-bold">Perguntas frequentes</h2>
      {isLoading ? (
        <div className="mt-6 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : !faqs || faqs.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Nenhuma pergunta cadastrada ainda.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="text-sm font-semibold">{f.question}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

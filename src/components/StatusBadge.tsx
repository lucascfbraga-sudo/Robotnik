import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_CLASSES: Record<Tone, string> = {
  success: "border-transparent bg-[color:var(--success)]/15 text-[color:var(--success)]",
  warning: "border-transparent bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  danger: "border-transparent bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
  info: "border-transparent bg-[color:var(--cyan)]/15 text-[color:var(--cyan)]",
  neutral: "border-transparent bg-secondary text-muted-foreground",
};

const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  ativo: { label: "Ativo", tone: "success" },
  proximo_vencimento: { label: "Próximo do vencimento", tone: "warning" },
  expirado: { label: "Expirado", tone: "danger" },
  sem_assinatura: { label: "Sem assinatura", tone: "neutral" },
  pendente: { label: "Pendente", tone: "warning" },
  aprovado: { label: "Aprovado", tone: "success" },
  recusado: { label: "Recusado", tone: "danger" },
  cancelado: { label: "Cancelado", tone: "neutral" },
  reembolsado: { label: "Reembolsado", tone: "info" },
  disponivel: { label: "Disponível", tone: "info" },
  reservada: { label: "Reservada", tone: "warning" },
  entregue: { label: "Entregue", tone: "success" },
  revogada: { label: "Revogada", tone: "danger" },
  aguardando_ativacao: { label: "Aguardando ativação", tone: "warning" },
  publicado: { label: "Publicado", tone: "success" },
  rascunho: { label: "Rascunho", tone: "neutral" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const info = STATUS_MAP[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Badge className={cn(TONE_CLASSES[info.tone], "font-semibold", className)}>
      {info.label}
    </Badge>
  );
}

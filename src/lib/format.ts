export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

const BRASILIA_TZ = "America/Sao_Paulo";

export function formatDateBR(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRASILIA_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTimeBR(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRASILIA_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function daysRemaining(endDate: string | Date | null | undefined): number {
  if (!endDate) return 0;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export type SubscriptionComputedStatus = "ativo" | "proximo_vencimento" | "expirado" | "sem_assinatura";

export function computeSubscriptionStatus(endDate: string | Date | null | undefined): SubscriptionComputedStatus {
  if (!endDate) return "sem_assinatura";
  const remaining = daysRemaining(endDate);
  if (remaining < 0) return "expirado";
  if (remaining <= 3) return "proximo_vencimento";
  return "ativo";
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  component: TermsPage,
  head: () => ({
    meta: [{ title: "Termos de uso — ROBOTNIK" }],
  }),
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold">Termos de uso</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>Ao criar uma conta e contratar um plano do ROBOTNIK, você concorda com os termos descritos abaixo.</p>
        <p><strong className="text-foreground">1. Natureza do serviço.</strong> O ROBOTNIK é uma plataforma de gerenciamento de assinaturas de acesso a um bot de automação para o jogo Poke Alliance. A contratação de um plano dá direito ao uso do bot pelo período de dias adquirido, mediante entrega de uma chave de ativação.</p>
        <p><strong className="text-foreground">2. Pagamentos.</strong> Os valores cobrados correspondem ao plano escolhido e são validados no momento da compra. A liberação da chave ocorre somente após a confirmação do pagamento pelo provedor.</p>
        <p><strong className="text-foreground">3. Chaves de ativação.</strong> As chaves são de uso pessoal e intransferível, vinculadas à conta do comprador. É proibido revender, compartilhar ou tentar gerar chaves por meios não autorizados.</p>
        <p><strong className="text-foreground">4. Cancelamentos e reembolsos.</strong> Solicitações de reembolso são avaliadas conforme a disponibilidade de uso da chave entregue e a legislação aplicável.</p>
        <p><strong className="text-foreground">5. Suspensão de conta.</strong> Contas que violem estes termos podem ter o acesso suspenso, sem prejuízo das obrigações já cumpridas.</p>
        <p><strong className="text-foreground">6. Alterações.</strong> Estes termos podem ser atualizados periodicamente, com aviso no painel do cliente.</p>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: "Política de privacidade — ROBOTNIK" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold">Política de privacidade</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>Esta política descreve como o ROBOTNIK coleta, usa e protege os dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
        <p><strong className="text-foreground">1. Dados coletados.</strong> Coletamos nome, e-mail e dados de pagamento necessários para processar sua assinatura. Não armazenamos dados completos de cartão de crédito — essas informações são tratadas diretamente pelo provedor de pagamento.</p>
        <p><strong className="text-foreground">2. Finalidade.</strong> Os dados são usados exclusivamente para autenticação, processamento de pagamentos, entrega de chaves de ativação e suporte ao cliente.</p>
        <p><strong className="text-foreground">3. Compartilhamento.</strong> Dados de pagamento podem ser compartilhados com o provedor de pagamentos (ex.: Mercado Pago) estritamente para processar a cobrança.</p>
        <p><strong className="text-foreground">4. Segurança.</strong> Utilizamos autenticação segura, políticas de acesso restritivas (RLS) e criptografia em trânsito para proteger seus dados.</p>
        <p><strong className="text-foreground">5. Seus direitos.</strong> Você pode solicitar a qualquer momento acesso, correção ou exclusão dos seus dados pessoais, entrando em contato pelo suporte.</p>
      </div>
    </div>
  );
}

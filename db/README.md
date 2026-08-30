# Leads comerciais do institucional

Este banco pertence ao app institucional TZOLKIN. Não é banco universal do Core nem armazena leads dos clientes de outros apps.

## Fluxo implementado

Formulário → POST /api/leads → validação no servidor → transação PostgreSQL com lead + email_outbox → confirmação ao frontend.

O backend fixa a origem como tzolkin.cloud. Campos extras como tenant, plano, preço e permissões são rejeitados. A rota é pública para captação, não uma API multiempresa autenticada.

O identificador de envio permite repetir uma requisição sem criar outro lead. Alterar o conteúdo com a mesma chave retorna conflito. Há limite de cinco envios por email por hora, compartilhado entre instâncias via banco. Isso NÃO substitui proteção global de abuso: antes de tráfego público, definir limitação na borda e/ou desafio antiautomação. A checagem de Origin não autentica bots.

## Email: pendente de ativação

email_outbox registra intenção de notificação interna na mesma transação do lead. O consumidor está em scripts/email-worker.mjs; pending NÃO significa email entregue. Nenhuma campanha ou confirmação ao visitante é enviada.

O consumidor usa Resend, chave idempotente estável, payload congelado na primeira tentativa, trava PostgreSQL, até cinco tentativas e backoff. Após 23 horas da primeira tentativa, exige revisão manual em vez de arriscar duplicidade além da janela de 24h do provedor (https://resend.com/docs/dashboard/emails/idempotency-keys). O status sent significa aceitação pelo provedor, não entrega na caixa de entrada.

Antes de ativar: configurar RESEND_API_KEY, EMAIL_FROM (remetente verificado) e EMAIL_INTERNAL_TO (destinatário interno). `npm run email:check` é somente leitura. `node scripts/email-worker.mjs --send` envia no máximo uma notificação elegível e é uma ação externa explícita. Ainda não foi executado nem agendado. Confirmar a configuração e testar com destinatário interno autorizado antes de ativação. Nenhum segredo no frontend ou payload nos logs.

## Verificação

- `node --test scripts/leads.test.mjs`: validações sem banco.
- `npm test`: 18 testes locais de leads e adaptador de email, sem chamadas ao provedor.
- `npm run test:integration`: banco real, API local e provedor de email simulado; remove apenas registros sintéticos dos testes.
- `npm run typecheck` e `npm run build`: verificações do projeto.
- `node scripts/leads-integration.mjs`: usa Next local na porta 3000 e banco da env local; cria registros sintéticos em example.invalid e remove somente os registros dessa execução. Não envia emails.
- `node scripts/migrate-leads.mjs`: aplica db/002_lead_delivery.sql no banco configurado localmente.

DATABASE_URL é segredo server-side e já está cadastrada em Production na Vercel. Não cadastrar a base de produção em previews de terceiros. Nenhum deploy faz parte desta implementação.

# Checklist — finalizar o site (funil de produtos digitais)

> Salvo em 2026-10-19 a partir da visão de Product Owner. Fica para execução depois.
> Base: briefing `2026-10-produtos-digitais` (feito na máquina local; não está neste repositório).
> Hipóteses de preço e metas abaixo precisam ser validadas com verba real.

## Objetivo
Validar o funil **anúncio → página → formulário → WhatsApp → proposta** e medir **contrato pago por real investido**.

## P0 — bloqueia anúncios
- [ ] Commitar o trabalho local (formulário curto, remoção do chat, bot em Go, briefing) numa branch, **sem o `.env`**.
- [ ] Formulário curto entrega o lead no Core com origem e UTM corretas.
- [ ] Após o envio confirmado, o botão abre o WhatsApp (+55 31 99759-9216) com o resumo do projeto.
- [ ] Preservar UTM, `gclid` e `fbclid` até o lead.
- [ ] Eventos de conversão ativos no Meta e no Google (lead enviado, WhatsApp iniciado).
- [ ] Definir quem atende o WhatsApp, horário e prazo de resposta (hipótese: até 15 min em horário comercial).
- [ ] Teste de interface do formulário rodado (`scripts/form-whatsapp.test.cjs`).
- [ ] Confirmar entrega e leitura da mensagem de teste no aparelho.

## P1 — conversão
- [ ] Home v2 (arquivo 12 do briefing) com as quatro suítes e a faixa de preço visível.
- [ ] Remover a seção "Formas de contratar" com consultoria/assessoria e terceirização em destaque.
- [ ] Uma página de campanha para uma aplicação (recomendada: CRM com IA integrado, suíte Integrada R$ 14.900): demonstração real, escopo, custo total, o que fica fora.
- [ ] Remover ou comprovar números e promessas sem prova (performance, resultados, prazos).
- [ ] Provas: projeto, participação da TZOLKIN e estágio da entrega.

## P2 — bot e conformidade
- [ ] Fluxo de qualificação com resumo corrigível e pausa para atendimento humano.
- [ ] Teste de receber resposta pelo webhook (envio permanece `BOT_SEND_ENABLED=false` até validar).
- [ ] Aviso de uso de dados e opção de sair (LGPD).
- [ ] Decidir se o número é dedicado ao bot; antes de escalar, avaliar a API oficial da Meta (risco de bloqueio com a Evolution).

## Critérios para liberar anúncios
- [ ] Lead de teste aparece no Core com UTM.
- [ ] Mensagem chega à equipe com o resumo.
- [ ] Eventos aparecem nas plataformas.
- [ ] Página mostra preço total e limites do escopo.
- [ ] Alguém escalado para responder.

## Decisões pendentes
1. Qual aplicação vai primeiro?
2. Quem atende o WhatsApp e em que horário?
3. O número é dedicado ao bot ou é o principal?
4. Qual a verba mensal inicial para Meta e Google?
5. A sustentação mensal entra na primeira oferta?

## Depois (só com dados)
IA generativa no bot, páginas de voz/e-commerce/marketplace/fiscal, calculadora de preço no site, sustentação como produto separado.

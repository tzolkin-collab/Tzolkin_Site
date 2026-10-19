# Rastreamento (Meta Ads e Google Ads)

Código: `src/client/shared/utils/analytics.ts` (disparo), `tracking-core.ts` (lógica pura, testada em `scripts/tracking.test.mjs`), `src/client/shared/ui/analytics/TrackingProvider.tsx` (scripts), `attribution.ts` (UTM/click IDs).

## Variáveis de ambiente

| Variável | Para quê | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Container do Google Tag Manager (`GTM-XXXXXXX`) | Para Google Ads/GA4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel carregado direto pelo site (só dígitos). Sem ela, nada da Meta é carregado | Só se o Pixel for direto |
| `NEXT_PUBLIC_UTMIFY_URL` | Script do UTMify (tem padrão) | Não |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | `true` loga eventos no console em produção | Não |

IDs reais (GTM, Pixel, conta/conversão do Google Ads) são do dono; nada disso está no repositório.

## Eventos (contrato com o GTM, não renomear)

| Evento (dataLayer `event`) | Quando | Meta Pixel | Payload |
|---|---|---|---|
| `page_view` | automático (Pixel / GTM) | `PageView` (init + troca de rota) | n/a |
| `form_started` | usuário começa o formulário | `trackCustom FormStarted` | `eventName` |
| `lead` | lead salvo | `track Lead` com `eventID` | `event_id`, `service`/`suite` quando houver |
| `whatsapp_click` | clique no WhatsApp | `track Contact` | `service`/`suite` quando houver |
| `initiate_checkout` | reservado, ninguém dispara hoje | `track InitiateCheckout` | n/a |

Ao Pixel só vão `service`, `suite` e `content_name`. Nunca e-mail, telefone ou nome.

Observação: hoje os formulários passam só `eventName` no payload do `lead` (ex.: `lead_form_saved`), sem `service`/`suite`. Para as conversões carregarem o serviço, os componentes de formulário (ServiceStep, fora do escopo deste trabalho) precisam passar `{ service, suite }` ao chamar `trackEvent`. O `lead` hoje também dispara em `lead_form_saved`; confirmar com o time de formulários se isso é o momento da conversão real (lead enviado ao servidor) para não contar conversão de etapa intermediária.

## Meta Pixel: escolha para evitar duplicação

**Use um só caminho, nunca os dois.**

- Recomendado: Pixel direto (`NEXT_PUBLIC_META_PIXEL_ID`). Já dispara `PageView`, `Lead`, `Contact`, `FormStarted` com `eventID`. No GTM, NÃO crie tag do Pixel nem importe o template da Meta.
- Alternativa: Pixel via GTM. Deixe `NEXT_PUBLIC_META_PIXEL_ID` vazia e crie as tags no GTM com gatilhos nos eventos acima; passe `{{DLV - event_id}}` como Event ID. Aí o site não chama `fbq`.
- Sinal de duplicidade: Pixel Helper mostra dois pixels iguais ou o Events Manager mostra `Lead` em dobro com Event ID diferente.

## Google Ads e GA4 via GTM

O site apenas empurra no `dataLayer`; as tags ficam no GTM.

1. Variáveis (Data Layer Variable): `event_id`, `service`, `suite`.
2. Gatilhos (Evento personalizado): `lead`, `whatsapp_click`, `form_started` (nome exato, sem regex).
3. Google Ads: tag "Acompanhamento de conversões do Google Ads" com ID e rótulo da conversão (do dono), gatilho `lead`; outra para `whatsapp_click` se for conversão. Use `event_id` como ID da transação para o Google deduplicar.
4. Tag "Vinculador de conversões" em todas as páginas.
5. GA4: tag de configuração (Measurement ID do dono) em All Pages; tags de evento `generate_lead` (gatilho `lead`), `whatsapp_click`, `form_started`, com parâmetros `service` e `suite`. Marque `generate_lead` como evento-chave no GA4.
6. Publique o container após testar em Preview.

## Deduplicação (event_id)

Cada `lead` gera `event_id` (`crypto.randomUUID`, com fallback). Vai no dataLayer, no `eventID` do `fbq` e no UTMify. `trackEvent` devolve o id; para a CAPI futura, o formulário deve enviá-lo ao servidor junto com o lead (campo novo, validar em `validation.mjs`).

## Desenho da Conversions API (NÃO implementado)

- Endpoint: `POST https://graph.facebook.com/vXX.X/{PIXEL_ID}/events?access_token=...` chamado pelo servidor após gravar o lead (token em env privada, nunca `NEXT_PUBLIC`).
- Evento: `event_name: "Lead"`, `event_time` (unix), `event_id` igual ao do navegador, `action_source: "website"`, `event_source_url`, `user_data`, `custom_data` (`service`, `suite`).
- `user_data`: `em` (e-mail minúsculo, trim, SHA-256), `ph` (telefone só dígitos com DDI 55, SHA-256), `fbc` (derivado de `fbclid` guardado: `fb.1.<timestamp>.<fbclid>`), `fbp` (cookie `_fbp`), `client_ip_address`, `client_user_agent` (estes dois sem hash).
- Meta deduplica por `event_name` + `event_id` entre navegador e servidor.
- Google: equivalente é Enhanced Conversions / upload offline com `gclid` (ou `wbraid`/`gbraid`) + e-mail/telefone com hash.
- Consentimento: só enviar se o usuário consentiu marketing; guardar o estado de consentimento junto do lead.

## Atribuição

`captureAttribution` guarda na sessionStorage: UTMs, `utm_tzolkin`, `meta_*_id`, `fbclid`, `gclid` e, agora, `wbraid`/`gbraid` (iOS 14+ para Google). O formulário envia o bloco `attribution` ao servidor, que sanitiza (`validation.mjs`). Chaves desconhecidas são descartadas em silêncio, então `wbraid`/`gbraid` já são seguros no cliente mas só chegam ao lead depois do patch abaixo (Dev A).

Patch proposto em `src/server/leads/validation.mjs`:

```diff
-  meta_campaign_id: 25, meta_adset_id: 25, meta_ad_id: 25, fbclid: 500, gclid: 500, landing_page: 500, referrer: 1000,
+  meta_campaign_id: 25, meta_adset_id: 25, meta_ad_id: 25, fbclid: 500, gclid: 500, wbraid: 500, gbraid: 500, landing_page: 500, referrer: 1000,
...
-  fbclid: /^[A-Za-z0-9_-]{5,500}$/, gclid: /^[A-Za-z0-9_-]{5,500}$/,
+  fbclid: /^[A-Za-z0-9_-]{5,500}$/, gclid: /^[A-Za-z0-9_-]{5,500}$/,
+  wbraid: /^[A-Za-z0-9_-]{5,500}$/, gbraid: /^[A-Za-z0-9_-]{5,500}$/,
```

Depois conferir se o Core aceita as chaves novas no bloco `attribution` (docs/ATTRIBUTION.md do Core). Se o Core rejeitar chave desconhecida, a entrega falha: confirmar antes de aplicar.

## Consentimento / LGPD

Não há banner de cookies no site. Risco: GTM, Pixel e UTMify carregam e coletam identificadores (cookies, IP) antes de qualquer consentimento, o que é problemático na LGPD (base legal e transparência), e as plataformas de anúncio podem exigir consentimento para remarketing.

Recomendação mínima (não implementada): banner com "Aceitar/Recusar" que só injeta GTM, Pixel e UTMify após aceite (ou Google Consent Mode v2 com `denied` por padrão e atualização no aceite), link para política de privacidade que cite as ferramentas, e registrar o consentimento junto do lead. Enquanto isso não existir, tratar o rastreamento como risco jurídico aceito pelo dono.

## Checklist de verificação

1. Defina as variáveis de ambiente e faça o deploy (ou `npm run dev` com `NEXT_PUBLIC_ANALYTICS_DEBUG=true`).
2. Console: `window.dataLayer` deve conter `gtm.js`; envie o formulário e veja `{event:'lead', event_id:'...'}`.
3. Tag Assistant (tagassistant.google.com): conecte ao site, confirme que o container carrega e que as tags de `lead`/`whatsapp_click` disparam uma única vez por ação.
4. Meta Pixel Helper (extensão): um único pixel, `PageView` na entrada e na troca de rota, `Lead` ao enviar, `Contact` no WhatsApp.
5. Events Manager > Test Events: abra com o código de teste, navegue no site e confira os eventos; o `Lead` deve aparecer com Event ID.
6. Ponta a ponta: acesse com `?utm_source=teste&utm_campaign=x&gclid=TESTE12345&fbclid=TESTE12345`, envie um lead, confira no Core/banco que o bloco `attribution` chegou com UTMs, gclid e fbclid, e que as conversões aparecem no Google Ads (coluna Conversões, pode levar horas) e no Events Manager.
7. Anúncios reais: teste com tráfego pago de baixo orçamento só depois dos passos acima.

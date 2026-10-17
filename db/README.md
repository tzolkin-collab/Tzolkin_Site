# Leads comerciais do institucional

> **Mudou em 2026-10-02 (ADR 0011 do `tzolkin-core`).** O lead **não é mais gravado num banco próprio do site**. O site manda o lead
> direto ao intake do Core (`POST /v1/commercial/intake`), que é onde todos os leads vivem.

## Fluxo atual

Formulário → `POST /api/leads` → validação no servidor → **intake do Core** (3 tentativas, idempotente pela chave do envio)
→ confirmação ao visitante.

- **Se o Core não confirmar**, o servidor manda um **e-mail interno** com o lead (rede de segurança) e só então diz "recebemos".
  Sem Core **e** sem e-mail configurado, responde 503 e o visitante mantém os dados no formulário.
- **Limites:** a regra de cinco envios por e-mail por hora passou para o Core (devolve 429).
- **O navegador não decide origem, plano, preço nem permissões.** Campo desconhecido é recusado. A origem do lead
  (`tzolkin-site`, canal, referência) é fixada pelo servidor.
- **Atribuição:** o formulário manda UTM, `utm_tzolkin` (`sites.<nicho>`), IDs de anúncio da Meta, `fbclid`, `gclid`,
  página de entrada e referência, capturados na chegada (`src/client/shared/utils/attribution.ts`). É melhor-esforço: um
  parâmetro inválido é descartado e **nunca derruba o lead**. Convenção dos nomes: `tzolkin-core/docs/ATTRIBUTION.md`.
- **Campos sem lugar no Core ainda** (porte, funcionários, Instagram, site) viajam no início da mensagem do lead.

## Variáveis de ambiente (servidor)

| Variável | Para quê |
|---|---|
| `CORE_INTAKE_URL` | Endereço do Core, HTTPS (ex.: o domínio do Core). `http` só em `localhost`/`127.0.0.1` |
| `CORE_INTAKE_KEY` | Chave de integração do espaço **sites**, escopo `commercial:intake`. Criada no Core (Sites → Chaves de integração); o segredo aparece **uma única vez** |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_INTERNAL_TO` | Rede de segurança por e-mail. `EMAIL_INTERNAL_TO` aceita vários endereços separados por vírgula |

Sem `CORE_INTAKE_URL`/`CORE_INTAKE_KEY`, nada é entregue ao Core. Nenhuma delas pode ir para o navegador.

## Verificação

- `npm test`: testes unitários sem banco e sem rede: validação, contrato dos serviços com os formulários (`pricingData`),
  atribuição, formato do envio ao Core, tentativas, e-mail de segurança e orquestração.
- O formato do envio foi conferido contra `validateIntake` do Core (5 casos). Esse teste cruza dois repositórios e por isso
  não faz parte do `npm test`.
- `npm run typecheck` e `npm run build`: verificações do projeto.

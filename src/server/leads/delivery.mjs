// Entrega do lead ao Core. Sem banco, sem fila, sem worker (ADR 0011 do tzolkin-core).
//
// Caminho: o formulário chama /api/leads; a rota valida e chama deliverLead; este módulo manda o lead
// ao intake do Core (`POST /v1/commercial/intake`) com a chave do espaço "sites". O Core é idempotente
// pela Idempotency-Key, então tentar de novo não duplica.
//
// REDE DE SEGURANÇA. Se o Core não confirmar depois das tentativas, manda um e-mail interno com o lead
// (Resend). Só vale se RESEND_API_KEY, EMAIL_FROM e EMAIL_INTERNAL_TO existirem; sem eles o envio falha
// com 503 e o visitante mantém os dados no formulário. Nunca se diz "recebemos" sem ter entregue por
// um dos dois caminhos.
//
// Nada daqui registra dado de contato em log.

export const PRODUCT_ID = 'sites';
const MAX_MESSAGE = 5000;

const EXTRAS = [['Porte', 'companySize'], ['Funcionários', 'employees'], ['Instagram', 'instagram'], ['Site', 'website']];

/**
 * O formulário coleta quatro campos que o Core ainda não tem onde guardar (porte, funcionários, Instagram,
 * site). Até existir um bloco de dados por espaço (docs do Core: `space_data`), eles viajam no início da
 * mensagem em vez de se perderem. A mensagem do visitante é cortada antes dos extras se passar do limite.
 */
export function composeMessage(data) {
  const extras = EXTRAS.filter(([, campo]) => data[campo]).map(([rotulo, campo]) => `${rotulo}: ${data[campo]}`);
  const bloco = extras.length ? `[Dados do formulário]\n${extras.join('\n')}` : '';
  const sobra = MAX_MESSAGE - (bloco ? bloco.length + 2 : 0);
  const mensagem = (data.message || '').slice(0, Math.max(0, sobra));
  return [bloco, mensagem].filter(Boolean).join('\n\n') || undefined;
}

/** Atribuição aceita pelo site: só espaço "sites" em utm_tzolkin (o prefixo é o espaço). */
function atribuicao(data) {
  const a = { ...(data.attribution || {}) };
  if (a.utm_tzolkin && !a.utm_tzolkin.startsWith(`${PRODUCT_ID}.`)) delete a.utm_tzolkin;
  return a;
}

export function buildIntakePayload(data, key, now = new Date()) {
  const lead = { name: data.fullName };
  if (data.email) lead.email = data.email;
  if (data.whatsapp) lead.whatsapp = data.whatsapp;
  const message = composeMessage(data);
  if (message) lead.message = message;
  return {
    lead,
    organization: data.companyName ? { name: data.companyName, organization_type: 'company' } : { organization_type: 'person' },
    commercial: {
      product_id: PRODUCT_ID,
      service_model: data.service === 'Educacional TZOLKIN' ? 'education' : 'on_demand',
      label: data.service,
    },
    // Os campos fixos vêm depois do spread: o navegador não decide origem nem referência do envio.
    attribution: { ...atribuicao(data), source_system: 'tzolkin-site', source_ref: key, channel: 'institutional-form', created_at: now.toISOString() },
    // O formulário não capta preferência de contato: registra isso como está, sem inventar consentimento.
    privacy: { contact_allowed: false, source: 'institutional-form-no-preference-recorded' },
  };
}

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Manda o lead ao Core. Tenta até `tentativas` vezes em erro de rede, timeout, 408 e 5xx, com espera
 * crescente. 429 (limite por e-mail), 409 (conteúdo diferente com a mesma chave) e 400/401/403 não se
 * repetem: tentar de novo não muda a resposta.
 */
export async function submitToCore(payload, key, { env = process.env, fetchImpl = fetch, sleep = esperar, tentativas = 3 } = {}) {
  const base = env.CORE_INTAKE_URL, token = env.CORE_INTAKE_KEY;
  if (!base || !token) return { ok: false, reason: 'not_configured' };
  let url;
  try { url = new URL('/v1/commercial/intake', base); } catch { return { ok: false, reason: 'invalid_url' }; }
  if (url.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(url.hostname)) return { ok: false, reason: 'insecure_url' };

  let ultimo = { ok: false, reason: 'unreachable' };
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      const resposta = await fetchImpl(url, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}`, 'idempotency-key': key },
        body: JSON.stringify(payload),
      });
      if (resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        if (typeof corpo?.lead_id === 'string') return { ok: true, leadId: corpo.lead_id };
        ultimo = { ok: false, reason: 'invalid_response' };
      } else if (resposta.status === 429) return { ok: false, reason: 'rate_limited', status: 429 };
      else if (resposta.status === 409) return { ok: false, reason: 'conflict', status: 409 };
      else if (resposta.status === 408 || resposta.status >= 500) ultimo = { ok: false, reason: `http_${resposta.status}`, status: resposta.status };
      else return { ok: false, reason: `http_${resposta.status}`, status: resposta.status };
    } catch {
      ultimo = { ok: false, reason: 'unreachable' };
    }
    if (tentativa < tentativas) await sleep(300 * 3 ** (tentativa - 1));
  }
  return ultimo;
}

/** E-mail interno em texto puro (nunca HTML: o conteúdo é do visitante). */
export function composeFallbackEmail(data, key) {
  const linhas = [
    'O Core não confirmou a entrega deste lead. Ele está só neste e-mail: cadastre manualmente ou reenvie.',
    '',
    `Nome: ${data.fullName}`,
    `E-mail: ${data.email || '—'}`,
    `WhatsApp: ${data.whatsapp || '—'}`,
    `Empresa: ${data.companyName || '—'}`,
    `Serviço: ${data.service}`,
    ...EXTRAS.filter(([, campo]) => data[campo]).map(([rotulo, campo]) => `${rotulo}: ${data[campo]}`),
    `Mensagem: ${data.message || '—'}`,
    '',
    `Origem: ${Object.entries(data.attribution || {}).map(([k, v]) => `${k}=${v}`).join(' ') || 'sem UTM'}`,
    `Identificador do envio: ${key}`,
  ];
  return { subject: `[Lead não entregue ao Core] ${data.service}`, text: linhas.join('\n') };
}

export async function sendFallbackEmail(data, key, { env = process.env, fetchImpl = fetch } = {}) {
  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from, EMAIL_INTERNAL_TO: para } = env;
  if (!apiKey || !from || !para) return { ok: false, reason: 'email_not_configured' };
  const { subject, text } = composeFallbackEmail(data, key);
  try {
    const resposta = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      // A mesma chave do envio: o Resend deduplica por 24 h, então um reenvio do visitante não duplica o aviso.
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', 'idempotency-key': key },
      body: JSON.stringify({ from, to: para.split(',').map(item => item.trim()).filter(Boolean), subject, text }),
    });
    return resposta.ok ? { ok: true } : { ok: false, reason: `email_http_${resposta.status}` };
  } catch {
    return { ok: false, reason: 'email_unreachable' };
  }
}

/**
 * Entrega o lead por um dos dois caminhos. `status` é o que a rota responde: 200 entregue (ao Core ou
 * por e-mail), 429 limite, 409 conflito, 503 não entregue por nenhum caminho.
 */
export async function deliverLead(data, key, opcoes = {}) {
  const payload = buildIntakePayload(data, key, opcoes.now ? opcoes.now() : new Date());
  const core = await submitToCore(payload, key, opcoes);
  if (core.ok) return { status: 200, via: 'core' };
  if (core.reason === 'rate_limited') return { status: 429, reason: core.reason };
  if (core.reason === 'conflict') return { status: 409, reason: core.reason };
  const email = await sendFallbackEmail(data, key, opcoes);
  if (email.ok) return { status: 200, via: 'email', reason: core.reason };
  return { status: 503, reason: `${core.reason}+${email.reason}` };
}

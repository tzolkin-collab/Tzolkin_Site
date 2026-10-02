import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateLead, sanitizeAttribution, services } from '../src/server/leads/validation.mjs';
import {
  buildIntakePayload, composeMessage, composeSpaceData, submitToCore, sendFallbackEmail, composeFallbackEmail, deliverLead,
} from '../src/server/leads/delivery.mjs';

const KEY = '2f6b1a0e-5c3d-4e8f-9a1b-7c2d3e4f5a6b';
const base = { fullName: 'Ana Teste', email: 'ana@example.invalid', whatsapp: '(11) 99999-9999', companyName: 'Empresa Teste', service: 'Sites Institucionais', message: 'Quero um site.' };
const ENV = { CORE_INTAKE_URL: 'https://core.example.invalid', CORE_INTAKE_KEY: 'chave-de-teste-do-intake-0123456789abcdef' };
const ENV_EMAIL = { RESEND_API_KEY: 're_teste', EMAIL_FROM: 'Tzolkin <leads@example.invalid>', EMAIL_INTERNAL_TO: 'a@example.invalid, b@example.invalid' };
const semEspera = async () => {};
const resposta = (status, corpo = {}) => ({ ok: status >= 200 && status < 300, status, json: async () => corpo });

// ---- contrato com os formulários ------------------------------------------------------------------------

test('todo serviço que o formulário oferece (pricingData) é aceito pelo servidor', () => {
  const fonte = readFileSync(new URL('../src/client/shared/data/pricingData.ts', import.meta.url), 'utf8');
  const titulos = [...fonte.matchAll(/^\s*title:\s*'([^']+)'/gm)].map(m => m[1]);
  assert.ok(titulos.length >= 9, `só ${titulos.length} títulos lidos de pricingData`);
  const recusados = titulos.filter(titulo => !services.has(titulo));
  // Antes, "Landing Pages de Alta Conversão", "E-commerce Headless Next.js" e "Tracking de Funil Server-Side"
  // tomavam 400: o carro-chefe do site não conseguia enviar lead.
  assert.deepEqual(recusados, []);
});

test('o servidor recusa serviço inventado e campo que o navegador não controla', () => {
  assert.throws(() => validateLead({ ...base, service: 'Consultoria Geral' }));
  for (const campo of ['source', 'tenant_id', 'price', 'plan', 'permissions']) assert.throws(() => validateLead({ ...base, [campo]: 'forjado' }));
});

test('basta um contato: e-mail ou WhatsApp; os dois vazios não passam', () => {
  assert.equal(validateLead({ ...base, whatsapp: '' }).email, 'ana@example.invalid');
  assert.equal(validateLead({ ...base, email: '' }).whatsapp, '11999999999');
  assert.throws(() => validateLead({ ...base, email: '', whatsapp: '' }));
  assert.throws(() => validateLead({ ...base, email: 'invalido' }));
  assert.throws(() => validateLead({ ...base, whatsapp: 'Não informado' }), /INVALID_CONTACT/);
});

// ---- atribuição: melhor-esforço, nunca derruba o lead -------------------------------------------------------

test('atribuição válida passa; lixo e chave desconhecida são descartados sem recusar o lead', () => {
  const lead = validateLead({ ...base, attribution: {
    utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'lancamentos', utm_tzolkin: 'Sites.Corretor',
    meta_campaign_id: '120210000000001', meta_ad_id: 'nao-e-numero', fbclid: 'x', gclid: 'AbC_123-xyz',
    landing_page: '/sites', tenant_id: 'forjado', __proto__x: 'y',
  } });
  assert.deepEqual(lead.attribution, {
    utm_source: 'meta', utm_medium: 'cpc', utm_campaign: 'lancamentos', utm_tzolkin: 'sites.corretor',
    meta_campaign_id: '120210000000001', gclid: 'AbC_123-xyz', landing_page: '/sites',
  });
  assert.equal(validateLead({ ...base, attribution: 'texto' }).attribution, undefined);
  assert.equal(validateLead({ ...base, attribution: [] }).attribution, undefined);
  assert.equal(sanitizeAttribution({ utm_source: 'a\u0000b' }), undefined);
});

// ---- payload do Core ----------------------------------------------------------------------------------------

test('o envio ao Core tem o formato do intake e marca origem e consentimento sem inventar', () => {
  const dados = validateLead({ ...base, attribution: { utm_source: 'meta', utm_tzolkin: 'sites.corretor', landing_page: '/sites' } });
  const p = buildIntakePayload(dados, KEY, new Date('2026-10-02T12:00:00Z'));
  assert.deepEqual(p.lead, { name: 'Ana Teste', email: 'ana@example.invalid', whatsapp: '11999999999', message: 'Quero um site.' });
  assert.equal(p.space_data, undefined, 'sem porte, funcionários, Instagram e site, não manda o bloco');
  assert.deepEqual(p.organization, { name: 'Empresa Teste', organization_type: 'company' });
  assert.deepEqual(p.commercial, { product_id: 'sites', service_model: 'on_demand', label: 'Sites Institucionais' });
  assert.deepEqual(p.privacy, { contact_allowed: false, source: 'institutional-form-no-preference-recorded' });
  assert.equal(p.attribution.source_system, 'tzolkin-site');
  assert.equal(p.attribution.source_ref, KEY);
  assert.equal(p.attribution.channel, 'institutional-form');
  assert.equal(p.attribution.created_at, '2026-10-02T12:00:00.000Z');
  assert.equal(p.attribution.utm_tzolkin, 'sites.corretor');
  // o navegador não escolhe a origem
  assert.equal(buildIntakePayload({ ...dados, attribution: { utm_source: 'x', ...{ source_system: 'forjado' } } }, KEY).attribution.source_system, 'tzolkin-site');
});

test('pessoa sem empresa vira "person"; Educacional vira "education"; utm_tzolkin de outro espaço é descartado', () => {
  const dados = validateLead({ ...base, companyName: '', service: 'Educacional TZOLKIN', attribution: { utm_tzolkin: 'skiller.x' } });
  const p = buildIntakePayload(dados, KEY);
  assert.deepEqual(p.organization, { organization_type: 'person' });
  assert.equal(p.commercial.service_model, 'education');
  assert.equal(p.attribution.utm_tzolkin, undefined);
});

test('porte, funcionários, Instagram e site vão em space_data com as chaves do espaço, e a mensagem fica só com o que o visitante escreveu', () => {
  const dados = validateLead({ ...base, companySize: 'Pequena', employees: '10', instagram: '@empresa', website: 'https://empresa.example' });
  assert.deepEqual(composeSpaceData(dados), { porte: 'Pequena', funcionarios: '10', instagram: '@empresa', site: 'https://empresa.example' });
  const p = buildIntakePayload(dados, KEY);
  assert.deepEqual(p.space_data, { porte: 'Pequena', funcionarios: '10', instagram: '@empresa', site: 'https://empresa.example' });
  assert.equal(p.lead.message, 'Quero um site.');
  // só o que foi preenchido
  assert.deepEqual(composeSpaceData(validateLead({ ...base, instagram: '@so' })), { instagram: '@so' });
  assert.equal(composeSpaceData(validateLead(base)), undefined);
  // o formato antigo continua existindo, para a volta de segurança
  const antigo = buildIntakePayload(dados, KEY, new Date(), { legacy: true });
  assert.equal(antigo.space_data, undefined);
  assert.match(antigo.lead.message, /^\[Dados do formulário\]\nPorte: Pequena/);
});

test('Core antigo que recusa space_data (400): o mesmo lead é reenviado uma vez no formato antigo, com a mesma chave', async () => {
  const dados = validateLead({ ...base, companySize: 'Pequena' });
  const corpos = [], chaves = [];
  const r = await deliverLead(dados, KEY, { env: ENV, sleep: semEspera, fetchImpl: async (url, init) => {
    corpos.push(JSON.parse(init.body)); chaves.push(init.headers['idempotency-key']);
    return corpos.length === 1 ? resposta(400, { message: 'Campos inválidos.' }) : resposta(200, { lead_id: 'l' });
  } });
  assert.deepEqual(r, { status: 200, via: 'core' });
  assert.equal(corpos.length, 2);
  assert.deepEqual(corpos[0].space_data, { porte: 'Pequena' });
  assert.equal(corpos[1].space_data, undefined);
  assert.match(corpos[1].lead.message, /Porte: Pequena/);
  assert.deepEqual(chaves, [KEY, KEY]);
  // sem space_data não há o que recuar: o 400 é definitivo e não repete
  let n = 0;
  const sem = await deliverLead(validateLead(base), KEY, { env: ENV, sleep: semEspera, fetchImpl: async () => { n++; return resposta(400); } });
  assert.equal(n, 1); assert.equal(sem.status, 503);
  // a volta é uma só: se o formato antigo também for recusado, para
  n = 0;
  const duas = await submitToCore({ a: 1 }, KEY, { env: ENV, sleep: semEspera, alternate: { b: 2 }, fetchImpl: async () => { n++; return resposta(400); } });
  assert.equal(n, 2); assert.equal(duas.reason, 'http_400');
});

test('mensagem do formato antigo: porte, funcionários, Instagram e site no início, dentro do limite do Core', () => {
  const dados = validateLead({ ...base, companySize: 'Pequena', employees: '10', instagram: '@empresa', website: 'https://empresa.example', message: 'x'.repeat(5000) });
  const mensagem = composeMessage(dados);
  assert.match(mensagem, /^\[Dados do formulário\]\nPorte: Pequena\nFuncionários: 10\nInstagram: @empresa\nSite: https:\/\/empresa\.example\n\nxxx/);
  assert.ok(mensagem.length <= 5000, `mensagem com ${mensagem.length} caracteres`);
  assert.equal(composeMessage(validateLead({ ...base, message: '' })), undefined);
});

// ---- entrega ao Core ----------------------------------------------------------------------------------------

test('entrega ao Core: chave, idempotência e corpo corretos', async () => {
  const chamadas = [];
  const r = await submitToCore({ lead: { name: 'A' } }, KEY, { env: ENV, sleep: semEspera, fetchImpl: async (url, init) => { chamadas.push({ url: String(url), init }); return resposta(200, { lead_id: 'abc' }); } });
  assert.deepEqual(r, { ok: true, leadId: 'abc' });
  assert.equal(chamadas[0].url, 'https://core.example.invalid/v1/commercial/intake');
  assert.equal(chamadas[0].init.headers.authorization, `Bearer ${ENV.CORE_INTAKE_KEY}`);
  assert.equal(chamadas[0].init.headers['idempotency-key'], KEY);
  assert.equal(chamadas[0].init.redirect, 'error');
});

test('tenta de novo em 503 e em falha de rede, e para quando confirma', async () => {
  const sequencia = [() => resposta(503), () => { throw new Error('rede'); }, () => resposta(200, { lead_id: 'ok' })];
  let n = 0;
  const esperas = [];
  const r = await submitToCore({}, KEY, { env: ENV, sleep: async ms => { esperas.push(ms); }, fetchImpl: async () => sequencia[n++]() });
  assert.equal(r.ok, true);
  assert.equal(n, 3);
  assert.deepEqual(esperas, [300, 900]);
});

test('desiste depois das tentativas e não repete o que repetir não resolve', async () => {
  let n = 0;
  const falha = await submitToCore({}, KEY, { env: ENV, sleep: semEspera, fetchImpl: async () => { n++; return resposta(502); } });
  assert.equal(falha.ok, false); assert.equal(n, 3);
  for (const [status, motivo] of [[429, 'rate_limited'], [409, 'conflict'], [400, 'http_400'], [401, 'http_401'], [403, 'http_403']]) {
    n = 0;
    const r = await submitToCore({}, KEY, { env: ENV, sleep: semEspera, fetchImpl: async () => { n++; return resposta(status); } });
    assert.equal(r.reason, motivo); assert.equal(n, 1, `${status} não deve repetir`);
  }
});

test('sem configuração ou com URL insegura, nem tenta a rede', async () => {
  const proibido = async () => assert.fail('não deve chamar a rede');
  assert.equal((await submitToCore({}, KEY, { env: {}, fetchImpl: proibido })).reason, 'not_configured');
  assert.equal((await submitToCore({}, KEY, { env: { ...ENV, CORE_INTAKE_URL: 'http://core.example.invalid' }, fetchImpl: proibido })).reason, 'insecure_url');
  assert.equal((await submitToCore({}, KEY, { env: { ...ENV, CORE_INTAKE_URL: 'não é url' }, fetchImpl: proibido })).reason, 'invalid_url');
  assert.equal((await submitToCore({}, KEY, { env: { ...ENV, CORE_INTAKE_URL: 'http://127.0.0.1:3102' }, sleep: semEspera, fetchImpl: async () => resposta(200, { lead_id: 'l' }) })).ok, true);
});

// ---- e-mail de segurança ------------------------------------------------------------------------------------

test('e-mail de segurança: texto puro, com os dados, para a lista interna e com a chave do envio', async () => {
  const dados = validateLead({ ...base, message: '<b>oi</b>', attribution: { utm_source: 'meta' } });
  const { subject, text } = composeFallbackEmail(dados, KEY);
  assert.match(subject, /Lead não entregue ao Core/);
  assert.match(text, /Nome: Ana Teste/); assert.match(text, /utm_source=meta/); assert.match(text, new RegExp(KEY));
  let enviado;
  const r = await sendFallbackEmail(dados, KEY, { env: ENV_EMAIL, fetchImpl: async (url, init) => { enviado = { url, init }; return resposta(200, { id: 'e1' }); } });
  assert.equal(r.ok, true);
  assert.equal(enviado.url, 'https://api.resend.com/emails');
  assert.equal(enviado.init.headers['idempotency-key'], KEY);
  const corpo = JSON.parse(enviado.init.body);
  assert.deepEqual(corpo.to, ['a@example.invalid', 'b@example.invalid']);
  assert.equal(corpo.html, undefined, 'conteúdo do visitante nunca vai como HTML');
  assert.equal((await sendFallbackEmail(dados, KEY, { env: {}, fetchImpl: async () => assert.fail('sem config') })).reason, 'email_not_configured');
});

// ---- orquestração -------------------------------------------------------------------------------------------

test('deliverLead: Core confirma, e-mail não é usado', async () => {
  const chamadas = [];
  const r = await deliverLead(validateLead(base), KEY, { env: { ...ENV, ...ENV_EMAIL }, sleep: semEspera, fetchImpl: async url => { chamadas.push(String(url)); return resposta(200, { lead_id: 'l' }); } });
  assert.deepEqual(r, { status: 200, via: 'core' });
  assert.deepEqual(chamadas, ['https://core.example.invalid/v1/commercial/intake']);
});

test('deliverLead: Core fora do ar, e-mail salva o lead', async () => {
  const r = await deliverLead(validateLead(base), KEY, { env: { ...ENV, ...ENV_EMAIL }, sleep: semEspera, fetchImpl: async url => String(url).includes('resend') ? resposta(200, { id: 'e' }) : resposta(503) });
  assert.equal(r.status, 200); assert.equal(r.via, 'email');
});

test('deliverLead: nenhum caminho entregou, então 503 (nunca "recebemos" sem entregar)', async () => {
  const semEmail = await deliverLead(validateLead(base), KEY, { env: ENV, sleep: semEspera, fetchImpl: async () => resposta(503) });
  assert.equal(semEmail.status, 503);
  const emailFalha = await deliverLead(validateLead(base), KEY, { env: { ...ENV, ...ENV_EMAIL }, sleep: semEspera, fetchImpl: async () => resposta(500) });
  assert.equal(emailFalha.status, 503);
});

test('deliverLead: limite e conflito do Core viram 429 e 409 e não disparam e-mail', async () => {
  for (const [status, esperado] of [[429, 429], [409, 409]]) {
    const r = await deliverLead(validateLead(base), KEY, { env: { ...ENV, ...ENV_EMAIL }, sleep: semEspera, fetchImpl: async url => String(url).includes('resend') ? assert.fail('não deve mandar e-mail') : resposta(status) });
    assert.equal(r.status, esperado);
  }
});

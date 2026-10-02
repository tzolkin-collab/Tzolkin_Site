export const services = new Set([
  'Landing Pages de Conversão', 'Sites Institucionais', 'E-commerce global',
  'Tracking de Funil', 'Cardápios Virtuais', 'Pagamentos Globais', 'API Pix',
  'Sistemas de Mensalidade', 'Solução Personalizada', 'Ferramentas TZOLKIN',
  'Educacional TZOLKIN', 'Sob Demanda', 'Outro',
  // Os títulos que os formulários realmente oferecem (pricingData). Sem eles o servidor recusava o
  // carro-chefe: "Landing Pages de Alta Conversão". Os nomes antigos acima seguem aceitos.
  'Landing Pages de Alta Conversão', 'E-commerce Headless Next.js', 'Tracking de Funil Server-Side',
]);

// Atribuição é melhor-esforço: o lead NUNCA se perde por causa de UTM mal formado. Chave desconhecida ou
// valor inválido é descartado em silêncio; o que passa tem formato conferido.
const ATTRIBUTION_FIELDS = {
  utm_source: 200, utm_medium: 200, utm_campaign: 500, utm_content: 500, utm_term: 500, utm_tzolkin: 80,
  meta_campaign_id: 25, meta_adset_id: 25, meta_ad_id: 25, fbclid: 500, gclid: 500, landing_page: 500, referrer: 1000,
};
const ATTRIBUTION_PATTERNS = {
  utm_tzolkin: /^[a-z0-9][a-z0-9._-]{0,79}$/,
  meta_campaign_id: /^[0-9]{5,25}$/, meta_adset_id: /^[0-9]{5,25}$/, meta_ad_id: /^[0-9]{5,25}$/,
  fbclid: /^[A-Za-z0-9_-]{5,500}$/, gclid: /^[A-Za-z0-9_-]{5,500}$/,
};

export function sanitizeAttribution(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
  const out = {};
  for (const [key, limit] of Object.entries(ATTRIBUTION_FIELDS)) {
    let value = input[key];
    if (typeof value !== 'string') continue;
    value = value.trim();
    if (key === 'utm_tzolkin') value = value.toLowerCase();
    if (!value || value.length > limit || /[\u0000-\u001f]/.test(value)) continue;
    if (ATTRIBUTION_PATTERNS[key] && !ATTRIBUTION_PATTERNS[key].test(value)) continue;
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

export function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('INVALID_INPUT');
  const limits = { fullName: 200, email: 254, whatsapp: 40, companyName: 200,
    companySize: 100, employees: 100, instagram: 200, website: 500, service: 200, message: 5000 };
  /** @type {Record<string, any>} */
  const result = {};
  // Reject rather than trust browser-supplied tenant, permissions, price or source.
  // `attribution` é a única chave extra permitida e é sanitizada à parte.
  const { attribution, ...fields } = input;
  if (Object.keys(fields).some(key => !(key in limits))) throw new Error('INVALID_FIELDS');
  for (const [key, limit] of Object.entries(limits)) {
    const value = fields[key] ?? '';
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('INVALID_FIELD');
    result[key] = value.trim();
  }
  result.email = result.email.toLowerCase();
  result.whatsapp = result.whatsapp.replace(/[\s()+.-]/g, '');
  // Pelo menos um contato (mesma regra do Core). E-mail e WhatsApp, quando vêm, têm que ser válidos.
  const temEmail = result.email.length > 0, temWhatsapp = result.whatsapp.length > 0;
  if (result.fullName.length < 2 || (!temEmail && !temWhatsapp)
    || (temEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))
    || (temWhatsapp && !/^\d{10,15}$/.test(result.whatsapp)) || !services.has(result.service)) throw new Error('INVALID_CONTACT');
  if (result.service === 'Sob Demanda' && !result.message) throw new Error('MESSAGE_REQUIRED');
  const cleanAttribution = sanitizeAttribution(attribution);
  if (cleanAttribution) result.attribution = cleanAttribution;
  return result;
}

export async function readLimitedJson(request, maxBytes = 16384) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('EMPTY_BODY');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) { await reader.cancel(); throw new Error('BODY_TOO_LARGE'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

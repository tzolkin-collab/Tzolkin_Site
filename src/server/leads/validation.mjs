export const services = new Set([
  'Landing Pages de Conversão', 'Sites Institucionais', 'E-commerce global',
  'Tracking de Funil', 'Cardápios Virtuais', 'Pagamentos Globais', 'API Pix',
  'Sistemas de Mensalidade', 'Solução Personalizada', 'Ferramentas TZOLKIN',
  'Educacional TZOLKIN', 'Sob Demanda', 'Outro',
]);

export function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('INVALID_INPUT');
  const limits = { fullName: 200, email: 254, whatsapp: 40, companyName: 200,
    companySize: 100, employees: 100, instagram: 200, website: 500, service: 200, message: 5000 };
  /** @type {Record<string, string>} */
  const result = {};
  // Reject rather than trust browser-supplied tenant, permissions, price or source.
  if (Object.keys(input).some(key => !(key in limits))) throw new Error('INVALID_FIELDS');
  for (const [key, limit] of Object.entries(limits)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('INVALID_FIELD');
    result[key] = value.trim();
  }
  result.email = result.email.toLowerCase();
  result.whatsapp = result.whatsapp.replace(/[\s()+.-]/g, '');
  if (result.fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)
    || !/^\d{10,15}$/.test(result.whatsapp) || !services.has(result.service)) throw new Error('INVALID_CONTACT');
  if (result.service === 'Sob Demanda' && !result.message) throw new Error('MESSAGE_REQUIRED');
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

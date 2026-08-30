import { readLimitedJson, validateLead } from '@/server/leads/validation.mjs';
import { saveLead } from '@/server/leads/repository';

export const runtime = 'nodejs';
const reply = (status: number, message: string) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply(403, 'Origem não permitida.');
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, 'Envie dados em JSON.');
  const key = request.headers.get('idempotency-key');
  if (!key || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) return reply(400, 'Identificador de envio inválido.');
  let data;
  try { data = validateLead(await readLimitedJson(request)); }
  catch (error) {
    return error instanceof Error && error.message === 'BODY_TOO_LARGE'
      ? reply(413, 'Formulário muito extenso.') : reply(400, 'Revise os dados de contato e os campos do formulário.');
  }
  try {
    await saveLead(data, key);
    return reply(200, 'Recebemos sua solicitação.');
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMITED') return reply(429, 'Muitos envios. Aguarde antes de tentar novamente.');
    if (error instanceof Error && error.message === 'IDEMPOTENCY_CONFLICT') return reply(409, 'Este envio já foi recebido com outros dados. Atualize a página para iniciar outro.');
    // Never log request payloads or database error details (may contain contact data).
    console.error('[leads] persistence_failed');
    return reply(503, 'Não foi possível salvar agora. Seus dados continuam no formulário; tente novamente.');
  }
}

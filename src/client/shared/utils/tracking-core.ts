/**
 * Lógica pura de rastreamento (sem window, sem imports): mapeamento de eventos e montagem de payloads.
 * Fica separada de analytics.ts para ser testada com `node --test` (scripts/tracking.test.mjs).
 */
export type EventName = 'lead' | 'initiate_checkout' | 'page_view' | 'form_started' | 'whatsapp_click';

export type MetaCall = {
  method: 'track' | 'trackCustom';
  name: string;
  params: Record<string, string>;
};

// Nomes do dataLayer são contrato com o GTM: não renomear sem atualizar os gatilhos (docs/TRACKING.md).
const META_MAP: Partial<Record<EventName, { method: MetaCall['method']; name: string }>> = {
  lead: { method: 'track', name: 'Lead' },
  whatsapp_click: { method: 'track', name: 'Contact' },
  form_started: { method: 'trackCustom', name: 'FormStarted' },
  initiate_checkout: { method: 'track', name: 'InitiateCheckout' },
  // page_view: o Pixel já dispara PageView sozinho (init + troca de rota), não passa por aqui.
};

// Só estes campos vão para a Meta. Nunca e-mail, telefone ou nome (dado pessoal sai só via CAPI com hash).
const META_PARAM_KEYS = ['service', 'suite'] as const;

export function metaEventFor(eventName: EventName): { method: MetaCall['method']; name: string } | null {
  return META_MAP[eventName] ?? null;
}

export function buildMetaCall(eventName: EventName, payload?: Record<string, unknown>): MetaCall | null {
  const mapped = metaEventFor(eventName);
  if (!mapped) return null;
  const params: Record<string, string> = {};
  for (const key of META_PARAM_KEYS) {
    const value = payload?.[key];
    if (typeof value === 'string' && value.trim()) params[key] = value.trim().slice(0, 100);
  }
  if (params.service) params.content_name = params.service;
  return { ...mapped, params };
}

/** Conversões que precisam de event_id para deduplicar navegador x servidor (futura Conversions API). */
export function needsEventId(eventName: EventName): boolean {
  return eventName === 'lead';
}

export function newEventId(cryptoLike?: { randomUUID?: () => string }): string {
  if (cryptoLike && typeof cryptoLike.randomUUID === 'function') return cryptoLike.randomUUID();
  // Fallback para navegadores sem randomUUID (contexto não seguro): suficiente para deduplicação.
  return `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Objeto empurrado no dataLayer. `event` e `event_id` nunca são sobrescritos pelo payload. */
export function buildDataLayerEvent(
  eventName: EventName,
  payload?: Record<string, unknown>,
  eventId?: string,
): Record<string, unknown> {
  return { ...payload, event: eventName, ...(eventId ? { event_id: eventId } : {}) };
}

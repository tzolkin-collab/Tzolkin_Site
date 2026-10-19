import {
  buildDataLayerEvent,
  buildMetaCall,
  needsEventId,
  newEventId,
  type EventName,
} from './tracking-core';

export type { EventName };

// Flag de debug: ativa em desenvolvimento ou via NEXT_PUBLIC_ANALYTICS_DEBUG=true
const ANALYTICS_DEBUG =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

interface CustomWindow extends Window {
  dataLayer?: Record<string, unknown>[];
  utmify?: (action: string, eventName: string, payload?: Record<string, unknown>) => void;
  fbq?: (...args: unknown[]) => void;
}

/**
 * Dispara o evento no dataLayer (GTM), no Meta Pixel (se carregado pelo site) e no UTMify.
 * Devolve o event_id gerado (só para conversões como 'lead'), para uso futuro na Conversions API.
 */
export const trackEvent = (eventName: EventName, payload?: Record<string, unknown>): string | undefined => {
  try {
    const win = typeof window !== 'undefined' ? (window as unknown as CustomWindow) : null;
    const eventId = needsEventId(eventName)
      ? (typeof payload?.event_id === 'string' ? payload.event_id : newEventId(globalThis.crypto))
      : undefined;
    const enriched = eventId ? { ...payload, event_id: eventId } : payload;

    // 1. Google Tag Manager (dataLayer): nomes estáveis, event_id incluído
    if (win && win.dataLayer) {
      win.dataLayer.push(buildDataLayerEvent(eventName, payload, eventId));
    }

    // 2. Meta Pixel (só existe se NEXT_PUBLIC_META_PIXEL_ID estiver definido)
    if (win && typeof win.fbq === 'function') {
      const call = buildMetaCall(eventName, payload);
      if (call) {
        win.fbq(call.method, call.name, call.params, eventId ? { eventID: eventId } : undefined);
      }
    }

    // 3. UTMify
    if (win && win.utmify) {
      win.utmify('track', eventName, enriched);
    }

    // Fallback de logging apenas com a flag de debug ativa
    if (ANALYTICS_DEBUG) {
      console.log(`[Analytics Tracked] ${eventName}`, enriched);
    }
    return eventId;
  } catch (err) {
    console.error('[Analytics Error]', err);
    return undefined;
  }
};

/**
 * Utilitário de UTMs para o ecossistema TZOLKIN
 * Garante que todo redirecionamento para subdomínios (sites.tzolkin.cloud, ecom.tzolkin.cloud, etc.)
 * carregue automaticamente a tag de origem utm_source=tzolkinhome
 */

export const TZOLKIN_DOMAINS = [
  'tzolkin.cloud',
  'sites.tzolkin.cloud',
  'ecom.tzolkin.cloud',
  'sites.ecom',
];

export function appendTzolkinUtm(
  rawUrl: string,
  utmSource: string = 'tzolkinhome'
): string {
  if (!rawUrl) return rawUrl;

  try {
    // Se for URL relativa, mantemos intacta
    if (rawUrl.startsWith('/') || rawUrl.startsWith('#')) {
      return rawUrl;
    }

    const url = new URL(rawUrl);
    const hostname = url.hostname.toLowerCase();

    // Verifica se é um domínio do ecossistema Tzolkin
    const isTzolkinDomain =
      TZOLKIN_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)) ||
      hostname.includes('tzolkin');

    if (isTzolkinDomain) {
      if (!url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', utmSource);
      }
      return url.toString();
    }

    return rawUrl;
  } catch {
    // Fallback caso a string não seja uma URL válida completa
    if (rawUrl.includes('tzolkin.cloud') || rawUrl.includes('sites.') || rawUrl.includes('ecom.')) {
      const separator = rawUrl.includes('?') ? '&' : '?';
      if (!rawUrl.includes('utm_source=')) {
        return `${rawUrl}${separator}utm_source=${utmSource}`;
      }
    }
    return rawUrl;
  }
}

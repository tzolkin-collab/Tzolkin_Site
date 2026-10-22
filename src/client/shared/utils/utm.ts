/**
 * Utilitário de UTMs para o ecossistema TZOLKIN
 * Garante que todo redirecionamento para subdomínios (sites.tzolkin.cloud, onde ficam também as lojas)
 * carregue automaticamente a tag de origem utm_source=tzolkinhome
 */

export const TZOLKIN_DOMAINS = [
  'tzolkin.cloud',
  'sites.tzolkin.cloud',
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
    if (rawUrl.includes('tzolkin.cloud') || rawUrl.includes('sites.')) {
      const separator = rawUrl.includes('?') ? '&' : '?';
      if (!rawUrl.includes('utm_source=')) {
        return `${rawUrl}${separator}utm_source=${utmSource}`;
      }
    }
    return rawUrl;
  }
}

export const AGENCY_URL = 'https://sites.tzolkin.cloud';
/**
 * UTM própria deste link. O Core exige `<espaço>.<nicho>` com o espaço da chave que recebe o lead (aqui, `sites`) e usa o
 * nicho para escolher o funil de mesmo slug; sem funil `agencia`, o lead cai no funil padrão de Sites.
 */
export const AGENCY_UTM = 'sites.agencia';

/** Nomes que o Sites lê na URL (site/main.js): os IDs do anúncio chegam sem o prefixo `meta_` que este site usa. */
const FORWARD: Record<string, string> = {
  utm_source: 'utm_source', utm_medium: 'utm_medium', utm_campaign: 'utm_campaign', utm_content: 'utm_content', utm_term: 'utm_term',
  fbclid: 'fbclid', gclid: 'gclid',
  meta_campaign_id: 'campaign_id', meta_adset_id: 'adset_id', meta_ad_id: 'ad_id',
};

/**
 * Link do menu para a agência (sites.tzolkin.cloud). Leva a origem de marketing do visitante (UTMs, IDs do anúncio e
 * cliques de campanha) e a UTM própria da TZOLKIN deste link, com os nomes que o Sites espera. Sem origem, só a UTM
 * própria e o `utm_source=tzolkinhome` padrão do ecossistema.
 */
export function buildAgencyUrl(marketing: Record<string, string | undefined> = {}): string {
  const url = new URL(AGENCY_URL);
  for (const [from, to] of Object.entries(FORWARD)) {
    const value = marketing[from];
    if (value) url.searchParams.set(to, value);
  }
  url.searchParams.set('utm_tzolkin', AGENCY_UTM);
  // Sem campanha de origem, o clique é tráfego do próprio site: o Core vê de onde saiu pelo source/medium/campaign.
  if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'tzolkinhome');
  if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'menu');
  if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'agencia');
  return url.toString();
}

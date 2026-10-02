/**
 * Origem do visitante (UTM e IDs de anúncio) para viajar junto com o lead até o Core.
 *
 * Convenção dos parâmetros: os mesmos nomes do bloco `attribution` do Core (docs/ATTRIBUTION.md). Na URL
 * do anúncio da Meta, os IDs vão como `meta_campaign_id={{campaign.id}}&meta_adset_id={{adset.id}}&meta_ad_id={{ad.id}}`;
 * `utm_tzolkin` é `<espaço>.<nicho>` (ex.: `sites.corretor`).
 *
 * Fica em sessionStorage (some ao fechar a aba): é só o que o formulário precisa e evita guardar rastro
 * além da visita. Falha de armazenamento (aba privada, bloqueio) nunca quebra o envio: o lead segue sem origem.
 */
const STORAGE_KEY = 'tz_attribution_v1';
const PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_tzolkin',
  'meta_campaign_id', 'meta_adset_id', 'meta_ad_id', 'fbclid', 'gclid',
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landing_page' | 'referrer', string>>;

function stored(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/**
 * Guarda a origem na primeira página da visita. Uma nova chegada com parâmetros de campanha substitui a
 * anterior; navegar dentro do site sem parâmetros mantém a origem. Só o caminho da página e da origem
 * externa é guardado, sem query string, para não levar dado pessoal que venha na URL.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const query = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const name of PARAMS) {
      const value = query.get(name);
      if (value) found[name] = value.slice(0, 500);
    }
    if (Object.keys(found).length === 0 && Object.keys(stored()).length > 0) return;
    const next: Attribution = { ...found, landing_page: window.location.pathname };
    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin !== window.location.origin) next.referrer = (ref.origin + ref.pathname).slice(0, 1000);
      } catch { /* referrer inválido: ignora */ }
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch { /* armazenamento indisponível: segue sem atribuição */ }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  captureAttribution();
  return stored();
}

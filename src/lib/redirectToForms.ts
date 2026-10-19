import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Rotas antigas do funil (chat e passos) levam para /forms preservando a query string. */
export async function redirectToForms(searchParams: SearchParams): Promise<never> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) value.forEach(v => params.append(key, v));
    else if (value !== undefined) params.append(key, value);
  }
  const query = params.toString();
  redirect(query ? `/forms?${query}` : '/forms');
}

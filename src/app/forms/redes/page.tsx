import { redirectToForms } from '@/lib/redirectToForms';

export default function LegacyRedirect({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return redirectToForms(searchParams);
}

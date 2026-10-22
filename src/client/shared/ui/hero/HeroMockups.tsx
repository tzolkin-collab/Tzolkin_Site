"use client";

import { CrmDevices } from "@/client/shared/ui/apps/ProductDevices";

/**
 * Demonstração do hero: o CRM em Mac e iPhone, com as três etapas (receber, entender, encaminhar) conduzidas pelo scroll.
 * O nome de cada etapa e a barra de progresso ficam dentro da tela do aparelho. Sem `step` (celular), mostra a etapa do meio.
 */
export function HeroMockups({ step }: { step?: number }) {
  const current = step ?? 1;
  return (
    <figure className="min-w-0 lg:-mr-10 xl:-mr-24">
      <CrmDevices step={current} />
    </figure>
  );
}

"use client";

import { CrmDevices } from "@/client/shared/ui/apps/ProductDevices";

/**
 * Demonstração do hero: o CRM em Mac e iPhone, com as três etapas (receber, entender, encaminhar) conduzidas pelo scroll.
 * O nome de cada etapa está dentro das telas; abaixo fica só uma barra de progresso. Sem `step` (celular), mostra a etapa do meio.
 */
export function HeroMockups({ step }: { step?: number }) {
  const current = step ?? 1;
  return (
    <figure className="min-w-0 lg:-mr-10 xl:-mr-24">
      <CrmDevices step={current} />
      <div
        role="progressbar"
        aria-label="Progresso da demonstração"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={current + 1}
        className="mx-auto mt-5 h-1 w-[min(240px,100%)] overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full origin-left rounded-full bg-brand transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${(current + 1) / 3})` }}
        />
      </div>
    </figure>
  );
}

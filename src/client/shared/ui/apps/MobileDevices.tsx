'use client';

import type { ReactNode } from 'react';
import { PhoneShell, PhoneStore } from './EcommerceDevices';
import { AgentsPhone, CrmPhone, FiscalPhone, PilotPhone } from './ProductDevices';

/*
 * Celular: um aparelho por aplicação, na escala 1,15 (cerca de 300px de largura, texto de interface de 12 a 13px).
 * Fica cortado embaixo, na faixa que sobra da tela, e some num degradê. Telas em cores fixas, dados fictícios.
 */

const S = 1.15;

const SCREENS: Record<string, ReactNode> = {
  'crm-com-ia': <CrmPhone step={1} />,
  'agentes-ia': <AgentsPhone />,
  'ecommerce-marketplace': <PhoneStore />,
  fiscal: <FiscalPhone />,
  piloto: <PilotPhone />,
};

export function MobileDevices({ slug }: { slug: string }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_72%,transparent)]">
      <div className="mx-auto" style={{ width: 262 * S, height: 540 * S }}>
        <div className="origin-top-left" style={{ width: 262, height: 540, transform: `scale(${S})` }}>
          <PhoneShell>{SCREENS[slug]}</PhoneShell>
        </div>
      </div>
    </div>
  );
}

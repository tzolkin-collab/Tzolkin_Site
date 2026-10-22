'use client';

import { useLayoutEffect, useRef, useState, type JSX } from 'react';
import { applications } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { AgentsDevices, CrmDevices, FiscalDevices, PilotDevices } from '@/client/shared/ui/apps/ProductDevices';
import { EcommerceDevices } from '@/client/shared/ui/apps/EcommerceDevices';
import { FitBox } from '@/client/shared/ui/apps/FitBox';

const mocks: Record<string, () => JSX.Element> = {
  'crm-com-ia': () => <CrmDevices step={1} />,
  'agentes-ia': AgentsDevices,
  'ecommerce-marketplace': () => <EcommerceDevices step={0} />,
  fiscal: FiscalDevices,
  piloto: PilotDevices,
};

const COUNT = applications.length;



/**
 * Conteúdo de Aplicações: índice editorial em acordeão (a aplicação ativa abre) com a demonstração na laje à direita
 * no desktop e, no celular, escalada para a altura que sobra. O palco fixo, o fundo e o scroll ficam em
 * ApplicationsMethodStory; aqui só o conteúdo, que esse palco faz subir e sumir.
 */
export function ServicesContent({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  // Acordeão sem layout shift e sem espaço sobrando: os detalhes das cinco aplicações ocupam a mesma célula (a altura
  // é a do maior), e as linhas abaixo da aberta só se movem por transform. O item aberto tem uma linha só, no fim.
  const listRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const [detailY, setDetailY] = useState(0);
  const [detailH, setDetailH] = useState(0);
  useLayoutEffect(() => {
    const list = listRef.current;
    const detail = detailRef.current;
    if (!list || !detail) return;
    const place = () => {
      const li = rowRefs.current[active];
      if (li) setDetailY(li.offsetTop + li.offsetHeight);
      setDetailH(detail.offsetHeight);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    ro.observe(detail);
    return () => ro.disconnect();
  }, [active]);

  const app = applications[active];
  const Preview = mocks[app.slug] ?? PilotDevices;

  return (
    <>
      {/* desktop: a demonstração dentro da laje (52% da tela, que é do palco) */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] xl:block">
        <div className="absolute inset-0 flex items-center px-6" aria-live="polite">
          <FitBox center className="!flex-none h-[min(700px,calc(100svh-120px))] w-full">
            <div key={app.slug} className="overflow-hidden rounded-lg">
              <Preview />
            </div>
          </FitBox>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12 xl:grid xl:flex-none xl:grid-cols-12 xl:items-center xl:gap-0">
          <div className="xl:col-span-6 xl:pr-16">
            <SectionHeader id="aplicacoes-title" eyebrow="Aplicações" title="Softwares que auxiliam na gestão, vendas, marketing e inteligência" />

            {/* acordeão: a aplicação ativa abre sem empurrar a página */}
            <ol ref={listRef} className="relative mt-4 xl:mt-8" style={{ paddingBottom: detailH }} aria-label="Aplicações">
              {applications.map((a, i) => {
                const on = i === active;
                return (
                  <li
                    key={a.slug}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className={i > 0 ? 'border-t border-border' : ''}
                    style={{ transform: i > active ? `translateY(${detailH}px)` : undefined }}
                  >
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => onSelect(i)}
                      className="flex min-h-11 w-full items-baseline gap-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand xl:min-h-12 xl:gap-5 xl:py-3"
                    >
                      <span className={`w-6 shrink-0 text-sm font-semibold tabular-nums ${on ? 'text-brand' : 'text-foreground/35'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-lg font-semibold leading-snug tracking-tight xl:text-2xl ${on ? 'text-foreground' : 'text-foreground/45'}`}>{a.title}</span>
                    </button>
                  </li>
                );
              })}
              <div
                ref={detailRef}
                aria-live="polite"
                className="absolute inset-x-0 top-0 grid pb-3 pl-10 xl:pb-5 xl:pl-11"
                style={{ transform: `translateY(${detailY}px)` }}
              >
                {applications.map((a, i) => (
                  <div key={a.slug} aria-hidden={i !== active} className={`col-start-1 row-start-1 ${i === active ? '' : 'invisible'}`}>
                    <p className="text-sm font-medium xl:text-base">{a.forWho}</p>
                    <p className="mt-2 hidden max-w-xl text-[15px] leading-relaxed text-foreground/70 xl:block">{a.delivers}</p>
                  </div>
                ))}
              </div>
            </ol>
            <p className="mt-4 hidden text-sm text-foreground/55 xl:block">Cinco frentes em que já desenhamos e entregamos. O escopo final é definido em conversa.</p>

          </div>

          <FitBox className="mt-6 xl:hidden">
            <div key={app.slug} className="overflow-hidden rounded-lg">
              <Preview />
            </div>
          </FitBox>
      </div>
    </>
  );
}

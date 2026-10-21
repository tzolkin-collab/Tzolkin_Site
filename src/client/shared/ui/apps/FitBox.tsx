'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Ocupa o espaço que sobrar (flex-1) e escala o conteúdo para caber nele, de cima para baixo, centralizado.
 * O conteúdo tem largura fixa (a da caixa) e só muda de tamanho por `transform`, então trocar de demonstração
 * durante o scroll não provoca layout shift. `base` é a escala máxima; `center` centraliza na vertical.
 */
export function FitBox({ base = 1, center = false, children, className = '' }: { base?: number; center?: boolean; children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [boxH, setBoxH] = useState(0);
  const [natH, setNatH] = useState(0);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      setBoxH(o.clientHeight);
      setNatH(i.offsetHeight);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    measure();
    return () => ro.disconnect();
  }, []);

  const ready = natH > 0 && boxH > 0;
  const scale = ready ? Math.min(base, boxH / natH) : 1;
  return (
    <div ref={outer} className={`relative min-h-0 flex-1 overflow-hidden ${className}`}>
      <div
        ref={inner}
        className="absolute left-0 top-0 w-full"
        style={{
          transform: `translateY(${center && ready ? Math.max(0, (boxH - natH * scale) / 2) : 0}px) scale(${scale})`,
          transformOrigin: 'top center',
          opacity: ready ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

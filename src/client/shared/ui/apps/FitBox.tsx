'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Ocupa o espaço que sobrar (flex-1) e escala o conteúdo para caber nele, de cima para baixo.
 * `base` é a escala máxima (o conteúdo cresce até ela se houver espaço, mas nunca passa da altura disponível).
 * Usado nas seções fixas por scroll em telas pequenas, onde a altura útil é só o que sobra do texto.
 */
export function FitBox({ base = 1, children, className = '' }: { base?: number; children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [boxH, setBoxH] = useState(0);
  const [natH, setNatH] = useState(0);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      setBoxH(o.clientHeight);
      setNatH(i.offsetHeight);
    });
    ro.observe(o);
    ro.observe(i);
    setBoxH(o.clientHeight);
    setNatH(i.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const scale = natH > 0 && boxH > 0 ? Math.min(base, boxH / natH) : 1;
  return (
    <div ref={outer} className={`relative min-h-0 flex-1 overflow-hidden ${className}`}>
      <div ref={inner} style={{ width: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

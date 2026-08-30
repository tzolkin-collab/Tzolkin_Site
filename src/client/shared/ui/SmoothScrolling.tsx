'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function SmoothScrolling() {
  useEffect(() => {
    // Desabilitar o Lenis em dispositivos móveis ou nas rotas com carrossel horizontal pura (/servicos e /produtos)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isHorizontalShowcase = window.location.pathname.startsWith('/servicos') || window.location.pathname.startsWith('/produtos');
    if (isMobile || isHorizontalShowcase) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Handler para cliques em links internos com âncora (#)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Verifica se é uma âncora interna (#id ou /#id na home)
      const isHome = window.location.pathname === '/';
      let targetId = '';

      if (href.startsWith('#') && href.length > 1) {
        targetId = href.substring(1);
      } else if (href.startsWith('/#') && isHome && href.length > 2) {
        targetId = href.substring(2);
      }

      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -80,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          window.history.pushState(null, '', `#${targetId}`);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    // Scroll suave inicial se a URL já tiver hash
    if (window.location.hash) {
      const initialId = window.location.hash.substring(1);
      setTimeout(() => {
        const initialElement = document.getElementById(initialId);
        if (initialElement) {
          lenis.scrollTo(initialElement, {
            offset: -80,
            duration: 1.2,
          });
        }
      }, 300);
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return null;
}

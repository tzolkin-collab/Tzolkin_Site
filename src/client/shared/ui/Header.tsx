'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { TzolkinLogo } from './TzolkinLogo';
import { useLockBody } from '@/hooks/useLockBody';

type MenuItem = { label: string; href: string; badge?: string };

const menuItems: MenuItem[] = [
  { label: 'Aplicações', href: '/#aplicacoes' },
  { label: 'Como contratar', href: '/#como-contratar' },
  // { label: 'Enterprise', href: '/enterprise' },     // Em breve
  // { label: 'Educacional', href: '/educacional' },   // Em breve
  // { label: 'Soluções', href: '/solucoes' },         // Em breve
];

const mobileMenuItems: MenuItem[] = [
  ...menuItems,
  { label: 'Contato', href: '/forms' },
];

// Seções da home, na ordem da página. O header mostra 3 por vez, acompanhando o scroll.
const sectionLinks = [
  { id: 'cases', label: 'Cases' },
  { id: 'aplicacoes', label: 'Aplicações' },
  { id: 'como-construimos', label: 'Como construímos' },
  { id: 'como-contratar', label: 'Como contratar' },
  { id: 'integracoes', label: 'Integrações' },
  { id: 'about', label: 'Quem somos' },
];
const VISIBLE_LINKS = 3;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rafRef = useRef<number | null>(null);
  const isHome = usePathname() === '/';
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const BANNER_HEIGHT = 40;
    const update = () => {
      // Na home o hero fica fixo enquanto o scroll percorre as etapas: o header
      // só muda de modo quando a página realmente começa a descer.
      const pin = document.querySelector<HTMLElement>('[data-hero-pin]');
      const pinned = pin && window.matchMedia('(min-width: 1024px)').matches;
      const threshold = pinned ? pin.offsetHeight - window.innerHeight : BANNER_HEIGHT;
      setScrolled(window.scrollY > Math.max(threshold, BANNER_HEIGHT));

      // Descendo, o header sobe; subindo, volta. Pequenos tremores de scroll não contam.
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 120);
        lastY.current = y;
      }

      if (isHome) {
        const line = window.innerHeight * 0.4;
        let current = -1;
        sectionLinks.forEach((link, i) => {
          const el = document.getElementById(link.id);
          if (el && el.getBoundingClientRect().top <= line) current = i;
        });
        setActiveIndex(current);
      }
    };
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHome]);

  const windowStart = Math.min(
    Math.max(activeIndex - 1, 0),
    sectionLinks.length - VISIBLE_LINKS,
  );

  useLockBody(isMenuOpen);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-[top,padding,background-color,backdrop-filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'} ${scrolled
          ? 'top-0 py-1 pt-2.5 bg-background backdrop-blur-md'
          : 'top-0 bg-transparent py-6'
          }`}
      >
        {/* Progresso da página: linha vermelha que entra pela esquerda na borda de cima */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[0.8px] w-full origin-left bg-[#ff2a2a] shadow-[0_0_6px_1px_rgba(255,42,42,0.85),0_0_14px_2px_rgba(255,42,42,0.45)]"
          style={{ scaleX: scrollYProgress }}
        />
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto flex justify-between items-center gap-8">
          {/* Logo — Futuristic Geometric Monolith */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group z-50 relative flex-shrink-0 select-none"
          >
            <TzolkinLogo size={26} className="transition-transform duration-300 group-hover:scale-105" />
            <span style={{ fontFamily: 'var(--font-brand)' }} className="text-[17px] md:text-[18px] font-semibold tracking-[0.5px] uppercase text-foreground group-hover:text-foreground/90 transition-colors leading-none">
              TZOLKIN
            </span>
          </Link>

          {/* Navigation & Actions */}
          <>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {isHome ? (
                  scrolled && (
                    <>
                      <div
                        className="w-[30rem] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
                        aria-label="Seções da página"
                      >
                        <div
                          className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{ transform: `translateX(-${windowStart * (100 / VISIBLE_LINKS)}%)` }}
                        >
                          {sectionLinks.map((link, i) => {
                            const active = i === activeIndex;
                            return (
                              <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                aria-current={active ? 'true' : undefined}
                                className={`relative w-1/3 shrink-0 py-1 text-center text-[13px] font-medium uppercase tracking-wide transition-colors duration-300 ${active
                                  ? 'text-brand'
                                  : 'text-foreground/50 hover:text-foreground/80'
                                  }`}
                              >
                                {link.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <Link
                        href="/forms"
                        className="rounded-full bg-foreground text-background hover:bg-brand hover:text-white transition-all duration-300 hover:scale-105 text-xs font-bold uppercase tracking-wider px-5 py-2.5 shadow-sm"
                      >
                        Iniciar projeto
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm font-medium tracking-wide text-foreground hover:text-brand transition-colors uppercase"
                      >
                        {item.label}
                        {item.badge && (
                          <span className="ml-1.5 align-super text-[10px] font-semibold tracking-widest text-brand whitespace-nowrap">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                    <Link
                      href="/forms"
                      className="rounded-full bg-foreground text-background hover:bg-brand hover:text-white transition-all duration-300 hover:scale-105 text-xs font-bold uppercase tracking-wider px-5 py-2.5 shadow-sm"
                    >
                      Iniciar projeto
                    </Link>
                  </>
                )}
                <div className={isHome && !scrolled ? '' : 'pl-4 border-l border-foreground/20'}>
                  <ModeToggle />
                </div>
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex items-center gap-4 z-50 relative">
                <ModeToggle />
                <button
                  onClick={toggleMenu}
                  className="text-foreground p-2 -mr-2 hover:bg-foreground/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label="Alternar menu"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
          </>
        </div>
      </header >

      {/* Mobile Menu Overlay */}
      < div
        className={`fixed inset-0 bg-background z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col justify-center items-center ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`
        }
      >
        <nav className="flex flex-col items-center gap-6 [@media(max-height:700px)]:gap-4">
          {mobileMenuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={toggleMenu}
              className={`text-5xl [@media(max-height:700px)]:text-3xl font-bold tracking-tight text-foreground uppercase hover:text-muted-foreground transition-all duration-500 inline-flex items-baseline gap-1.5 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {item.label}
              {item.badge && (
                <span className="align-super text-[10px] font-semibold tracking-widest text-brand whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/forms"
            onClick={toggleMenu}
            className={`mt-4 rounded-full px-8 py-3.5 bg-foreground text-background hover:bg-foreground/90 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: `${mobileMenuItems.length * 100 + 200}ms` }}
          >
            Iniciar projeto
          </Link>
        </nav>

        <div className="absolute bottom-10 left-0 w-full text-center text-muted-foreground/20 text-sm tracking-[0.5em] uppercase">
          &copy; {new Date().getFullYear()} TZOLKIN.
        </div>
      </div >
    </>
  );
}

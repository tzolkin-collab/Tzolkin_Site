'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { TzolkinLogo } from './TzolkinLogo';
import { useLockBody } from '@/hooks/useLockBody';

type MenuItem = { label: string; href: string; badge?: string };

const menuItems: MenuItem[] = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Soluções', href: '/#products' },
  // { label: 'Enterprise', href: '/enterprise' },     // Em breve
  // { label: 'Educacional', href: '/educacional' },   // Em breve
  // { label: 'Soluções', href: '/solucoes' },         // Em breve
];

const mobileMenuItems: MenuItem[] = [
  ...menuItems,
  { label: 'Contato', href: '/forms' },
];

export function Header() {
  const pathname = usePathname();
  const isConsultor = pathname?.startsWith('/consultor');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const BANNER_HEIGHT = 40;
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > BANNER_HEIGHT);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useLockBody(isMenuOpen);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-[top,padding,background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled
          ? 'top-0 py-1 pt-2.5 bg-background backdrop-blur-md'
          : 'top-0 bg-transparent py-6'
          }`}
      >
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
          {isConsultor ? (
            <div className="flex items-center gap-4 z-50">
              <div id="chat-header-actions" className="flex items-center gap-2"></div>
              <div className="pl-4 border-l border-foreground/20 hidden md:block">
                <ModeToggle />
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
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
                <div className="pl-4 border-l border-foreground/20">
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
          )}
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

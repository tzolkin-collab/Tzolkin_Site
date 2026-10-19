"use client";

import React from "react";
import Link from "next/link";
import { TzolkinLogo } from "./TzolkinLogo";

type FooterLink = { label: string; href: string; badge?: string };

const aplicacoesLinks: FooterLink[] = [
  { label: "CRM com IA", href: "/crm-com-ia" },
  { label: "Agentes de IA", href: "/forms?aplicacao=agentes-ia" },
  { label: "E-commerce e marketplaces", href: "/forms?aplicacao=ecommerce-marketplace" },
  { label: "Automação fiscal", href: "/forms?aplicacao=fiscal" },
  { label: "Evoluir um piloto", href: "/forms?aplicacao=piloto" },
];

const tzolkinLinks: FooterLink[] = [
  { label: "Como construímos", href: "/#como-construimos" },
  { label: "Como contratar", href: "/#como-contratar" },
  { label: "Cases", href: "/#cases" },
];

const contatoLinks: FooterLink[] = [
  { label: "Iniciar projeto", href: "/forms" },
  { label: "contato@tzolkin.com.br", href: "mailto:contato@tzolkin.com.br" },
];

const footerColumns: { title: string; links: FooterLink[] }[] = [
  { title: "Aplicações", links: aplicacoesLinks },
  { title: "A TZOLKIN", links: tzolkinLinks },
  { title: "Contato", links: contatoLinks },
];

const currentYear = new Date().getFullYear();

export function Footer() {

  return (
    <footer
      id="contact"
      className="bg-background text-foreground pt-24 pb-8 px-6 md:px-12 relative overflow-hidden transition-colors duration-300 border-t border-border"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-10">
          {/* Brand & CTA Section */}
          <div className="md:col-span-6">
            <div>
              <Link href="/" className="inline-block group select-none">
                <div className="flex items-center gap-4 py-4">
                  <TzolkinLogo size={44} className="transition-transform duration-300 group-hover:scale-105" />
                  <span style={{ fontFamily: 'var(--font-brand)' }} className="text-3xl md:text-4xl font-semibold tracking-[0.12em] text-foreground uppercase group-hover:text-brand transition-colors leading-none">
                    TZOLKIN
                  </span>
                </div>
              </Link>
              <p className="mt-6 text-lg max-w-md leading-relaxed">
                Software house que desenha, cria e evolui produtos digitais com IA: CRMs, agentes, lojas e marketplaces, com segurança, infraestrutura dedicada e código limpo.
              </p>
            </div>

          </div>

          {/* Links Section */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-12 md:pl-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-8">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-lg text-foreground/70 hover:text-foreground transition-colors inline-block relative group"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="ml-1.5 align-super text-[10px] font-semibold tracking-widest text-brand inline-flex whitespace-nowrap">
                            {link.badge}
                          </span>
                        )}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-foreground/10 text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {currentYear} TZOLKIN. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-foreground/50">
            <span>Política de privacidade</span>
            <span>·</span>
            <span>Termos de uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

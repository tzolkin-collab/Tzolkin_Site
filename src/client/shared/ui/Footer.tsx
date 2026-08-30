"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TzolkinLogo } from "./TzolkinLogo";
import { appendTzolkinUtm } from "@/client/shared/utils/utm";

type FooterLink = { label: string; href: string; badge?: string };

// Pontual & Ecossistema de Serviços
const pontualLinks: FooterLink[] = [
  { label: "Serviços", href: "/servicos" },
  { label: "Landing Pages & Sites", href: appendTzolkinUtm("https://sites.tzolkin.cloud") },
  { label: "E-commerce Global", href: appendTzolkinUtm("https://ecom.tzolkin.cloud") },
  { label: "Tracking de funil", href: "/servicos/tagueamento-de-fluxo" },
];

const tzolkinLinks: FooterLink[] = [
  { label: "Cases", href: "/#cases" },
  { label: "Catálogo Geral", href: "/catalogo" },
];

const contatoLinks: FooterLink[] = [
  { label: "Iniciar projeto", href: "/forms" },
  { label: "contato@tzolkin.com.br", href: "mailto:contato@tzolkin.com.br" },
  // { label: "Consultor virtual", href: "/consultor" }, // Em breve — Enterprise
];

const footerColumns: { title: string; links: FooterLink[] }[] = [
  { title: "Serviços", links: pontualLinks },
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
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="mb-12">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-5 py-4">
                  <TzolkinLogo size={68} className="transition-transform duration-300 group-hover:scale-105" />
                  <span className="text-4xl md:text-6xl font-bold tracking-widest text-foreground uppercase group-hover:text-brand transition-colors">
                    Tzolkin
                  </span>
                </div>
              </Link>
              <p className="mt-6 text-lg max-w-md leading-relaxed">
                Sites, lojas, tracking de funil e software sob medida. Tecnologia para vender, medir e conectar a operação da sua empresa.
              </p>
            </div>

            <Link
              href="/forms"
              className="inline-flex items-center gap-2 text-2xl md:text-3xl font-medium hover:text-brand transition-colors group w-fit"
            >
              <span>Vamos conversar?</span>
              <ArrowUpRight className="w-8 h-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
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

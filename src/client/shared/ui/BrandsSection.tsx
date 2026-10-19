'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, X, Network, FileText, Activity } from 'lucide-react';

interface IntegrationItem {
  name: string;
  svg?: string;
  svgDark?: string;
  /** Logo horizontal (wordmark), renderizado mais largo. */
  wide?: boolean;
  /** Logos escuros ganham um fundo claro no tema escuro. */
  lightTileOnDark?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const integrations: IntegrationItem[] = [
  { name: "Meta", svg: "/integrations/meta.svg" },
  { name: "Utmify", icon: Activity },
  { name: "Google", svg: "/integrations/google.svg" },
  { name: "TikTok", svg: "/integrations/tiktok-light.svg", svgDark: "/integrations/tiktok.svg" },
  { name: "Stripe", svg: "/integrations/stripe.svg" },
  { name: "Shopify", svg: "/integrations/shopify.svg" },
  { name: "API do Pix", svg: "/integrations/pix.svg" },
  { name: "API NFe", icon: FileText },
  { name: "Ideris", svg: "/integrations/ideris.png", wide: true, lightTileOnDark: true },
  { name: "Vercel", svg: "/integrations/vercel.svg", svgDark: "/integrations/vercel-dark.svg" },
  { name: "Cloudflare", svg: "/integrations/cloudflare.svg" },
];

const tile = 'flex aspect-[4/3] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4';

export function BrandsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    // Devolve o foco ao card que abriu o modal
    triggerRef.current?.focus();
  };

  // A11y do modal: fecha com Escape e move o foco para dentro ao abrir
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <section aria-labelledby="integracoes-title" className="border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
          <div className="min-w-0 flex-1 lg:sticky lg:top-24">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <SectionHeader
                id="integracoes-title"
                eyebrow="Integrações"
                title="Integrações com as ferramentas que sua operação já usa."
              />
              <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>Os produtos que construímos se conectam a CRM, meios de pagamento, nota fiscal, marketplaces e plataformas de anúncios.</p>
                <p>Cada integração é listada na proposta, com o serviço externo envolvido e o custo, quando houver.</p>
              </div>
              <Link
                href="/forms"
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar sobre integrações
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          <div className="w-full min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className={tile}
                >
                  {integration.svg ? (
                    <div className="flex h-10 items-center justify-center">
                      {integration.svgDark ? (
                        <>
                          <Image src={integration.svg} alt={`Logo ${integration.name}`} width={40} height={40} className="h-10 w-10 object-contain dark:hidden" />
                          <Image src={integration.svgDark} alt={`Logo ${integration.name}`} width={40} height={40} className="hidden h-10 w-10 object-contain dark:block" />
                        </>
                      ) : integration.wide ? (
                        <Image
                          src={integration.svg}
                          alt={`Logo ${integration.name}`}
                          width={112}
                          height={32}
                          className={`h-8 w-28 object-contain ${integration.lightTileOnDark ? 'dark:rounded-md dark:bg-white dark:px-2' : ''}`}
                        />
                      ) : (
                        <Image src={integration.svg} alt={`Logo ${integration.name}`} width={40} height={40} className="h-10 w-10 object-contain" />
                      )}
                    </div>
                  ) : integration.icon ? (
                    <div className="flex h-10 items-center justify-center text-muted-foreground">
                      <integration.icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                  ) : null}
                  <span className="text-center text-sm font-medium text-muted-foreground">{integration.name}</span>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: integrations.length * 0.03 }}
                className="min-w-0"
              >
                <div
                  ref={triggerRef}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  onClick={openModal}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal();
                    }
                  }}
                  className={`${tile} h-full cursor-pointer border-dashed transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
                >
                  <Plus className="h-8 w-8 text-brand" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-center text-sm font-medium text-foreground">Microsserviços</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="microsservicos-modal-title"
              aria-describedby="microsservicos-modal-desc"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-background p-7 shadow-xl md:p-8"
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Fechar"
                className="absolute right-5 top-5 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-brand">
                  <Network className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 id="microsservicos-modal-title" className="text-xl font-semibold tracking-tight text-foreground">Microsserviços</h3>
              </div>

              <div id="microsservicos-modal-desc" className="space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  <strong className="font-semibold text-foreground">Processamento assíncrono:</strong> quando o projeto pede, separamos tarefas pesadas da aplicação principal com filas e mensageria (por exemplo Redis ou RabbitMQ) e webhooks.
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm md:text-base">
                  <li>Filas para tarefas demoradas, como envio de mensagens e emissão de nota</li>
                  <li>Arquitetura orientada a eventos entre os sistemas conectados</li>
                  <li>Sincronização entre checkout, ERP e back-office conforme o escopo</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

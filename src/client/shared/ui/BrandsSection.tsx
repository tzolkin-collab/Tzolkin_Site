'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/client/shared/ui/Button';
import Link from 'next/link';
import { ArrowRight, Plus, X, Network } from 'lucide-react';

const integrations = [
  "Meta", "Utmify", "Google", "TikTok", "Stripe", "Shopify", "API do Pix", "API NFe", "Ideris", "Vercel", "Cloudflare"
];

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
    <section className="pb-12 bg-background relative overflow-hidden border-t md:py-12 border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-24 items-start">

          {/* Text Content */}
          <div className="flex-1 space-y-8 min-w-0 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Integração é engenharia, <span className="text-brand">não improviso.</span>
              </h2>

              <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  A TZOLKIN constrói pipelines robustos com as plataformas líderes que você já usa — ou que vai precisar.
                </p>
                <p>
                  O resultado: <span className="text-foreground font-semibold">um ecossistema fluido, rastreável e voltado para conversão e controle de dados.</span>
                </p>
              </div>

              <div className="pt-8">
                <Link href="/forms?interesse=consultoria">
                  <Button variant="primary" size="lg" className="px-8 group w-full md:w-auto hover:scale-105">
                    Centralizar minha operação
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Integration Grid */}
          <div className="flex-1 w-full min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="aspect-square min-w-0 bg-card rounded-2xl flex items-center justify-center p-4 md:p-6 hover:bg-brand/10 dark:hover:bg-brand/20 transition-colors group relative overflow-hidden border border-transparent hover:border-brand/40"
                >
                  <span className="font-extrabold text-center text-foreground uppercase tracking-wider md:tracking-widest text-sm md:text-xl break-words transform group-hover:scale-110 transition-transform duration-300">
                    {integration}
                  </span>
                </motion.div>
              ))}

              {/* + Microsserviços Card */}
              <motion.div
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: integrations.length * 0.05 }}
                className="aspect-square min-w-0 bg-brand/10 dark:bg-brand/20 cursor-pointer rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 hover:bg-brand/20 dark:hover:bg-brand/30 transition-colors group relative overflow-hidden border border-brand/50 hover:border-brand shadow-[0_0_15px_rgba(74,33,187,0.2)] dark:shadow-[0_0_15px_rgba(134,112,255,0.25)]"
              >
                <Plus className="w-10 h-10 mb-2 text-brand group-hover:scale-125 transition-transform duration-300" />
                <span className="font-bold text-center text-foreground uppercase tracking-wider md:tracking-widest text-xs md:text-base break-words">
                  Microsserviços
                </span>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Microsserviços Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="microsservicos-modal-title"
              aria-describedby="microsservicos-modal-desc"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border/50 max-w-lg w-full rounded-3xl p-8 relative shadow-2xl overflow-hidden"
            >
              {/* Dynamic Internal Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand/10 via-transparent to-transparent pointer-events-none" />

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Fechar"
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeModal}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
                  <Network className="w-6 h-6" />
                </div>
                <h3 id="microsservicos-modal-title" className="text-2xl font-bold text-foreground">Microsserviços</h3>
              </div>

              <div id="microsservicos-modal-desc" className="space-y-4 text-muted-foreground leading-relaxed relative z-10">
                <p>
                  Desenvolvemos integrações via <strong className="text-foreground">webhooks, mensageria (Redis pub/sub, RabbitMQ) e automações assíncronas</strong> — trânsito de dados estável, sem travar a thread da sua aplicação principal.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-sm md:text-base">
                  <li>Filas assíncronas</li>
                  <li>Arquitetura orientada a eventos</li>
                  <li>Sincronização em tempo real entre a loja e o back-office</li>
                </ul>
              </div>

              <div className="mt-8 relative z-10">
                <Button variant="primary" size="md" onClick={closeModal} className="w-full">
                  Entendi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

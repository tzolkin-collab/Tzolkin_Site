'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import Image from 'next/image';
import { ArrowRight, ChevronUp, Plus, X, Network, FileText } from 'lucide-react';

interface IntegrationItem {
  name: string;
  group: string;
  svg?: string;
  svgDark?: string;
  /** Logo horizontal (wordmark), renderizado mais largo. */
  wide?: boolean;
  /** Logos escuros ganham um fundo claro no tema escuro. */
  lightTileOnDark?: boolean;
  /** Logo preto de um traço só: inverte no tema escuro. */
  mono?: boolean;
  /** Escala óptica (1 = normal) para marcas com muito respiro no arquivo. */
  optical?: number;
  /** Aparece na grade inicial; os demais só em "Ver todas". */
  featured?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

// Logos: svgl.app e Simple Icons (CC0), exceto Utmify e Ideris (arquivos do projeto). Marcas dos respectivos donos,
// usadas só para indicar o que pode ser conectado, sem sugerir parceria.
const I = (n: string) => `/integrations/${n}`;
const integrations: IntegrationItem[] = [
  { name: "Meta", group: "Anúncios e dados", svg: I("meta.svg"), featured: true },
  { name: "Utmify", group: "Anúncios e dados", svg: I("utmify.png"), featured: true },
  { name: "Google", group: "Anúncios e dados", svg: I("google.svg"), featured: true },
  { name: "TikTok", group: "Anúncios e dados", svg: I("tiktok-light.svg"), svgDark: I("tiktok.svg"), featured: true },
  // Suíte Google, serviço por serviço (bloco próprio na seção)
  { name: "Gmail", group: "Suíte Google", svg: I("gmail.svg") },
  { name: "Drive", group: "Suíte Google", svg: I("google-drive.svg") },
  { name: "Agenda", group: "Suíte Google", svg: I("google-calendar.svg") },
  { name: "Planilhas", group: "Suíte Google", svg: I("google-sheets.svg") },
  { name: "Docs", group: "Suíte Google", svg: I("google-docs.svg") },
  { name: "Apresentações", group: "Suíte Google", svg: I("google-slides.svg") },
  { name: "Formulários", group: "Suíte Google", svg: I("google-forms.svg") },
  { name: "Meet", group: "Suíte Google", svg: I("google-meet.svg") },
  { name: "Chat", group: "Suíte Google", svg: I("google-chat.svg") },
  { name: "Tarefas", group: "Suíte Google", svg: I("google-tasks.svg") },
  { name: "Analytics", group: "Suíte Google", svg: I("google-analytics.svg") },
  { name: "Google Ads", group: "Suíte Google", svg: I("google-ads.svg") },
  { name: "Tag Manager", group: "Suíte Google", svg: I("google-tag-manager.svg") },
  { name: "Looker Studio", group: "Suíte Google", svg: I("looker-studio.svg") },
  { name: "BigQuery", group: "Suíte Google", svg: I("bigquery.svg") },
  { name: "Search Console", group: "Suíte Google", svg: I("search-console.svg") },
  { name: "Maps", group: "Suíte Google", svg: I("google-maps.svg") },
  { name: "YouTube", group: "Suíte Google", svg: I("youtube.svg") },
  { name: "Google Cloud", group: "Suíte Google", svg: I("google-cloud.svg") },
  { name: "Firebase", group: "Suíte Google", svg: I("firebase.svg") },
  { name: "WhatsApp", group: "Atendimento e mensagens", svg: I("whatsapp.svg"), featured: true },
  { name: "Instagram", group: "Atendimento e mensagens", svg: I("instagram.svg") },
  { name: "Slack", group: "Atendimento e mensagens", svg: I("slack.svg") },
  { name: "HubSpot", group: "CRMs", svg: I("hubspot.svg") },
  { name: "Salesforce", group: "CRMs", svg: I("salesforce.svg") },
  { name: "Zoho CRM", group: "CRMs", svg: I("zoho.svg") },
  { name: "ClickUp", group: "CRMs", svg: I("clickup.svg") },
  { name: "Trello", group: "CRMs", svg: I("trello.svg") },
  { name: "Asana", group: "CRMs", svg: I("asana.svg") },
  { name: "Airtable", group: "CRMs", svg: I("airtable.svg") },
  { name: "ChatGPT / OpenAI", group: "IA e LLMs", svg: I("openai.svg"), svgDark: I("openai-dark.svg"), featured: true },
  { name: "Claude", group: "IA e LLMs", svg: I("claude.svg"), featured: true },
  { name: "Gemini", group: "IA e LLMs", svg: I("gemini.svg") },
  { name: "Shopify", group: "Canais de venda", svg: I("shopify.svg"), featured: true },
  { name: "Mercado Livre", group: "Canais de venda", svg: I("mercado-livre.svg") },
  { name: "Amazon", group: "Canais de venda", svg: I("amazon.svg"), mono: true },
  { name: "Shopee", group: "Canais de venda", svg: I("shopee.svg"), mono: true },
  { name: "Ideris", group: "Canais de venda", svg: I("ideris.png"), wide: true, lightTileOnDark: true },
  { name: "Stripe", group: "Pagamentos e fiscal", svg: I("stripe.svg"), featured: true },
  { name: "API do Pix", group: "Pagamentos e fiscal", svg: I("pix.svg"), featured: true },
  { name: "Mercado Pago", group: "Pagamentos e fiscal", svg: I("mercado-pago.svg") },
  { name: "API NFe", group: "Pagamentos e fiscal", icon: FileText, featured: true },
  { name: "n8n", group: "Automação", svg: I("n8n.svg") },
  { name: "Zapier", group: "Automação", svg: I("zapier.svg"), mono: true },
  { name: "Notion", group: "Automação", svg: I("notion.svg") },
  { name: "MySQL", group: "Bancos de dados", svg: I("mysql.svg"), optical: 1.45 },
  { name: "PostgreSQL", group: "Bancos de dados", svg: I("postgresql.svg") },
  { name: "MariaDB", group: "Bancos de dados", svg: I("mariadb.svg"), mono: true },
  { name: "MongoDB", group: "Bancos de dados", svg: I("mongodb.svg") },
  { name: "SQLite", group: "Bancos de dados", svg: I("sqlite.svg"), mono: true },
  { name: "Redis", group: "Bancos de dados", svg: I("redis.svg") },
  { name: "Supabase", group: "Bancos de dados", svg: I("supabase.svg") },
  { name: "Go", group: "Linguagens e stacks", svg: I("go.svg"), optical: 1.45 },
  { name: "JavaScript", group: "Linguagens e stacks", svg: I("javascript.svg") },
  { name: "TypeScript", group: "Linguagens e stacks", svg: I("typescript.svg") },
  { name: "Python", group: "Linguagens e stacks", svg: I("python.svg") },
  { name: "Ruby", group: "Linguagens e stacks", svg: I("ruby.svg") },
  { name: "PHP", group: "Linguagens e stacks", svg: I("php.svg") },
  { name: "Java", group: "Linguagens e stacks", svg: I("java.svg"), mono: true },
  { name: "Kotlin", group: "Linguagens e stacks", svg: I("kotlin.svg") },
  { name: "Rust", group: "Linguagens e stacks", svg: I("rust.svg"), mono: true },
  { name: "Node.js", group: "Linguagens e stacks", svg: I("nodejs.svg") },
  { name: "Next.js", group: "Linguagens e stacks", svg: I("nextjs.svg"), mono: true },
  { name: "React", group: "Linguagens e stacks", svg: I("react.svg") },
  { name: "Laravel", group: "Linguagens e stacks", svg: I("laravel.svg") },
  { name: "Rails", group: "Linguagens e stacks", svg: I("rails.svg") },
  { name: "Django", group: "Linguagens e stacks", svg: I("django.svg"), mono: true },
  { name: "GitHub", group: "Infra e código", svg: I("github.svg"), svgDark: I("github-dark.svg") },
  { name: "Vercel", group: "Infra e código", svg: I("vercel.svg"), svgDark: I("vercel-dark.svg") },
  { name: "Cloudflare", group: "Infra e código", svg: I("cloudflare.svg") },
  { name: "Docker", group: "Infra e código", svg: I("docker.svg") },
  { name: "Kubernetes", group: "Infra e código", svg: I("kubernetes.svg") },
  { name: "Terraform", group: "Infra e código", svg: I("terraform.svg") },
];

const featured = integrations.filter((i) => i.featured);
// A Suíte Google abre a lista completa, com todos os serviços; os demais grupos seguem na ordem do arquivo.
const groups = ['Suíte Google', ...Array.from(new Set(integrations.map((i) => i.group))).filter((g) => g !== 'Suíte Google')];

const tile = 'flex aspect-[4/3] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4';

/**
 * Todas as logos com a mesma presença, sem chip: cada marca cabe numa caixa de `size` px (as largas, em uma caixa mais
 * comprida de mesma altura óptica) e é centralizada. Respeita o tema: versão própria para o escuro quando existe, inversão
 * nas marcas de traço único e fundo claro atrás das escuras que não têm variante.
 * `optical` corrige marcas com muito respiro interno no arquivo (o desenho ocupa menos que a caixa).
 */
function Logo({ item, size }: { item: IntegrationItem; size: number }) {
  if (!item.svg) {
    const Icon = item.icon;
    return Icon ? <Icon className="text-brand" strokeWidth={1.6} {...({ style: { width: size, height: size } } as object)} /> : null;
  }
  const alt = `Logo ${item.name}`;
  const scale = item.optical ?? 1;
  // Marca larga: largura de 1,7 caixa, para ter o mesmo peso das quadradas (a Ideris era a maior de todas).
  const w = item.wide ? Math.round(size * 1.7) : size;
  const h = item.wide ? Math.round(size * 1.7 * 0.285) : size;
  const box = { width: w, height: h, transform: scale === 1 ? undefined : `scale(${scale})` };
  const img = (src: string, cls: string) => (
    <Image src={src} alt={alt} width={w} height={h} unoptimized style={box} className={`object-contain ${cls}`} />
  );
  if (item.svgDark) {
    return (
      <span className="flex shrink-0 items-center justify-center" style={{ width: w, height: h }}>
        {img(item.svg, 'dark:hidden')}
        {img(item.svgDark, 'hidden dark:block')}
      </span>
    );
  }
  const extra = [
    item.mono ? 'dark:invert' : '',
    item.lightTileOnDark ? 'dark:rounded-md dark:bg-white dark:px-2' : '',
    item.name === 'Utmify' ? 'rounded-[22%]' : '',
  ].join(' ');
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: w, height: h }}>
      {img(item.svg, extra)}
    </span>
  );
}

export function BrandsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openModal = (opener?: HTMLElement | null) => {
    triggerRef.current = opener ?? null;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Devolve o foco ao elemento que abriu o modal
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
    <section id="integracoes" aria-labelledby="integracoes-title" className="border-y border-border bg-muted/80 dark:bg-white/[0.04] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
          <div className="min-w-0 flex-1 lg:sticky lg:top-24">
            <SectionHeader
              id="integracoes-title"
              eyebrow="Integrações"
              title="Integrações com as ferramentas que sua operação já usa."
            />
            <p className="mt-5 max-w-xl text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">Moldamos o processo para caber na sua operação.</p>
            <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>Os produtos que construímos se conectam a CRM, meios de pagamento, nota fiscal, marketplaces, plataformas de anúncios, mensageria e modelos de IA.</p>
              <p>Cada integração é listada na proposta, com o serviço externo envolvido e o custo, quando houver.</p>
            </div>
          </div>

          <div className="w-full min-w-0 flex-1">
            {!showAll ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {featured.map((integration) => (
                  <div key={integration.name} className={tile}>
                    <div className="flex h-10 items-center justify-center">
                      <Logo item={integration} size={40} />
                    </div>
                    <span className="text-center text-sm font-medium text-muted-foreground">{integration.name}</span>
                  </div>
                ))}

                <button
                  type="button"
                  aria-expanded={false}
                  aria-controls="integracoes-todas"
                  onClick={() => setShowAll(true)}
                  className={`${tile} cursor-pointer border-dashed transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
                >
                  <Plus className="h-8 w-8 text-brand" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-center text-sm font-medium text-foreground">
                    Ver todas
                    <span className="block text-xs font-normal text-muted-foreground">+{integrations.length - featured.length} integrações</span>
                  </span>
                </button>
              </div>
            ) : (
              <div id="integracoes-todas">
                <div className="space-y-8">
                  {groups.map((group) => (
                    <div key={group}>
                      <h3 className="text-sm font-semibold text-foreground">{group}</h3>
                      <ul className="mt-3 grid grid-cols-1 gap-x-8 border-t border-border sm:grid-cols-2">
                        {integrations
                          .filter((i) => i.group === group)
                          .map((integration) => (
                            <li key={integration.name} className="flex min-h-14 items-center gap-4 border-b border-border py-2.5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                                <Logo item={integration} size={28} />
                              </span>
                              <span className="text-[15px] font-medium text-foreground/85">{integration.name}</span>
                            </li>
                          ))}
                        {group === 'Infra e código' && (
                          <li className="flex min-h-14 items-center border-b border-border">
                            <button
                              type="button"
                              aria-haspopup="dialog"
                              onClick={(e) => openModal(e.currentTarget)}
                              className="flex min-h-14 w-full items-center gap-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-brand"><Network className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" /></span>
                              <span className="text-[15px] font-medium text-foreground/85">Microsserviços e filas</span>
                              <ArrowRight className="ml-auto h-4 w-4 text-brand" aria-hidden="true" />
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-muted-foreground">
                  Entre outras. Conte o que a sua operação usa e a gente avalia a conexão.
                </p>
                <button
                  type="button"
                  aria-expanded
                  aria-controls="integracoes-todas"
                  onClick={() => setShowAll(false)}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  Mostrar menos
                </button>
              </div>
            )}
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

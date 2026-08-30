'use client';

import { Zap, BarChart3, Palette, LucideIcon } from 'lucide-react';
import { useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Button } from './Button';

const services = [
  {
    icon: Zap,
    title: "Apresente sua oferta. Facilite a compra.",
    subtitle: "TZOLKIN Sites e Commerce: páginas, sites e lojas com um caminho claro até o contato ou o pedido.",
    description: "Organizamos conteúdo, navegação e experiência mobile em torno da decisão do seu cliente. Formulários, checkout e integrações entram conforme o escopo da entrega.",
    highlights: ["Sites e landing pages", "Lojas e checkout", "Experiência mobile"],
    glow: "from-brand/10 via-transparent to-transparent",
    iconGradient: "from-brand to-brand2",
    color: "var(--brand)"
  },
  {
    icon: BarChart3,
    title: "Entenda onde o funil perde vendas.",
    subtitle: "Tracking de funil vai além do pixel: conecta a origem do contato às etapas comerciais e aos resultados registrados.",
    description: "Mapeamos eventos, UTMs, CRM e pagamentos conforme as ferramentas da sua operação. Do tracking web ao server-side e aos eventos offline, o escopo define o que pode ser medido — sem prometer rastreamento sem perdas.",
    highlights: ["Origem e eventos do site", "Etapas do CRM", "Vendas e pagamentos"],
    glow: "from-brand2/10 via-transparent to-transparent",
    iconGradient: "from-brand2 to-brand",
    color: "var(--brand2)"
  },
  {
    icon: Palette,
    title: "Conecte o que hoje depende de trabalho manual.",
    subtitle: "Software sob medida para processos que não cabem nas ferramentas prontas que você já usa.",
    description: "Integramos sistemas e desenhamos fluxos para a sua rotina: do cadastro à cobrança, do pedido ao acompanhamento. A proposta define integrações, responsabilidades e etapas de entrega.",
    highlights: ["Integrações entre sistemas", "Automações de processos", "Desenvolvimento sob medida"],
    glow: "from-brand/10 via-transparent to-transparent",
    iconGradient: "from-brand to-brand2",
    color: "var(--brand)"
  }
];

const areas = [
  {
    title: "Inteligência artificial",
    description: "Agentes, automações e IA aplicada a processos reais de negócio."
  },
  {
    title: "Cybersecurity",
    description: "Auditoria, hardening e segurança tratada como requisito, não como extra."
  },
  {
    title: "Web design & desenvolvimento",
    description: "Sites, sistemas e PWAs com navegação clara e atenção ao desempenho."
  },
  {
    title: "Dados & integrações",
    description: "APIs, webhooks e analytics conectando cada ponta da sua operação."
  }
];

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  glow: string;
  iconGradient: string;
  color: string;
}

function ServiceCard({ service, index }: { service: ServiceItem, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="sticky"
      style={{ top: `${150 + index * 20}px` }}
    >
      <div
        className="relative group rounded-3xl overflow-hidden p-[2px] shadow-2xl"
        onMouseMove={handleMouseMove}
      >

        {/* LED Border Animation - Desktop (Mouse Follow) */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block pointer-events-none"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                ${service.color},
                transparent 50%
              )
            `,
          }}
        />

        {/* Inner Card */}
        <div className="relative h-full bg-card border border-border rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-14 items-center z-10 overflow-hidden">

          <div className={`absolute inset-0 bg-gradient-to-br ${service.glow} opacity-50 pointer-events-none`} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-50" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-14 w-full items-start md:items-center">
            {/* Left Side */}
            <div className="flex-1 space-y-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.iconGradient} flex items-center justify-center shadow-lg shadow-brand/20`}>
                <service.icon size={28} strokeWidth={1.75} className="text-brand-foreground drop-shadow-md" />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-3 tracking-tight">{service.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-base md:text-lg">
                  {service.subtitle}
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 space-y-6 w-full">
              <p className="text-base md:text-lg text-card-foreground/90 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {service.highlights.map((highlight, hIdx) => (
                  <span
                    key={hIdx}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium bg-foreground/5 border border-border text-foreground"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section className="w-full bg-background py-20 md:py-32 relative z-10" id="services">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter max-w-4xl text-foreground">
            Vender, medir e operar.<br className="hidden md:inline" />
            <span className="text-brand">Por onde começar?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Você não precisa contratar tudo de uma vez. Escolha a frente que resolve sua prioridade; cada projeto tem entregas e limites definidos.
          </p>
        </div>

        <div className="flex flex-col gap-12 relative pb-12">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Áreas de atuação */}
        <div className="mt-4 space-y-8 relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-bold text-foreground"
          >
            A tecnologia entra <span className="text-brand">quando o processo pede.</span>
          </motion.p>

          <div className="flex flex-wrap gap-4">
            {areas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-card border border-border rounded-2xl px-6 py-5 shadow-lg hover:border-brand/50 transition-colors"
              >
                <p className="font-bold text-foreground">{area.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-xs">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center mt-16 relative z-20 space-y-6">
          <Link href="/forms" className="block">
            <Button
              variant="brand"
              size="lg"
              className="px-12 shadow-xl hover:scale-105 transition-transform"
            >
              Conversar sobre meu projeto
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            Conte o que precisa resolver e quais ferramentas sua empresa já usa.
          </p>
        </div>
      </div>
    </section>
  );
}

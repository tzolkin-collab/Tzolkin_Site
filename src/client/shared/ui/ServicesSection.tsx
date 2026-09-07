'use client';

import { Zap, BarChart3, Palette, LucideIcon } from 'lucide-react';
import { useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Button } from './Button';

const services = [
  {
    icon: Zap,
    title: "Páginas e lojas projetadas para a decisão rápida.",
    subtitle: "Menos cliques até o pagamento, zero lentidão no mobile.",
    description: "Criamos sua estrutura de venda pensada para conversão: layouts leves, checkout transparente, VSL sem travamento e copy orientada para o lead agir no primeiro contato.",
    highlights: ["Carregamento < 1.5s", "Checkout Otimizado", "Foco em Conversão Mobile"],
    glow: "from-brand/10 via-transparent to-transparent",
    iconGradient: "from-brand to-brand2",
    color: "var(--brand)"
  },
  {
    icon: BarChart3,
    title: "Pare de pilotar seus anúncios no escuro.",
    subtitle: "Atribuição Server-Side real: da origem da UTM até o dinheiro na conta.",
    description: "O pixel comum do navegador perde até 30% dos dados por bloqueadores e iOS. Nós estruturamos API de Conversões (CAPI) e dados offline via servidor para suas plataformas de tráfego entenderem exatamente quem comprou e de onde veio.",
    highlights: ["Meta CAPI Server-Side", "Google & TikTok Ads", "Auditoria de Gargalos do CRM"],
    glow: "from-brand2/10 via-transparent to-transparent",
    iconGradient: "from-brand2 to-brand",
    color: "var(--brand2)"
  },
  {
    icon: Palette,
    title: "Elimine o trabalho braçal que emperra sua escala.",
    subtitle: "Sistemas e integrações sob medida para o fluxo único da sua empresa.",
    description: "Planilhas duplicadas, dados preenchidos na mão e sistemas isolados custam caro. Construímos automações, APIs, webhooks e painéis sob medida para que seu time foque em vender, não em alimentar software.",
    highlights: ["Integração de APIs e Webhooks", "Painéis e Back-office Custom", "Automação Financeira & CRM"],
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
    <section className="w-full bg-background pt-10 md:py-32 relative z-10" id="services">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-10 space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter max-w-4xl text-foreground">
            O triângulo operacional:<br className="hidden md:inline" />
            <span className="text-brand">Vender. Medir. Conectar.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Você não precisa de um projeto milionário de 6 meses. Ataque o gargalo que está travando o faturamento da sua empresa hoje.
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
            Engenharia aplicada ao <span className="text-brand">resultado financeiro.</span>
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
              Destravar meu gargalo operacional
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            Diagnóstico rápido de escopo via formulário ou conversa direta.
          </p>
        </div>
      </div>
    </section>
  );
}

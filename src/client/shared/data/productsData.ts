export interface ProductShowcaseItem {
  id: string;
  number: string;
  title: string;
  category: string;
  badge: string;
  subdomain: string;
  headline: string;
  description: string;
  features: string[];
  metrics: { label: string; value: string }[];
  ctaText: string;
  ctaHref: string;
  isExternal: boolean;
  techStack: string[];
  image: string;
}

export const productsShowcaseData: ProductShowcaseItem[] = [
  {
    id: 'landing-pages',
    number: '01',
    title: 'Landing Pages & Sites de Conversão',
    category: 'Engenharia de Conversão',
    badge: 'sites.tzolkin.cloud',
    subdomain: 'sites.tzolkin.cloud',
    headline: 'Páginas exclusivas com carregamento sub-segundo e conversão cirúrgica.',
    description: 'Transformamos visitantes em leads e clientes. Design autoral, sem construtores lentos, com infraestrutura Edge e tagueamento avançado de ponta a ponta.',
    features: [
      'Carregamento instantâneo (< 1s) para tráfego pago',
      'Design mobile-first exclusivo e autoral',
      'Hospedagem de alta performance inclusa',
      'Integração nativa com CRMs, Webhooks e WhatsApp'
    ],
    metrics: [
      { label: 'Tempo de Carregamento', value: '< 0.8s' },
      { label: 'Aumento em Conversão', value: '+35%' },
      { label: 'Perda de Tráfego', value: '~0%' }
    ],
    ctaText: 'Ver detalhes do serviço',
    ctaHref: '/servicos/landing-pages-de-conversao',
    isExternal: false,
    techStack: ['Next.js', 'TailwindCSS', 'Edge Runtime', 'Meta CAPI', 'GA4'],
    image: '/products/landing-pages.webp'
  },
  {
    id: 'ecommerce-global',
    number: '02',
    title: 'E-commerce Global Headless',
    category: 'Comércio Eletrônico',
    badge: 'ecom.tzolkin.cloud',
    subdomain: 'ecom.tzolkin.cloud',
    headline: 'Lojas virtuais com arquitetura desacoplada e checkout transparente multi-provedor.',
    description: 'Estruturas de alto volume para marcas que não aceitam limites de catálogo, lentidão em picos de venda ou quedas em campanhas de escala nacional e internacional.',
    features: [
      'Front-end Headless ultrarrápido em Next.js',
      'Checkout transparente com Pix dinâmico e Stripe',
      'Sincronização em tempo real com ERPs e estoques',
      'Módulos nativos de Order Bump, Upsell e One-Click Checkout'
    ],
    metrics: [
      { label: 'Tempo de Resposta', value: '120ms' },
      { label: 'Capacidade Concorrente', value: '50k+ req/s' },
      { label: 'Conversão no Checkout', value: '+28%' }
    ],
    ctaText: 'Ver detalhes do serviço',
    ctaHref: '/servicos/e-commerces-globais',
    isExternal: false,
    techStack: ['Next.js Headless', 'Stripe Connect', 'Edge Cache', 'Redis', 'PostgreSQL'],
    image: '/products/ecommerce.webp'
  },
  {
    id: 'tagueamento-fluxo',
    number: '03',
    title: 'Tagueamento de Fluxo & CAPI',
    category: 'Analytics & Atribuição',
    badge: 'tzolkin.cloud/tracking',
    subdomain: 'tzolkin.cloud',
    headline: 'Rastreamento server-side à prova de adblockers e iOS 14.5+.',
    description: 'Eliminamos os pontos cegos de mídia paga. Configuramos Google Tag Manager Server-Side e Meta Conversions API para recuperar até 95% dos eventos de compra e leads perdidos.',
    features: [
      'GTM Cloud Server-Side e Meta CAPI dedicados',
      'Sincronização de UTMs de ponta a ponta no CRM',
      'Tagueamento unificado de Google Ads, TikTok e GA4',
      'Envio de eventos offline e enriquecimento de dados'
    ],
    metrics: [
      { label: 'Recuperação de Eventos', value: '95%' },
      { label: 'Redução de CPA Médio', value: '-18%' },
      { label: 'Match Quality CAPI', value: '9.4/10' }
    ],
    ctaText: 'Ver detalhes do serviço',
    ctaHref: '/servicos/tagueamento-de-fluxo',
    isExternal: false,
    techStack: ['GTM Server-Side', 'Meta CAPI', 'Google Analytics 4', 'Cloudflare Workers'],
    image: '/products/tracking.webp'
  },
  {
    id: 'pagamentos-pix',
    number: '04',
    title: 'Pagamentos Globais & API Pix Direta',
    category: 'Infraestrutura Financeira',
    badge: 'tzolkin.cloud/payments',
    subdomain: 'tzolkin.cloud',
    headline: 'Cobranças instantâneas com custo operacional mínimo e alcance internacional.',
    description: 'Integrações seguras via APIs bancárias para Pix sem intermediários pesados, além de Stripe Connect para faturamento global em mais de 135 moedas com split automático.',
    features: [
      'API Pix Direta com confirmação em < 3 segundos',
      'Stripe Connect para multi-moeda e marketplace',
      'Split automático de pagamentos e repasses',
      'Webhooks de baixa automática e conciliação bancária'
    ],
    metrics: [
      { label: 'Confirmação Pix', value: '< 2s' },
      { label: 'Moedas Suportadas', value: '135+' },
      { label: 'Taxa de Falha', value: '0.01%' }
    ],
    ctaText: 'Ver detalhes do serviço',
    ctaHref: '/servicos/pagamentos-globais',
    isExternal: false,
    techStack: ['Stripe Connect', 'Pix API (BACEN)', 'PCI-DSS', 'Webhook Queue'],
    image: '/products/payments.webp'
  },
  {
    id: 'sistemas-mensalidade',
    number: '05',
    title: 'Sistemas de Mensalidade & SaaS',
    category: 'Recorrência & Assinaturas',
    badge: 'tzolkin.cloud/saas',
    subdomain: 'tzolkin.cloud',
    headline: 'Motores de recorrência inteligentes com régua de cobrança e portal do assinante.',
    description: 'Plataformas completas para negócios com modelo de assinaturas, academias, barbearias, infoprodutos e SaaS, reduzindo o churn com retentativas automáticas inteligentes.',
    features: [
      'Motor de recorrência multi-método (Cartão, Pix e Boleto)',
      'Régua automatizada de cobrança e recuperação de churn',
      'Portal self-service do assinante com troca de cartão',
      'Relatórios e dashboards com MRR, LTV e Churn Rate'
    ],
    metrics: [
      { label: 'Recuperação de Churn', value: '+34%' },
      { label: 'Automação de Régua', value: '100%' },
      { label: 'Tempo de Implementação', value: '7 dias' }
    ],
    ctaText: 'Ver detalhes do serviço',
    ctaHref: '/servicos/sistemas-de-mensalidade',
    isExternal: false,
    techStack: ['Next.js', 'Stripe Billing', 'WhatsApp API', 'PostgreSQL', 'TailwindCSS'],
    image: '/products/saas.webp'
  }
];

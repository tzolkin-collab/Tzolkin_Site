import { PricingCardProps } from '../ui/PricingCard';
import { appendTzolkinUtm } from '../utils/utm';

export const pricingData: PricingCardProps[] = [
  {
    title: 'Landing Pages de Alta Conversão',
    slug: 'landing-pages-de-conversao',
    ctaText: 'Acessar sites.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://sites.tzolkin.cloud'),
    description: 'Estrutura completa pronta para rodar tráfego: carregamento instantâneo no mobile, VSL sem travar e copy orientada para o lead agir no primeiro contato.',
    features: [
      'Entrega em até 3 dias úteis',
      'Design Mobile-First com carregamento instantâneo',
      'Player VSL modelo VTURB nativo integrado',
      'Formulário Inteligente ou Checkout Transparente',
      'Hospedagem em nuvem de alta velocidade inclusa',
      'Copywriting persuasivo e direto ao ponto',
      'Página de obrigado com disparo de conversão',
      'BÔNUS: Tagueamento GA4 e Pixels de Base inclusos'
    ]
  },
  {
    title: 'Sites Institucionais',
    slug: 'sites-institucionais',
    ctaText: 'Acessar sites.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://sites.tzolkin.cloud'),
    description: 'O hub central da sua marca, feito para transmitir autoridade inquestionável e gerar leads qualificados para seu comercial.',
    features: [
      'Primeiro mês de suporte gratuito',
      'Arquitetura Visual Premium e Original',
      'Multi-páginas (Sobre, Serviços, Portfólio, Contato)',
      'Painel para Gestão Autônoma de Conteúdo (CMS)',
      'Formulário inteligente com integração ao seu CRM',
      'Otimização SEO On-page para indexação no Google',
      'BÔNUS: Tagueamento de Leads (GA4 e Pixels de Base)'
    ]
  },
  {
    title: 'E-commerce Headless Next.js',
    slug: 'e-commerces-globais',
    ctaText: 'Acessar ecom.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://ecom.tzolkin.cloud'),
    dropPrice: 'R$ 10.000',
    price: 'R$ 8.000',
    paymentText: 'Entrada de 50% + 50% na entrega',
    description: 'A infraestrutura de alta velocidade das maiores marcas globais, sem as limitações e lentidões de plataformas convencionais.',
    popular: true,
    features: [
      'Storefront Headless em Next.js (Velocidade Extrema)',
      'Infraestrutura Global via Edge Computing',
      'Checkout Transparente Multi-provedores',
      'Módulos de Upsell de 1-Clique e Order Bump Nativos',
      'Sincronização de Estoque & Back-office via API',
      'Otimização de SEO Técnico para Escala Orgânica',
      'Layouts personalizados de alta conversão',
      'BÔNUS: Tagueamento Completo de E-commerce (GA4 e Pixels)'
    ]
  },
  {
    title: 'Tracking de Funil Server-Side',
    slug: 'tagueamento-de-fluxo',
    dropPrice: 'R$ 3.000',
    price: 'R$ 2.500',
    paymentText: 'Em até 3x no cartão de crédito',
    description: 'Conecte origem do anúncio, contato comercial e dinheiro na conta. Elimine o ponto cego das plataformas de tráfego.',
    features: [
      'Configuração Server-Side (GTM Cloud anti-bloqueador)',
      'Integração direta com Meta Conversions API (CAPI)',
      'Tagueamento Avançado Google Ads e TikTok Ads',
      'Sincronização de Vendas Offline via Webhooks',
      'Auditoria completa de eventos (ViewContent a Purchase)',
      'Configuração Profissional UTMify e CRM',
      'Diagnóstico e eliminação de perdas de atribuição',
      'Validação de dados em tempo real'
    ]
  },
  {
    title: 'Cardápios Virtuais',
    slug: 'cardapios-virtuais',
    dropPrice: 'R$ 2.800',
    price: 'R$ 2.400',
    paymentText: 'Em até 3x no cartão ou Pix R$ 1.900 à vista',
    description: 'Cardápio digital interativo com QR Code, ideal para restaurantes, bares e deliveries que querem modernizar o atendimento.',
    features: [
      'Interface PWA (Acesso Instantâneo sem Download)',
      'Fotos de Alta Qualidade e Descrições Persuasivas',
      'Gestão em Tempo Real de Preços e Disponibilidade',
      'QR Code Dinâmico com Identificação de Mesa',
      'Integração com Pedidos via WhatsApp',
      'Categorias e Filtros por Tags Intuitivas',
      'Design Premium focado em Aumentar o Ticket Médio',
      'Bônus: Treinamento de Gestão da Plataforma'
    ]
  },
  {
    title: 'Pagamentos Globais',
    slug: 'pagamentos-globais',
    price: 'R$ 2.500',
    paymentText: 'Entrada de 50% + 50% na entrega',
    description: 'Integração completa com Stripe Connect para aceitar pagamentos em múltiplas moedas e escalar sua operação internacionalmente.',
    maintenance: {
      percent: '6%',
      tagline: 'Assistência contínua da equipe técnica em tudo que envolve pagamentos.',
      includes: [
        'Assistência técnica para tudo que envolve pagamentos',
        'Rastreio e monitoramento de transações',
        'Suporte por e-mail da equipe técnica',
        'Gestão de webhooks e eventos'
      ]
    },
    features: [
      'Infraestrutura Stripe Connect (Alcance Global)',
      'Checkout Transparente em 135+ Moedas',
      'Split de Pagamento Automático para Parceiros',
      'Gestão de Sellers e Marketplaces Complexos',
      'Compliance PCI-DSS e Antifraude Stripe Radar',
      'Fluxo de Recorrência e Webhooks de Status',
      'Liberação de Pagamentos via API Dinâmica',
      'Bônus: Consultoria de Compliance Financeiro'
    ]
  },
  {
    title: 'API Pix',
    slug: 'api-pix',
    price: 'R$ 1.500',
    paymentText: 'Em até 3x no cartão de crédito',
    description: 'Integração com API Pix para gerar cobranças, QR Codes e confirmações de pagamento. Tarifas e condições dependem da instituição contratada.',
    maintenance: {
      percent: '6%',
      tagline: 'Assistência contínua da equipe técnica em tudo que envolve pagamentos.',
      includes: [
        'Assistência técnica para tudo que envolve pagamentos',
        'Rastreio e monitoramento de transações',
        'Suporte por e-mail da equipe técnica',
        'Gestão de webhooks e eventos'
      ]
    },
    features: [
      'Integração com a instituição de pagamento contratada',
      'Geração de QR Codes Dinâmicos em Tempo Real',
      'Webhook de confirmação para baixa de pagamentos',
      'Conciliação com Bancos (EFÍ, Itaú, BB, Inter)',
      'Automação de Liberação de Acesso Pós-Pagamento',
      'Dashboard Operacional de Vendas Instantâneas',
      'Acompanhamento de cobranças pendentes e pagas',
      'Integração via API REST nativa'
    ]
  },
  {
    title: 'Sistemas de Mensalidade',
    slug: 'sistemas-de-mensalidade',
    price: 'R$ 3.000',
    paymentText: 'Entrada de 50% + 50% na entrega',
    description: 'Plataforma completa de cobranças recorrentes para barbearias, academias, cursos, SaaS e qualquer negócio com assinaturas.',
    maintenance: {
      percent: '6%',
      tagline: 'Assistência contínua da equipe técnica em tudo que envolve pagamentos.',
      includes: [
        'Assistência técnica para tudo que envolve pagamentos',
        'Rastreio e monitoramento de transações',
        'Suporte por e-mail da equipe técnica',
        'Gestão de webhooks e eventos'
      ]
    },
    features: [
      'Motor de Recorrência Multi-método (Cartão/Pix/Boleto)',
      'Régua de Cobrança Automatizada (Email/WhatsApp)',
      'Gestão Estratégica de Planos, Trials e Upgrades',
      'Portal do Assinante Self-Service White-label',
      'Recuperação de Churn Involuntário de Cartão',
      'Relatórios de Métricas Financeiras (MRR, LTV)',
      'Webhook para Sincronização de Status de Assinatura',
      'Bônus: Estratégia de Retenção de Membros'
    ]
  },
  {
    title: 'Solução Personalizada',
    slug: 'solucao-personalizada',
    price: 'Sob Consulta',
    description: 'Desenvolvimento sob medida para necessidades específicas e complexas da sua empresa.',
    features: [
      'Arquitetura de Software Escalável',
      'Integrações via API de Terceiros',
      'Painel Administrativo Customizado',
      'Suporte Técnico Dedicado',
      'Foco Total em Regras de Negócio Únicas',
      'Planejamento de capacidade conforme a demanda',
      'Controles de acesso e proteção de dados definidos no projeto'
    ]
  }
];

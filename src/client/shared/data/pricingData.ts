import { PricingCardProps } from '../ui/PricingCard';
import { appendTzolkinUtm } from '../utils/utm';

export const pricingData: PricingCardProps[] = [
  {
    title: 'Landing Pages de Conversão',
    slug: 'landing-pages-de-conversao',
    ctaText: 'Acessar sites.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://sites.tzolkin.cloud'),
    description: 'Landing pages para apresentar uma oferta e orientar o visitante até o formulário, WhatsApp ou checkout.',
    features: [
      'Hospedagem GRATUITA',
      'Entrega em até 3 dias úteis',
      'Hospedagem de VSL modelo VTURB nativa',
      'Página de obrigado',
      'Formulário Personalizado | Checkout Transparente',
      'Copywriting Direto e Persuasivo',
      'Design Mobile-First Exclusivo',
      'Otimização de carregamento e experiência mobile',
      'Bônus: Tagueamento (GA4 e Pixels de Base)'
    ]
  },
  {
    title: 'Sites Institucionais',
    slug: 'sites-institucionais',
    ctaText: 'Acessar sites.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://sites.tzolkin.cloud'),
    description: 'O hub central da sua marca, feito para transmitir autoridade e confiança instantânea ao mercado.',
    features: [
      'Suporte primeiro mês gratuito',
      'Integração personalizada com CRMs',
      'Arquitetura Visual Premium e Original',
      'Multi-páginas (Sobre, Serviços, Portfólio)',
      'Painel para Gestão de Conteúdo (CMS)',
      'Formulário inteligente com integração ao seu CRM',
      'Otimização SEO On-page para o Google',
      'Bônus: Tagueamento (GA4 e Pixels de Base)'
    ]
  },
  {
    title: 'E-commerce global',
    slug: 'e-commerces-globais',
    ctaText: 'Acessar ecom.tzolkin.cloud',
    ctaHref: appendTzolkinUtm('https://ecom.tzolkin.cloud'),
    dropPrice: 'R$ 10.000',
    price: 'R$ 8.000',
    paymentText: 'Entrada de 50% + 50% na entrega',
    description: 'Estruturação avançada de lojas escaláveis de alcance global (Dropshipping ou Operação Tradicional).',
    popular: true,
    features: [
      'Storefront Headless em Next.js (Velocidade Extrema)',
      'Infraestrutura Global via Edge Computing',
      'Checkout Transparente Multi-provedores',
      'Layouts Personalizados de Alta Conversão',
      'Sincronização de Estoque & Back-office',
      'Otimização de SEO para Escala Orgânica',
      'Módulos de Upsell e Order Bump Nativos',
      'Bônus: Tagueamento Completo (GA4 e Pixels)'
    ]
  },
  {
    title: 'Tracking de Funil',
    slug: 'tagueamento-de-fluxo',
    dropPrice: 'R$ 3.000',
    price: 'R$ 2.500',
    paymentText: 'Em até 3x no cartão de crédito',
    description: 'Conecte origem, contato, etapas comerciais e venda. O tracking web é uma camada; CRM, eventos offline e pagamentos ampliam a leitura conforme o escopo.',
    features: [
      'Auditoria de Eventos: De ViewContent a Purchase',
      'Configuração Server-Side (GTM Cloud)',
      'Integração com Meta Conversions API (CAPI)',
      'Tagueamento Avançado para Google e TikTok Ads',
      'Sincronização de Dados Off-line via Webhooks',
      'Validação de eventos e diagnóstico de perdas de atribuição',
      'Monitoramento de Fluxo em Tempo Real',
      'Configuração Profissional UTMify / GTM'
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

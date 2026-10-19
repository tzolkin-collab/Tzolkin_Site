/**
 * Conteúdo da home reposicionada (software house de produtos digitais com IA).
 * Mantido separado de servicesData/pricingData, que alimentam /servicos e os formulários.
 */

export interface ApplicationItem {
  slug: string;
  title: string;
  audience: string;
  /** Frase curta de para-quem usada nos cartoes do bento. */
  forWho: string;
  delivers: string;
  chips: string[];
  ctaText: string;
  href: string;
}

// Os hrefs dependem de /crm-com-ia e de /forms (parâmetro `aplicacao`).
export const applications: ApplicationItem[] = [
  {
    slug: 'crm-com-ia',
    forWho: 'Para times comerciais e de atendimento com contexto espalhado.',
    title: 'CRM com IA para comercial e atendimento',
    audience:
      'Times comerciais e de atendimento que hoje dividem contexto entre planilhas, WhatsApp e ferramentas soltas.',
    delivers:
      'Funil de vendas e histórico de atendimento no mesmo lugar, com IA apoiando triagem, resumo de conversas e definição do próximo passo.',
    chips: ['Funil de vendas', 'Histórico de atendimento', 'Triagem e resumo com IA'],
    ctaText: 'Conhecer o CRM com IA',
    href: '/crm-com-ia',
  },
  {
    slug: 'agentes-ia',
    forWho: 'Para quem recebe muitos contatos por WhatsApp, chat ou telefone.',
    title: 'Agentes de IA para mensagens e voz',
    audience: 'Empresas com volume recorrente de contatos por WhatsApp, chat ou telefone.',
    delivers:
      'Agentes que respondem, qualificam e encaminham para uma pessoa quando necessário, ligados ao seu CRM e aos seus sistemas.',
    chips: ['WhatsApp, chat e voz', 'Qualificação', 'Encaminha a uma pessoa'],
    ctaText: 'Conversar sobre agentes',
    href: '/forms?aplicacao=agentes-ia',
  },
  {
    slug: 'ecommerce-marketplace',
    forWho: 'Para marcas que vendem online em mais de um canal.',
    title: 'E-commerce e marketplaces',
    audience:
      'Marcas que vendem online e precisam de loja própria, tema Shopify ou pedidos de marketplaces no mesmo fluxo.',
    delivers:
      'Loja ou tema Shopify no ar, com catálogo, estoque e pedidos integrados aos canais de venda que você usa.',
    chips: ['Loja ou tema Shopify', 'Catálogo e estoque', 'Pedidos de marketplaces'],
    ctaText: 'Conversar sobre minha loja',
    href: '/forms?aplicacao=ecommerce-marketplace',
  },
  {
    slug: 'fiscal',
    forWho: 'Para operações que emitem nota fiscal na mão.',
    title: 'Automação fiscal',
    audience: 'Operações que emitem nota fiscal manualmente ou a partir de várias fontes de pedido.',
    delivers:
      'Emissão automática de nota fiscal a partir do pedido, com registro de cada emissão e tratamento das que falham.',
    chips: ['Emissão automática', 'Registro de cada emissão', 'Tratamento de falhas'],
    ctaText: 'Conversar sobre nota fiscal',
    href: '/forms?aplicacao=fiscal',
  },
  {
    slug: 'piloto',
    forWho: 'Para quem já tem um protótipo ou MVP e precisa da próxima versão.',
    title: 'Evoluir um piloto existente',
    audience:
      'Quem já tem um protótipo, um MVP ou um sistema funcionando em parte, inclusive criado com ferramentas de IA.',
    delivers:
      'Revisão do que existe, correção dos pontos críticos e uma próxima versão com repositório, documentação e testes.',
    chips: ['Revisão do que existe', 'Repositório e documentação', 'Testes'],
    ctaText: 'Conversar sobre meu piloto',
    href: '/forms?aplicacao=piloto',
  },
];

export interface CommitmentItem {
  title: string;
  summary: string;
  deliverables: string[];
}

// Descreve o que é entregue. Sem promessa de certificação.
export const buildCommitments: CommitmentItem[] = [
  {
    title: 'Cibersegurança aplicada',
    summary: 'Segurança definida no desenho do produto: quem acessa quais dados e quais ações.',
    deliverables: [
      'Perfis e permissões documentados por tipo de usuário',
      'Segredos e credenciais fora do código, em variáveis de ambiente ou cofre',
      'Trilha de acesso para ações sensíveis',
    ],
  },
  {
    title: 'Infraestrutura dedicada',
    summary: 'Um ambiente próprio para o seu projeto, com o que é de quem deixado explícito.',
    deliverables: [
      'Lista dos recursos usados (hospedagem, banco, filas, domínio)',
      'Custos de infraestrutura e de serviços externos discriminados na proposta',
      'Responsabilidades de operação separadas entre a TZOLKIN e o cliente',
    ],
  },
  {
    title: 'Código limpo',
    summary: 'Você recebe o produto de um jeito que outra equipe consegue manter.',
    deliverables: [
      'Repositório em nome do cliente',
      'Documentação de instalação, arquitetura e operação',
      'Testes nos fluxos críticos',
      'Handoff ao final do ciclo',
    ],
  },
];

export interface ContractSuite {
  slug: 'recorte' | 'integrada' | 'completa';
  name: string;
  summary: string;
  scope: string;
  integrations: string;
  followUp: string;
  ctaText: string;
  href: string;
  highlight?: boolean;
}

// Decisão do PO: preços NÃO são exibidos no site; o valor é apresentado na proposta.
// Os textos de escopo/integrações/acompanhamento são rascunho a validar pelo PO.
// TODO(PO): quarta faixa pendente (nome ainda não definido). Não inventar.
export const contractSuites: ContractSuite[] = [
  {
    slug: 'recorte',
    name: 'Recorte',
    summary: 'Um recorte pequeno sobre uma base que já existe.',
    scope: 'Um módulo, ajuste ou evolução delimitado, sobre um sistema ou piloto existente.',
    integrations: 'Integrações pontuais, listadas na proposta.',
    followUp: 'Entregas combinadas por etapa ao longo dos dois meses.',
    ctaText: 'Quero um recorte',
    href: '/forms?suite=recorte',
  },
  {
    slug: 'integrada',
    name: 'Integrada',
    summary: 'Uma aplicação em produção, conectada ao que ela precisa.',
    scope: 'Uma das aplicações desta página, do desenho à entrada em funcionamento.',
    integrations:
      'Integração com os sistemas da operação (CRM, pagamentos, nota fiscal, canais de mensagem), conforme o escopo.',
    followUp: 'Acompanhamento durante os dois meses e handoff ao final.',
    ctaText: 'Quero a suíte Integrada',
    href: '/forms?suite=integrada',
    highlight: true,
  },
  {
    slug: 'completa',
    name: 'Completa',
    summary: 'Escopo amplo, com mais de uma frente no mesmo ciclo.',
    scope: 'Duas ou mais aplicações conectadas entre si, ou um produto de escopo mais amplo.',
    integrations: 'Integrações em maior número e profundidade, definidas no escopo.',
    followUp: 'Acompanhamento próximo durante os dois meses e handoff ao final.',
    ctaText: 'Quero a suíte Completa',
    href: '/forms?suite=completa',
  },
];

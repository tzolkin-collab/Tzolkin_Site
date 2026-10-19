export const CTA_HREF = "/forms?aplicacao=crm-ia&suite=integrada";
export const CTA_LABEL = "Quero meu CRM com IA";
export const PRICE_LINE =
  "Suíte Integrada: dois meses de trabalho. O valor é apresentado na proposta, com infraestrutura e serviços externos discriminados.";

export const forWho = [
  "Equipe comercial que recebe contatos por WhatsApp, formulário e anúncios e perde o contexto de cada conversa.",
  "Quem hoje depende de planilhas, prints e memória para saber quem atende quem, e em que ponto está cada oportunidade.",
  "Empresas que investem em anúncios e não conseguem ligar o contato recebido ao responsável que deu andamento.",
];

export const notForWho = [
  "Quem só quer trocar de planilha por uma ferramenta de lista, sem mudar o processo de atendimento.",
  "Quem já tem um CRM funcionando bem e com o contexto organizado. Nesse caso, provavelmente não precisa de um novo.",
  "Quem busca uma plataforma pronta, de assinatura, para começar hoje. Aqui o trabalho é construído para a sua operação, em dois meses.",
];

export const flowSteps = [
  { title: "Entrada", text: "Formulário, WhatsApp ou anúncio" },
  { title: "IA organiza o contexto", text: "Resume origem, interesse e histórico" },
  { title: "Registro no CRM", text: "Dados salvos de forma estruturada" },
  { title: "Encaminha ao responsável", text: "Quem vai atender é avisado" },
  { title: "Acompanhamento", text: "Status e próximos passos visíveis" },
];

export const months = [
  {
    label: "Mês 1",
    title: "Fundação e primeiro fluxo",
    items: [
      {
        deliverable: "Mapeamento das origens de contato e das regras de encaminhamento",
        accept: "Documento aprovado por você, com cada origem e cada responsável listados",
      },
      {
        deliverable: "CRM em infraestrutura dedicada, com acesso por perfil",
        accept: "Você e sua equipe entram com login próprio; cada perfil vê só o que foi definido",
      },
      {
        deliverable: "Primeira entrada ligada ao CRM (a combinar na proposta: formulário, WhatsApp ou anúncio)",
        accept: "Um contato de teste chega ao CRM com origem e dados preenchidos, sem digitação manual",
      },
    ],
  },
  {
    label: "Mês 2",
    title: "IA, encaminhamento e entrega",
    items: [
      {
        deliverable: "IA que organiza o contexto de cada oportunidade",
        accept: "Em um conjunto de casos reais combinado com você, o resumo registrado bate com a conversa original; falhas ficam listadas",
      },
      {
        deliverable: "Encaminhamento ao responsável e acompanhamento de status",
        accept: "O responsável definido é avisado e o status muda no CRM, verificado em teste ponta a ponta",
      },
      {
        deliverable: "Repositório, documentação e handoff",
        accept: "Repositório em nome do cliente, documentação revisada e sessão de passagem realizada",
      },
    ],
  },
];

export const notIncluded = [
  "Módulos extras além dos descritos na proposta (por exemplo, financeiro, estoque ou emissão de notas).",
  "Integrações fora do escopo acordado na proposta.",
  "Custos de terceiros pagos à parte: volume de mensagens (WhatsApp), uso de IA, hospedagem e demais infraestruturas, discriminados na proposta.",
  "Migração de bases históricas extensas, salvo se constar na proposta.",
];

export const howWeBuild = [
  {
    title: "Cibersegurança aplicada",
    text: "Acesso por perfil, segredos fora do código, dados em trânsito protegidos e revisão de segurança antes da entrega. O que foi verificado fica descrito na documentação.",
  },
  {
    title: "Infraestrutura dedicada",
    text: "O seu CRM roda em ambiente separado, sem dividir banco de dados com outros clientes.",
  },
  {
    title: "Código limpo e documentado",
    text: "Código organizado, com instruções para instalar, configurar e operar. Quem assumir depois consegue entender o que existe.",
  },
  {
    title: "Entrega concreta",
    text: "Repositório em nome do cliente, documentação e uma sessão de handoff. Você não fica dependente de nós para ter acesso ao que pagou.",
  },
];

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "Quanto custa?",
    a: "O valor da Suíte Integrada é apresentado na proposta, conforme o escopo, e cobre dois meses de trabalho. Infraestrutura e serviços externos (hospedagem, mensagens, uso de IA) são discriminados na proposta, porque dependem do seu volume.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    // TODO(PO): confirmar condição de prazo (ex.: contagem a partir do kickoff e dos acessos liberados).
    a: "Dois meses, divididos em mês 1 e mês 2 como descrito acima. O prazo depende de você disponibilizar acessos e validar as etapas.",
  },
  {
    q: "E os dados e a LGPD?",
    // TODO(PO): validar com jurídico o texto de LGPD (operador/controlador, contrato de tratamento, localização dos dados, provedor de IA).
    a: "Os dados ficam em infraestrutura dedicada ao seu projeto e o acesso é por perfil. A forma de tratamento, o papel de cada parte e os provedores usados são descritos na proposta.",
  },
  {
    q: "Com quais sistemas integra?",
    // TODO(PO): listar integrações padrão suportadas (WhatsApp, Meta Lead Ads, Google Ads, formulários etc.) quando confirmadas.
    a: "As integrações ficam definidas na proposta, conforme a sua operação. O que estiver fora do escopo acordado não está incluído e pode ser orçado à parte.",
  },
  {
    q: "E se eu já tenho um CRM?",
    // TODO(PO): definir se a oferta cobre integrar a CRM existente (ex.: RD, HubSpot, Pipedrive) ou apenas substituir.
    a: "Se o seu CRM já resolve e a equipe o usa bem, talvez você não precise de outro. Se ele existe, mas o contexto se perde antes de chegar nele, avaliamos na conversa se faz sentido trocar ou conectar.",
  },
  {
    q: "O que acontece depois dos dois meses?",
    a: "Você pode operar sozinho, contratar manutenção delimitada ou sustentação. Os valores da manutenção e da sustentação são definidos na proposta.",
  },
  {
    q: "Posso ver funcionando antes de contratar?",
    // TODO(PO): demo real; ajustar esta resposta quando existir.
    a: "Ainda não temos uma demonstração pública. Você pode pedir uma demonstração do fluxo e conversamos sobre o seu caso.",
  },
];

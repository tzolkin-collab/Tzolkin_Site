export interface LeadProfile {
  name?: string;
  company?: string;
  segment?: string;
  service?: string;
  budgetOrStage?: string;
  email?: string;
  whatsapp?: string;
  summary?: string;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  serviceSlug?: string;
}

export const CONSULTOR_INFO = {
  title: 'Consultor TZOLKIN',
  subtitle: 'Soluções de Conversão e Engenharia Sob Medida',
  welcome: 'Olá! Sou o Consultor de Software da TZOLKIN. Auxilio na definição de arquitetura, prazos e escopos — desde Landing Pages em 3 dias e Tracking Server-Side até plataformas e microsserviços complexos.\n\nQual é o principal desafio ou software que sua empresa precisa desenvolver?',
  quickPrompts: [
    {
      id: 'lp',
      label: 'Landing Page em 3 dias',
      prompt: 'Preciso de uma Landing Page de alta conversão entregue em até 3 dias úteis.',
      serviceSlug: 'landing-pages-de-conversao'
    },
    {
      id: 'tracking',
      label: 'Tracking Server-Side',
      prompt: 'Quero implementar Tracking Server-Side (Meta CAPI e GA4) para eliminar perdas de dados.',
      serviceSlug: 'tagueamento-de-fluxo'
    },
    {
      id: 'ecom',
      label: 'E-commerce Headless',
      prompt: 'Quero uma loja virtual ultra-rápida em Next.js com checkout transparente.',
      serviceSlug: 'e-commerces-globais'
    },
    {
      id: 'custom',
      label: 'Software Sob Medida',
      prompt: 'Minha empresa precisa de um sistema personalizado para automação de processos e integração de APIs.',
      serviceSlug: 'solucao-personalizada'
    }
  ]
};

export function buildWhatsAppUrl(lead: LeadProfile, targetPhone?: string): string {
  const phone = targetPhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5531998522304';
  
  const text = `SOLICITACAO DE PROJETO - CONSULTORIA TZOLKIN
----------------------------------------
Cliente: ${lead.name || 'A definir'}
Empresa / Segmento: ${lead.company || lead.segment || 'Em analise'}
Solucao de Interesse: ${lead.service || 'Diagnostico de software'}
Momento / Porte: ${lead.budgetOrStage || 'A combinar'}
${lead.email ? `E-mail: ${lead.email}\n` : ''}${lead.summary ? `Resumo da demanda: ${lead.summary}\n` : ''}----------------------------------------
Ola! Gostaria de dar sequencia ao atendimento do meu projeto com a equipe tecnica da TZOLKIN.`;

  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export function extractLeadInfo(text: string, current: LeadProfile): LeadProfile {
  const updated = { ...current };
  const lower = text.toLowerCase();

  // Detecta email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !updated.email) {
    updated.email = emailMatch[0];
  }

  // Detecta telefone / WhatsApp
  const phoneMatch = text.match(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}[-\s]?\d{4}|\d{4}[-\s]?\d{4})/);
  if (phoneMatch && !updated.whatsapp) {
    updated.whatsapp = phoneMatch[0];
  }

  // Detecta servico
  if (lower.includes('landing page') || lower.includes('lp')) {
    updated.service = 'Landing Pages de Alta Conversão';
  } else if (lower.includes('tracking') || lower.includes('tagueamento') || lower.includes('pixel') || lower.includes('capi')) {
    updated.service = 'Tracking de Funil Server-Side';
  } else if (lower.includes('e-commerce') || lower.includes('loja') || lower.includes('dropshipping')) {
    updated.service = 'E-commerce Headless Next.js';
  } else if (lower.includes('pix')) {
    updated.service = 'API Pix';
  } else if (lower.includes('mensalidade') || lower.includes('assinatura') || lower.includes('recorrência')) {
    updated.service = 'Sistemas de Mensalidade';
  } else if (lower.includes('sob medida') || lower.includes('sistema') || lower.includes('personalizado') || lower.includes('microsserviço') || lower.includes('integração')) {
    updated.service = 'Solução Personalizada';
  }

  return updated;
}

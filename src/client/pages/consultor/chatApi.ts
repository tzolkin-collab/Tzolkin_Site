export interface ChatApiResponse {
  sessionId: string;
  reply: string;
  serviceCards: Array<{ slug: string; reason: string }>;
  leadData: Record<string, string> | null;
}

export interface SessionData {
  session: {
    id: string;
    createdAt: string;
    leadData?: Record<string, string>;
  };
  messages: Array<{ role: string; content: string }>;
}

export async function sendMessage(sessionId: string | null, message: string): Promise<ChatApiResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fallback local ativado para chat:', err);
  }

  // Fallback seguro que nunca rejeita a promise
  return {
    sessionId: sessionId || crypto.randomUUID(),
    reply: 'Compreendido. Registrei as informações principais do seu projeto. Clique no botão abaixo para dar sequência diretamente no WhatsApp com a equipe técnica da TZOLKIN.',
    serviceCards: [],
    leadData: null,
  };
}

export async function getSession(sessionId: string): Promise<SessionData> {
  return {
    session: {
      id: sessionId,
      createdAt: new Date().toISOString(),
    },
    messages: [],
  };
}

export async function saveLead(data: {
  sessionId: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  company?: string;
  service?: string;
}): Promise<void> {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.name || 'Lead Chat',
        email: data.email || 'contato@cliente.com',
        whatsapp: data.whatsapp || 'Não informado',
        companyName: data.company || 'Não informada',
        service: data.service || 'Consultoria Geral',
        message: `Lead via chat: ${data.sessionId}`,
      }),
    });
  } catch {
    // Ignora erro de rede em background
  }
}

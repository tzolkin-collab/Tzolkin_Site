export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5531997599216';

export interface WhatsAppSummary {
  name?: string;
  application?: string;
  suite?: string;
  stage?: string;
  message?: string;
}

const MAX_MESSAGE = 600;

export function buildWhatsAppUrl(summary: WhatsAppSummary = {}, number: string = WHATSAPP_NUMBER): string {
  const lines = ['Olá! Acabei de enviar meu projeto pelo site da TZOLKIN.'];
  if (summary.name) lines.push(`Nome: ${summary.name}`);
  if (summary.application) lines.push(`Aplicação: ${summary.application}`);
  if (summary.suite) lines.push(`Suíte: ${summary.suite}`);
  if (summary.stage) lines.push(`Estágio: ${summary.stage}`);
  const msg = (summary.message ?? '').trim();
  if (msg) lines.push(`Projeto: ${msg.length > MAX_MESSAGE ? msg.slice(0, MAX_MESSAGE).trimEnd() + '…' : msg}`);
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`;
}

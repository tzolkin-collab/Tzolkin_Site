'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/client/shared/ui/Button';
import { LeadProfile, buildWhatsAppUrl } from './QualificationEngine';
import { readAttribution } from '@/client/shared/utils/attribution';

interface LeadSummaryCardProps {
  lead: LeadProfile;
  onUpdateLead?: (lead: LeadProfile) => void;
}

export function LeadSummaryCard({ lead, onUpdateLead }: LeadSummaryCardProps) {
  const [emailInput, setEmailInput] = useState(lead.email || '');
  const [nameInput, setNameInput] = useState(lead.name || '');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  // A mesma chave em tentativas seguidas: o Core não duplica o lead se o primeiro envio chegou.
  const submissionKey = useRef<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const whatsappUrl = buildWhatsAppUrl({
    ...lead,
    name: nameInput || lead.name,
    email: emailInput || lead.email
  });

  const handleSendEmailBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSendingEmail(true);
    setEmailError('');
    try {
      submissionKey.current ??= crypto.randomUUID();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submissionKey.current },
        body: JSON.stringify({
          fullName: nameInput || 'Lead Consultor',
          email: emailInput,
          whatsapp: lead.whatsapp || '',
          companyName: lead.company || '',
          // O serviço que a IA identificou é texto livre e o servidor só aceita a lista oficial:
          // vai na mensagem, e o serviço fica "Outro" até a equipe classificar.
          service: 'Outro',
          message: `Bundle gerado via Consultor IA (serviço de interesse: ${lead.service || 'não definido'}): ${lead.summary || 'Interesse identificado'}`,
          attribution: readAttribution(),
        })
      });
      if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        throw new Error(erro.message || 'Não foi possível enviar agora. Tente novamente.');
      }
      setEmailSent(true);
      if (onUpdateLead) {
        onUpdateLead({ ...lead, email: emailInput, name: nameInput });
      }
    } catch (error) {
      // Antes isto marcava "enviado" mesmo com falha, e o lead se perdia sem ninguém saber.
      setEmailError(error instanceof Error ? error.message : 'Não foi possível enviar agora. Tente novamente.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto my-3 p-5 md:p-6 rounded-2xl bg-card border border-brand/40 shadow-xl shadow-brand/5 relative overflow-hidden"
    >
      {/* Header do Card */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm md:text-base">Ficha de Projeto Gerada</h4>
            <p className="text-[11px] text-muted-foreground">Pronta para envio ao consultor</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/30">
          Qualificado
        </span>
      </div>

      {/* Detalhes da Ficha */}
      <div className="space-y-2 mb-5 text-xs md:text-sm">
        <div className="flex justify-between items-center py-1 border-b border-border/40 text-muted-foreground">
          <span>Solução Recomendada:</span>
          <strong className="text-foreground font-semibold">{lead.service || 'Diagnóstico Personalizado'}</strong>
        </div>
        {lead.company && (
          <div className="flex justify-between items-center py-1 border-b border-border/40 text-muted-foreground">
            <span>Empresa / Segmento:</span>
            <strong className="text-foreground font-semibold">{lead.company}</strong>
          </div>
        )}
        <div className="flex justify-between items-center py-1 border-b border-border/40 text-muted-foreground">
          <span>Atendimento:</span>
          <strong className="text-emerald-500 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Especialista Disponível
          </strong>
        </div>
      </div>

      {/* Botão de WhatsApp Principal */}
      <div className="space-y-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 group"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Falar no WhatsApp com o Consultor</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>

        {/* Opção de E-mail Bundle */}
        {!showEmailForm && !emailSent && (
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className="w-full py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Prefere receber a proposta por e-mail? Clique aqui</span>
          </button>
        )}

        {showEmailForm && !emailSent && (
          <form onSubmit={handleSendEmailBundle} className="pt-2.5 border-t border-border/50 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Digite seu melhor e-mail..."
                className="flex-1 px-3 py-2 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-xs text-foreground"
              />
              <Button
                type="submit"
                disabled={isSendingEmail}
                variant="brand"
                size="sm"
                className="whitespace-nowrap px-3 py-2 h-auto rounded-xl text-xs"
              >
                {isSendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Salvar Proposta'}
              </Button>
            </div>
            {emailError && (
              <p role="alert" className="text-[11px] text-red-500 text-center">{emailError}</p>
            )}
            <p className="text-[10px] text-muted-foreground text-center">
              Enviaremos o resumo completo por e-mail e manteremos o link do WhatsApp ativo.
            </p>
          </form>
        )}

        {emailSent && (
          <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-between text-xs text-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
              Proposta salva com sucesso.
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand hover:underline flex items-center gap-1"
            >
              Agilizar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

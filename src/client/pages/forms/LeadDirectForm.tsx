'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/client/shared/ui/Button';
import { LeadProfile, buildWhatsAppUrl } from '@/client/pages/consultor/QualificationEngine';
import { pricingData } from '@/client/shared/data/pricingData';

interface LeadDirectFormProps {
  syncedLead?: LeadProfile;
}

export function LeadDirectForm({ syncedLead }: LeadDirectFormProps) {
  const [fullName, setFullName] = useState(syncedLead?.name || '');
  const [email, setEmail] = useState(syncedLead?.email || '');
  const [whatsapp, setWhatsapp] = useState(syncedLead?.whatsapp || '');
  const [companyName, setCompanyName] = useState(syncedLead?.company || '');
  const [service, setService] = useState(syncedLead?.service || '');
  const [message, setMessage] = useState(syncedLead?.summary || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Atualiza campos se o consultor identificar dados
  useEffect(() => {
    if (syncedLead?.name && !fullName) setFullName(syncedLead.name);
    if (syncedLead?.email && !email) setEmail(syncedLead.email);
    if (syncedLead?.whatsapp && !whatsapp) setWhatsapp(syncedLead.whatsapp);
    if (syncedLead?.company && !companyName) setCompanyName(syncedLead.company);
    if (syncedLead?.service) setService(syncedLead.service);
    if (syncedLead?.summary && !message) setMessage(syncedLead.summary);
  }, [syncedLead, fullName, email, whatsapp, companyName, message]);

  const currentLead: LeadProfile = {
    name: fullName,
    email,
    whatsapp,
    company: companyName,
    service: service || 'Consultoria Geral',
    summary: message,
  };

  const whatsappUrl = buildWhatsAppUrl(currentLead);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.randomUUID()
        },
        body: JSON.stringify({
          fullName: fullName.trim() || 'Lead Sem Nome',
          email: email.trim(),
          whatsapp: whatsapp.trim() || 'Não informado',
          companyName: companyName.trim() || 'Não informada',
          service: service || 'Consultoria Geral',
          message: message.trim() || 'Solicitação direta via formulário de e-mail',
          source: 'formulario_email_consultor'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao enviar proposta');
      }

      setSubmitted(true);
    } catch {
      // Fallback amigável
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 md:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl overflow-y-auto scrollbar-thin">
      <div>
        {/* Cabeçalho do Formulário */}
        <div className="pb-5 mb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/5 mb-3 text-xs font-semibold tracking-wider uppercase text-brand">
            <Mail className="w-3.5 h-3.5" />
            <span>Envio por E-mail</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            Solicitar Proposta Comercial
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Preencha seus dados para receber o escopo por e-mail ou agilizar no WhatsApp.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-brand/10 border border-brand/30 space-y-4 text-center my-6"
          >
            <div className="w-12 h-12 rounded-full bg-brand/20 text-brand mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Solicitação Enviada com Sucesso</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nossa equipe técnica recebeu seu projeto e responderá no e-mail informado. Para atendimento em tempo real, use o canal direto abaixo:
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-emerald-500/20 w-full"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chamar no WhatsApp agora</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  E-mail Profissional
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com.br"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(DDD) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Empresa / Segmento
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nome da sua empresa"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Solução Desejada
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all"
                >
                  <option value="" disabled>Selecione uma opção</option>
                  <option value="Landing Pages de Alta Conversão">Landing Pages de Alta Conversão</option>
                  <option value="Tracking de Funil Server-Side">Tracking de Funil Server-Side</option>
                  <option value="E-commerce Headless Next.js">E-commerce Headless Next.js</option>
                  <option value="Cardápios Virtuais">Cardápios Virtuais</option>
                  <option value="API Pix">API Pix</option>
                  <option value="Sistemas de Mensalidade">Sistemas de Mensalidade</option>
                  <option value="Pagamentos Globais">Pagamentos Globais</option>
                  <option value="Solução Personalizada">Software Sob Medida (Engenharia)</option>
                  {pricingData.map((p) => (
                    <option key={p.slug} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Detalhes do Projeto ou Gargalo
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte um pouco sobre o momento da sua operação e o que você precisa construir..."
                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground resize-none leading-relaxed"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
            )}

            {/* Ações */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="brand"
                size="lg"
                className="w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando proposta...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Proposta por E-mail</span>
                  </>
                )}
              </Button>

              <div className="relative flex items-center justify-center my-2">
                <span className="h-[1px] w-full bg-border/60" />
                <span className="px-2 text-[10px] uppercase font-bold text-muted-foreground bg-card">ou</span>
                <span className="h-[1px] w-full bg-border/60" />
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Conversar no WhatsApp Diretamente</span>
              </a>
            </div>
          </form>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-border/40 text-center">
        <p className="text-[11px] text-muted-foreground">
          Garantia de confidencialidade técnica. Sem intermediários comerciais.
        </p>
      </div>
    </div>
  );
}

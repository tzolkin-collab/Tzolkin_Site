'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/client/shared/ui/Button';
import { readAttribution } from '@/client/shared/utils/attribution';
import { trackEvent } from '@/client/shared/utils/analytics';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const SERVICES = [
  'CRM com IA', 'Agentes de IA (mensagens e voz)', 'E-commerce e Marketplace',
  'Automação fiscal', 'Evoluir um piloto', 'Outro projeto',
] as const;

const APLICACAO: Record<string, (typeof SERVICES)[number]> = {
  'crm-ia': 'CRM com IA',
  'agentes-ia': 'Agentes de IA (mensagens e voz)',
  'ecommerce-marketplace': 'E-commerce e Marketplace',
  fiscal: 'Automação fiscal',
  piloto: 'Evoluir um piloto',
  outro: 'Outro projeto',
};

const SUITES: Record<string, string> = { recorte: 'Recorte', integrada: 'Integrada', completa: 'Completa' };

const STAGES = ['Só a ideia', 'Tenho um piloto ou protótipo', 'Já opero e quero evoluir'] as const;

const field = 'w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:border-brand outline-none text-sm text-foreground transition-all';
const label = 'block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5';

function ProjectForm() {
  const params = useSearchParams();
  const aplicacao = params.get('aplicacao');
  const initialService = (aplicacao && Object.hasOwn(APLICACAO, aplicacao) && APLICACAO[aplicacao])
    || (params.get('interesse') === 'consultoria' ? 'Outro projeto' : '');
  const suiteKey = params.get('suite');
  const suite = suiteKey && Object.hasOwn(SUITES, suiteKey) ? SUITES[suiteKey] : '';

  const [message, setMessage] = useState('');
  const [stage, setStage] = useState('');
  const [service, setService] = useState<string>(initialService);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ url: string } | null>(null);
  const started = useRef(false);
  const idempotencyKey = useRef<string | null>(null);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent('form_started', { service: service || undefined, suite: suite || undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!whatsapp.trim() && !email.trim()) {
      setError('Informe um WhatsApp ou um e-mail para retorno.');
      return;
    }
    setSubmitting(true);
    setError('');
    const body = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      companyName: companyName.trim(),
      service,
      message: `${suite ? `[Suíte: ${suite}] ` : ''}${stage ? `[Estágio: ${stage}] ` : ''}${message.trim()}`,
      attribution: readAttribution(),
    };
    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey.current },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('lead_failed');
      trackEvent('lead', { service, suite: suite || undefined });
      setDone({
        url: buildWhatsAppUrl({ name: fullName.trim(), application: service, suite, stage, message: message.trim() }),
      });
    } catch {
      // Dados mudaram depois da falha? Nova chave, para não reaproveitar a resposta de outra tentativa.
      idempotencyKey.current = null;
      setError('Não foi possível enviar agora. Confira os dados e tente de novo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="p-6 rounded-2xl bg-brand/10 border border-brand/30 space-y-4 text-center my-6" role="status">
        <div className="w-12 h-12 rounded-full bg-brand/20 text-brand mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Projeto recebido</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nossa equipe vai responder pelo canal que você escolheu. Se quiser adiantar a conversa, continue no WhatsApp com o resumo já pronto.
        </p>
        <a
          href={done.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { service, suite: suite || undefined })}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all w-full"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Continuar no WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={markStarted} onChange={markStarted} className="space-y-4">
      {suite && (
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/5 text-xs font-semibold text-brand">
          Suíte de interesse: {suite}
        </p>
      )}
      <div>
        <label htmlFor="f-message" className={label}>O que você quer construir ou melhorar?</label>
        <textarea id="f-message" rows={4} required maxLength={4000} value={message}
          onChange={(e) => setMessage(e.target.value)} className={`${field} resize-none leading-relaxed`} />
      </div>
      <fieldset>
        <legend className={label}>Em que estágio está?</legend>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <label key={s} className={`cursor-pointer px-3 py-2 rounded-xl border text-sm transition-all focus-within:ring-2 focus-within:ring-brand ${stage === s ? 'border-brand bg-brand/10 text-foreground' : 'border-border bg-foreground/5 text-muted-foreground'}`}>
              <input type="radio" name="stage" value={s} checked={stage === s} onChange={() => setStage(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="f-service" className={label}>Qual aplicação?</label>
        <select id="f-service" required value={service} onChange={(e) => setService(e.target.value)} className={field}>
          <option value="" disabled>Selecione uma opção</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="f-name" className={label}>Nome</label>
          <input id="f-name" type="text" required minLength={2} autoComplete="name" value={fullName}
            onChange={(e) => setFullName(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="f-company" className={label}>Empresa ou projeto (opcional)</label>
          <input id="f-company" type="text" autoComplete="organization" value={companyName}
            onChange={(e) => setCompanyName(e.target.value)} className={field} />
        </div>
      </div>
      <div>
        <p className={label}>Retorno por WhatsApp ou e-mail (pelo menos um)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input aria-label="WhatsApp" type="tel" autoComplete="tel" placeholder="WhatsApp: (DDD) 99999-9999" value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)} className={field} />
          <input aria-label="E-mail" type="email" autoComplete="email" placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)} className={field} />
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-rose-500 font-medium">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Suítes de dois meses, de R$ 7 mil a R$ 29,8 mil, conforme o escopo. Infraestrutura e serviços externos discriminados na proposta.
      </p>
      <Button type="submit" disabled={submitting} variant="brand" size="lg" className="w-full gap-2">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{submitting ? 'Enviando...' : 'Enviar meu projeto'}</span>
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Usamos seus dados só para responder sobre o projeto.
      </p>
    </form>
  );
}

export function ProjectConversionPage() {
  return (
    <div className="w-full flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-6 md:py-10 px-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Conte sobre o seu projeto</h1>
        <p className="text-sm text-muted-foreground mb-6">Poucas respostas e a equipe retorna pelo canal que você escolher.</p>
        <Suspense fallback={null}>
          <ProjectForm />
        </Suspense>
      </div>
    </div>
  );
}

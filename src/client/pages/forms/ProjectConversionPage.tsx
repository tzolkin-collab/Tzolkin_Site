'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, MessageSquare, Send } from 'lucide-react';
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

const field = 'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/30';
const label = 'mb-1.5 block text-xs font-medium text-muted-foreground';

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
      <div className="my-6 space-y-4 rounded-2xl border border-border bg-card p-8 text-center" role="status">
        <div className="w-12 h-12 rounded-full border border-border text-brand mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Projeto recebido</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nossa equipe vai responder pelo canal que você escolheu. Se quiser adiantar a conversa, continue no WhatsApp com o resumo já pronto.
        </p>
        <a
          href={done.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { service, suite: suite || undefined })}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Continuar no WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={markStarted} onChange={markStarted} className="space-y-5">
      {suite && (
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-brand">
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
            <label key={s} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-brand/40 ${stage === s ? 'border-brand text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
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
      {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Suítes de dois meses, conforme o escopo. O valor é apresentado na proposta, com infraestrutura e serviços externos discriminados.
      </p>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{submitting ? 'Enviando...' : 'Enviar meu projeto'}</span>
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Usamos seus dados só para responder sobre o projeto.
      </p>
    </form>
  );
}

export function ProjectConversionPage() {
  return (
    <div className="w-full flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[640px] px-1 py-8 md:py-14">
        <p className="mb-3 text-sm font-semibold tracking-wide text-brand">Iniciar projeto</p>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Conte sobre o seu projeto</h1>
        <p className="mb-8 text-base text-muted-foreground">Poucas respostas e a equipe retorna pelo canal que você escolher.</p>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.15)] md:p-8">
          <Suspense fallback={null}>
            <ProjectForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

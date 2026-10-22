'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
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
const SIZES = ['Autônomo ou MEI', 'Até 10 pessoas', 'De 11 a 50 pessoas', 'Mais de 50 pessoas'] as const;

// Etapas que a pessoa vê (3) e telas (4): dados, projeto (2 telas), agradecimento.
const STAGE_LABELS = ['Seus dados', 'Seu projeto', 'Pronto'] as const;
const screenToStage = (screen: number) => (screen === 0 ? 0 : screen <= 2 ? 1 : 2);

const field =
  'w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/30';
const label = 'mb-1.5 block text-sm font-medium text-foreground';
const hint = 'font-normal text-muted-foreground';

const primaryBtn =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';
const backBtn =
  'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v: string) => /^\d{10,15}$/.test(v.replace(/[\s()+.-]/g, ''));

function Choice({ checked, onSelect, name, children }: { checked: boolean; onSelect: () => void; name: string; children: React.ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-center rounded-lg border px-3.5 py-3 text-[15px] transition-colors focus-within:ring-2 focus-within:ring-brand/40 ${
        checked ? 'border-brand bg-brand/[0.06] text-foreground' : 'border-border text-foreground/80 hover:border-foreground/40'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      {children}
    </label>
  );
}

function ProjectForm() {
  const params = useSearchParams();
  const aplicacao = params.get('aplicacao');
  const initialService =
    (aplicacao && Object.hasOwn(APLICACAO, aplicacao) && APLICACAO[aplicacao]) ||
    (params.get('interesse') === 'consultoria' ? 'Outro projeto' : '');
  const suiteKey = params.get('suite');
  const suite = suiteKey && Object.hasOwn(SUITES, suiteKey) ? SUITES[suiteKey] : '';

  const [screen, setScreen] = useState(0);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<string>(initialService);
  const [stage, setStage] = useState('');
  const [message, setMessage] = useState('');
  const [size, setSize] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const started = useRef(false);
  const idempotencyKey = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // A cada tela nova o foco vai para o título, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    heading.current?.focus();
  }, [screen]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent('form_started', { service: service || undefined, suite: suite || undefined });
  };

  const next = () => {
    setError('');
    if (screen === 0) {
      if (fullName.trim().length < 2) return setError('Diga seu nome para a gente saber com quem falar.');
      if (!whatsapp.trim() && !email.trim()) return setError('Informe um WhatsApp ou um e-mail para retorno.');
      if (whatsapp.trim() && !phoneOk(whatsapp)) return setError('O WhatsApp precisa ter DDD e número, por exemplo (31) 99999-9999.');
      if (email.trim() && !emailOk(email.trim())) return setError('Confira o e-mail: ele parece incompleto.');
    }
    if (screen === 1 && !service) return setError('Escolha a aplicação mais próxima do que você precisa.');
    setScreen((s) => s + 1);
  };

  const submit = async () => {
    if (submitting) return;
    if (!message.trim()) return setError('Conte em uma ou duas frases o que você quer construir ou melhorar.');
    setSubmitting(true);
    setError('');
    const body = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      companyName: companyName.trim(),
      companySize: size,
      website: website.trim(),
      instagram: instagram.trim(),
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
      setWhatsappUrl(buildWhatsAppUrl({ name: fullName.trim(), application: service, suite, stage, message: message.trim() }));
      setScreen(3);
    } catch {
      // Dados mudaram depois da falha? Nova chave, para não reaproveitar a resposta de outra tentativa.
      idempotencyKey.current = null;
      setError('Não foi possível enviar agora. Seus dados continuam aqui; tente de novo.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (screen === 2) void submit();
    else if (screen < 2) next();
  };

  const active = screenToStage(screen);

  return (
    <div className="w-full" onFocusCapture={markStarted}>
      <ol className="mb-8 flex gap-2" aria-label="Etapas do formulário">
        {STAGE_LABELS.map((l, i) => (
          <li key={l} className="flex-1" aria-current={i === active ? 'step' : undefined}>
            <span className={`block h-1 rounded-full transition-colors ${i <= active ? 'bg-brand' : 'bg-border'}`} />
            <span className={`mt-2 block text-xs font-medium ${i === active ? 'text-foreground' : 'text-muted-foreground'}`}>{l}</span>
          </li>
        ))}
      </ol>

      {screen === 3 ? (
        <div role="status">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-foreground outline-none md:text-[2rem]">
            Recebemos o seu projeto.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {fullName.trim().split(' ')[0]}, a equipe responde pelo canal que você informou
            {email.trim() ? ', e também por e-mail' : ''}. Se quiser adiantar a conversa, o resumo já está pronto no WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { service, suite: suite || undefined })}
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Conversar com a TZOLKIN no WhatsApp
          </a>
          <div className="mt-8 flex gap-3 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-foreground/60" aria-hidden="true" />
            <p>
              Usamos seus dados só para responder sobre o projeto. Para falar sobre eles, escreva para{' '}
              <a href="mailto:contato@tzolkin.com.br" className="font-medium text-foreground underline underline-offset-2 hover:text-brand">contato@tzolkin.com.br</a>.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} onChange={markStarted} noValidate>
          {screen === 0 && (
            <div className="space-y-5">
              <div>
                <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-foreground outline-none md:text-[2rem]">Vamos começar por você.</h1>
                <p className="mt-2 text-base text-muted-foreground">É só para saber com quem a equipe vai falar.</p>
              </div>
              {suite && <p className="text-sm font-medium text-brand">Suíte de interesse: {suite}</p>}
              <div>
                <label htmlFor="f-name" className={label}>Seu nome</label>
                <input id="f-name" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
              </div>
              <div>
                <label htmlFor="f-company" className={label}>Empresa ou projeto <span className={hint}>(opcional)</span></label>
                <input id="f-company" type="text" autoComplete="organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={field} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-whatsapp" className={label}>WhatsApp</label>
                  <input id="f-whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="f-email" className={label}>E-mail</label>
                  <input id="f-email" type="email" autoComplete="email" placeholder="voce@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                </div>
              </div>
              <p className="-mt-2 text-sm text-muted-foreground">Preencha pelo menos um dos dois.</p>
            </div>
          )}

          {screen === 1 && (
            <div className="space-y-6">
              <div>
                <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-foreground outline-none md:text-[2rem]">O que você precisa?</h1>
                <p className="mt-2 text-base text-muted-foreground">Escolha a opção mais próxima. O escopo final a gente define em conversa.</p>
              </div>
              <fieldset>
                <legend className={label}>Aplicação</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <Choice key={s} name="service" checked={service === s} onSelect={() => setService(s)}>{s}</Choice>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className={label}>Em que estágio está? <span className={hint}>(opcional)</span></legend>
                <div className="grid grid-cols-1 gap-2">
                  {STAGES.map((s) => (
                    <Choice key={s} name="stage" checked={stage === s} onSelect={() => setStage(s)}>{s}</Choice>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {screen === 2 && (
            <div className="space-y-5">
              <div>
                <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-foreground outline-none md:text-[2rem]">Conte um pouco mais.</h1>
                <p className="mt-2 text-base text-muted-foreground">Quanto mais claro, mais certeira a primeira resposta.</p>
              </div>
              <div>
                <label htmlFor="f-message" className={label}>O que você quer construir ou melhorar?</label>
                <textarea id="f-message" rows={4} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)} className={`${field} resize-none leading-relaxed`} />
              </div>
              <fieldset>
                <legend className={label}>Tamanho da empresa <span className={hint}>(opcional)</span></legend>
                <div className="grid grid-cols-2 gap-2">
                  {SIZES.map((s) => (
                    <Choice key={s} name="size" checked={size === s} onSelect={() => setSize(s)}>{s}</Choice>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-site" className={label}>Site <span className={hint}>(opcional)</span></label>
                  <input id="f-site" type="text" inputMode="url" autoComplete="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="f-insta" className={label}>Instagram <span className={hint}>(opcional)</span></label>
                  <input id="f-insta" type="text" placeholder="@suaempresa" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={field} />
                </div>
              </div>
            </div>
          )}

          {error && <p role="alert" className="mt-5 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

          <div className="mt-8 flex gap-3">
            {screen > 0 && (
              <button type="button" onClick={() => { setError(''); setScreen((s) => s - 1); }} className={backBtn}>
                <ArrowLeft size={16} aria-hidden="true" />
                Voltar
              </button>
            )}
            <button type="submit" disabled={submitting} className={primaryBtn}>
              {screen === 2 ? (
                <>
                  {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                  {submitting ? 'Enviando...' : 'Enviar meu projeto'}
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          {screen === 2 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Usamos seus dados só para responder sobre o projeto.</p>
          )}
        </form>
      )}
    </div>
  );
}

/**
 * Formulário partido ao meio: a foto institucional à esquerda (só no desktop) e o formulário em etapas à direita.
 * A foto é `public/forms/escritorio.jpg`; sem ela, aparece o gradiente de reserva. Ver o prompt em
 * estrategia-copy/2026-10-produtos-digitais/15-foto-institucional-forms.md.
 */
export function ProjectConversionPage() {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden lg:block"
        style={{
          backgroundImage: 'url(/forms/escritorio.jpg), linear-gradient(140deg, #1a0f10 0%, #3a1511 55%, #8b1a1a 100%)',
          // A foto entra um pouco ampliada e ancorada embaixo: corta o ar-condicionado no topo e deixa a marmore escura atrás da logo.
          backgroundSize: '125% auto, cover',
          backgroundPosition: 'center bottom, center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/50 dark:from-black/60 dark:to-black/65" />
        <p className="absolute bottom-10 left-10 right-10 max-w-sm text-lg font-medium leading-snug text-white/95">
          Conte o projeto. A equipe responde pelo canal que você escolher.
        </p>
      </aside>

      <section className="min-h-0 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[520px] items-center px-6 pb-10 pt-24 md:px-8">
          <Suspense fallback={null}>
            <ProjectForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

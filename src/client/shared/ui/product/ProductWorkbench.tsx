"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownLeft,
  Check,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  Command,
  GitBranch,
  Inbox,
  LayoutDashboard,
  ListFilter,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import s from "./ProductDemo.module.css";

const steps = ["Receber", "Entender", "Encaminhar"];
const columns = ["Entrada", "Qualificados", "Com o time"];
const backgroundDeals = [
  { name: "Casa Norte", detail: "Proposta de integração", tag: "Formulário" },
  { name: "Estúdio Lume", detail: "Nova unidade", tag: "Indicação" },
  { name: "Oficina Central", detail: "Retorno agendado", tag: "Com Paulo" },
];

/** Demonstração local de uma jornada; não executa IA nem integrações reais. */
export function ProductWorkbench({
  compact = false,
  step: controlledStep,
}: {
  compact?: boolean;
  /** Etapa conduzida de fora (ex.: scroll). Sem ela, as etapas avançam sozinhas. */
  step?: number;
}) {
  const [auto, setAuto] = useState(0);
  const reduceMotion = useReducedMotion();
  const controlled = controlledStep !== undefined;
  const step = controlledStep ?? auto;

  useEffect(() => {
    if (controlled || reduceMotion) return;
    const timer = setInterval(() => setAuto((n) => (n + 1) % steps.length), 3600);
    return () => clearInterval(timer);
  }, [controlled, reduceMotion]);

  const id = useId();
  const transition = {
    duration: reduceMotion ? 0 : 0.28,
    ease: "easeOut" as const,
  };

  return (
    <figure
      className={`${s.demo} ${compact ? s.compact : ""}`}
      aria-label="Demonstração interativa de atendimento e CRM"
    >
      <ol className={s.steps} aria-label="Etapas do atendimento">
        {steps.map((label, index) => (
          <li
            key={label}
            className={s.step}
            aria-current={step === index ? "step" : undefined}
          >
            <span className={s.stepNumber} aria-hidden="true">
              {index < step ? <Check size={12} /> : `0${index + 1}`}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <div className={s.workspace}>
        <div className={s.app}>
          <div className={s.topbar}>
            <span className={s.brandMark} aria-hidden="true">
              tz.
            </span>
            <div className={s.breadcrumb}>
              Workspace <span aria-hidden="true">/</span>{" "}
              <strong>Comercial</strong>
              <ChevronDown size={11} aria-hidden="true" />
            </div>
            <div className={s.topActions} aria-hidden="true">
              <Search size={14} />
              <CircleHelp size={14} />
              <span className={s.avatar}>AS</span>
            </div>
          </div>
          <div className={s.body}>
            <div className={s.rail} aria-hidden="true">
              <LayoutDashboard size={16} />
              <Inbox size={16} />
              <GitBranch size={16} className={s.railActive} />
              <Users size={16} />
              <span style={{ marginTop: "auto" }}>
                <Command size={15} />
              </span>
            </div>
            <div className={s.main}>
              <div className={s.pageHeading}>
                <div>
                  <h3>Oportunidades</h3>
                  <p>Cada conversa, com um próximo passo.</p>
                </div>
                <div className={s.avatars} aria-label="Equipe ilustrativa">
                  <span className={s.avatar}>AS</span>
                  <span className={s.avatar}>PR</span>
                  <span className={s.avatar}>+1</span>
                </div>
              </div>
              <div className={s.toolbar}>
                <GitBranch size={12} aria-hidden="true" />
                <strong>Pipeline comercial</strong>
                <ChevronDown size={11} aria-hidden="true" />
                <span className={s.toolbarRight}>
                  <ListFilter size={12} aria-hidden="true" />
                  Todos os canais
                </span>
              </div>
              <div
                className={s.board}
                aria-label={`Marina está na etapa ${columns[step]}`}
              >
                {columns.map((title, index) => (
                  <div
                    key={title}
                    className={`${s.column} ${step === index ? s.columnActive : ""}`}
                  >
                    <div className={s.columnLabel}>
                      <span
                        className={s.dot}
                        style={{
                          color:
                            index === step ? "var(--pd-accent)" : undefined,
                        }}
                        aria-hidden="true"
                      />
                      {title}
                      <span className={s.count}>
                        {step === index ? "02" : "01"}
                      </span>
                    </div>
                    {step === index && (
                      <motion.div
                        layoutId={`${id}-opportunity`}
                        transition={transition}
                        className={`${s.deal} ${s.dealActive}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 4,
                          }}
                        >
                          <strong>Studio Aurora</strong>
                          <MoreHorizontal
                            size={12}
                            aria-hidden="true"
                            style={{ flexShrink: 0, opacity: 0.45 }}
                          />
                        </div>
                        <p>Marina · Integração</p>
                        <span className={`${s.dealTag} ${s.dealTagActive}`}>
                          <span className={s.dot} aria-hidden="true" />
                          {step === 2
                            ? "Com Ana"
                            : step === 1
                              ? "Resumo pronto"
                              : "WhatsApp"}
                        </span>
                      </motion.div>
                    )}
                    <div className={`${s.deal} ${s.dealMuted}`}>
                      <strong>{backgroundDeals[index].name}</strong>
                      <p>{backgroundDeals[index].detail}</p>
                      <span className={s.dealTag}>
                        {backgroundDeals[index].tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={s.insight}>
          <div className={s.insightHeader}>
            <span className={s.channelIcon}>
              {step === 0 ? (
                <MessageCircle size={15} aria-hidden="true" />
              ) : step === 1 ? (
                <Sparkles size={15} aria-hidden="true" />
              ) : (
                <Users size={15} aria-hidden="true" />
              )}
            </span>
            <div>
              <strong>
                {step === 0
                  ? "Uma conversa começa."
                  : step === 1
                    ? "O contexto vem junto."
                    : "A pessoa certa assume."}
              </strong>
              <small>
                {step === 0
                  ? "WhatsApp · Marina Costa"
                  : step === 1
                    ? "Resumo ilustrativo do agente"
                    : "Encaminhamento no CRM"}
              </small>
            </div>
            <span className={s.verified}>
              <span className={s.dot} aria-hidden="true" />
              {step === 0
                ? "Recebido"
                : step === 1
                  ? "Organizado"
                  : "Encaminhado"}
            </span>
          </div>
          <div
            className={s.insightContent}
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
            >
              {step === 0 && (
                <p className={s.quote}>
                  “Estamos abrindo uma nova unidade. Vocês conseguem conectar o
                  atendimento ao nosso estoque?”
                </p>
              )}
              {step === 1 && (
                <dl className={s.contextGrid}>
                  <dt>Necessidade</dt>
                  <dd>Conectar atendimento e estoque</dd>
                  <dt>Momento</dt>
                  <dd>Expansão para uma nova unidade</dd>
                  <dt>Próximo passo</dt>
                  <dd>Validar os sistemas com o comercial</dd>
                </dl>
              )}
              {step === 2 && (
                <div className={s.handoff}>
                  <span className={s.avatar}>AS</span>
                  <div>
                    <strong>Ana Souza · Comercial</strong>
                    <p>Conversa, necessidade e próximo passo no mesmo lugar.</p>
                  </div>
                  <CheckCheck
                    size={18}
                    aria-hidden="true"
                    style={{ color: "var(--pd-green)", flexShrink: 0 }}
                  />
                </div>
              )}
            </motion.div>
          </div>
          <div className={s.insightFooter}>
            <span>
              <ShieldCheck size={12} aria-hidden="true" />
              {step === 2
                ? "Responsável definido"
                : "Você acompanha cada etapa"}
            </span>
          </div>
        </div>
      </div>
      <figcaption className={s.caption}>
        <span>Exemplo interativo · dados ilustrativos</span>
        <span>
          <ArrowDownLeft size={12} aria-hidden="true" />
          {controlled ? "Role para avançar" : "Etapas em sequência"}
        </span>
      </figcaption>
    </figure>
  );
}

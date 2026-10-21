"use client";

import { useState } from "react";
import { ArrowRight, CheckCheck, MessageCircle } from "lucide-react";
import { flowSteps } from "./content";
import s from "@/client/shared/ui/product/ProductDemo.module.css";
import m from "@/client/shared/ui/product/MiniDemos.module.css";

const detail = [
  [
    "O contato chega com uma origem.",
    "A jornada começa no canal que faz sentido para a operação. O registro preserva de onde veio a conversa.",
  ],
  [
    "A equipe recebe o contexto.",
    "A necessidade e o momento da pessoa ficam organizados para apoiar a continuidade do atendimento.",
  ],
  [
    "A conversa ganha um lugar no funil.",
    "As informações da oportunidade ficam reunidas, com o histórico disponível para quem vai atender.",
  ],
  [
    "O responsável sabe o próximo passo.",
    "O encaminhamento considera as regras combinadas para a operação e acompanha o contexto recebido.",
  ],
  [
    "A oportunidade continua visível.",
    "A equipe acompanha o status e mantém os próximos passos registrados para dar continuidade.",
  ],
];

export function FlowDiagram() {
  const [active, setActive] = useState(0);
  return (
    <figure
      className={s.demo}
      aria-label="Explorar o fluxo ilustrativo do CRM com IA"
    >
      <div
        className={m.flowNav}
        role="group"
        aria-label="Etapas do fluxo do CRM"
      >
        {flowSteps.map((step, i) => (
          <button
            className={m.flowButton}
            type="button"
            key={step.title}
            aria-pressed={active === i}
            aria-controls="crm-flow-detail"
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {step.title}
          </button>
        ))}
      </div>
      <div className={m.flowDetail} id="crm-flow-detail">
        <div aria-live="polite">
          <p className={m.eyebrow}>ETAPA 0{active + 1}</p>
          <h3>{detail[active][0]}</h3>
          <p>{detail[active][1]}</p>
          <button
            className={m.action}
            type="button"
            onClick={() => setActive((active + 1) % flowSteps.length)}
          >
            {active === flowSteps.length - 1
              ? "Voltar ao início"
              : "Explorar próxima etapa"}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
        <div className={m.record}>
          <div className={m.person}>
            <span className={m.avatar}>MC</span>
            <div>
              <strong>Marina Costa</strong>
              <small>Studio Aurora · Exemplo</small>
            </div>
            <MessageCircle
              size={16}
              style={{ marginLeft: "auto", color: "var(--pd-green)" }}
              aria-hidden="true"
            />
          </div>
          <span className={m.badge}>
            <CheckCheck size={12} aria-hidden="true" />
            {flowSteps[active].title}
          </span>
          <dl>
            <dt>Origem</dt>
            <dd>WhatsApp</dd>
            <dt>Interesse</dt>
            <dd>Integração de estoque</dd>
            <dt>Responsável</dt>
            <dd>{active >= 3 ? "Ana Souza" : "A definir"}</dd>
            <dt>Próximo passo</dt>
            <dd>
              {active >= 3 ? "Validar os sistemas" : "Organizar contexto"}
            </dd>
          </dl>
        </div>
      </div>
      <figcaption className={`${m.caption} mt-6`}>
        O fluxo contratado é definido conforme sua operação.
      </figcaption>
    </figure>
  );
}

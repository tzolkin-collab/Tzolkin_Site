"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  Circle,
  FileCheck2,
  FileText,
  GitBranch,
  Info,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { ProductWorkbench } from "@/client/shared/ui/product/ProductWorkbench";
import s from "@/client/shared/ui/product/ProductDemo.module.css";
import m from "@/client/shared/ui/product/MiniDemos.module.css";

function Stage({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className={`${s.demo} ${m.stage}`} aria-label={label}>
      {children}
      <figcaption className={m.caption}>
        <Info size={12} aria-hidden="true" />
        Exemplo interativo · dados ilustrativos
      </figcaption>
    </figure>
  );
}

export function FunnelMock() {
  return (
    <div className={`${s.demo} ${m.stage} ${m.crmStage}`}>
      <ProductWorkbench compact />
    </div>
  );
}

export function ChatMock() {
  const [topic, setTopic] = useState(0);
  const [answered, setAnswered] = useState(false);
  const messages = [
    {
      question: "Este produto está disponível para entrega?",
      reply:
        "O catálogo mostra 12 unidades. Posso reunir os dados para confirmar a entrega com a equipe?",
      source: "Contexto consultado: catálogo e estoque",
    },
    {
      question: "Preciso ajustar o pedido que fiz ontem.",
      reply:
        "Encontrei o contexto do pedido. Vou reunir a solicitação e encaminhar para uma pessoa do atendimento.",
      source: "Contexto consultado: pedido e histórico",
    },
  ];
  return (
    <Stage label="Exemplo interativo de agente de atendimento">
      <div className={m.window}>
        <div className={m.header}>
          <MessageCircle size={16} aria-hidden="true" />
          <strong>Caixa de entrada</strong>
          <small>WhatsApp</small>
        </div>
        <div className={m.body}>
          <div
            className={m.segment}
            role="group"
            aria-label="Escolher conversa de exemplo"
          >
            {["Pré-venda", "Atendimento"].map((name, i) => (
              <button
                key={name}
                type="button"
                aria-pressed={topic === i}
                onClick={() => {
                  setTopic(i);
                  setAnswered(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className={m.person}>
            <span className={m.avatar}>MC</span>
            <div>
              <strong>Marina Costa</strong>
              <small>Uma conversa com contexto</small>
            </div>
          </div>
          <p className={m.bubble}>{messages[topic].question}</p>
          <div aria-live="polite">
            {answered ? (
              <>
                <p className={`${m.bubble} ${m.reply}`}>
                  {messages[topic].reply}
                </p>
                <p className={m.source}>
                  <CheckCheck size={12} aria-hidden="true" />
                  {messages[topic].source}
                </p>
              </>
            ) : (
              <p className={m.eyebrow}>
                Veja como o contexto ajuda a preparar a resposta.
              </p>
            )}
          </div>
          <button
            type="button"
            className={m.action}
            onClick={() => setAnswered(!answered)}
          >
            {answered ? "Reiniciar conversa" : "Ver resposta com contexto"}
            {answered ? (
              <RefreshCw size={13} aria-hidden="true" />
            ) : (
              <Sparkles size={13} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </Stage>
  );
}

export function StoreMock() {
  const [channel, setChannel] = useState(0);
  const [synced, setSynced] = useState(false);
  return (
    <Stage label="Exemplo interativo de pedidos integrados">
      <div className={m.window}>
        <div className={m.header}>
          <ShoppingBag size={16} aria-hidden="true" />
          <strong>Pedidos unificados</strong>
          <small>Todos os canais</small>
        </div>
        <div className={m.body}>
          <div className={m.segment} role="group" aria-label="Canal do pedido">
            {["Loja própria", "Marketplace"].map((name, i) => (
              <button
                key={name}
                type="button"
                aria-pressed={channel === i}
                onClick={() => {
                  setChannel(i);
                  setSynced(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <p className={m.eyebrow}>
            {channel === 0
              ? "Loja própria · novo pedido"
              : "Marketplace · novo pedido"}
          </p>
          <div className={m.orderHeading}>
            <h4>#{channel === 0 ? "1048" : "1049"}</h4>
            <span>Agora</span>
          </div>
          <div className={m.orderRow}>
            <span className={m.productIcon}>
              <ShoppingBag size={25} strokeWidth={1.2} aria-hidden="true" />
            </span>
            <div>
              <strong>Bolsa Everyday</strong>
              <small>Areia · 1 unidade</small>
            </div>
            <span className={m.price}>R$ 289</span>
          </div>
          <ul className={m.events} aria-live="polite">
            <li className={`${m.event} ${m.eventDone}`}>
              <Check size={13} aria-hidden="true" />
              Pedido recebido
            </li>
            <li className={`${m.event} ${synced ? m.eventDone : ""}`}>
              {synced ? (
                <Check size={13} aria-hidden="true" />
              ) : (
                <Circle size={12} aria-hidden="true" />
              )}
              Estoque atualizado nos canais
            </li>
            <li className={`${m.event} ${synced ? m.eventDone : ""}`}>
              {synced ? (
                <Check size={13} aria-hidden="true" />
              ) : (
                <Circle size={12} aria-hidden="true" />
              )}
              Pedido encaminhado à operação
            </li>
          </ul>
          <button
            type="button"
            className={m.action}
            onClick={() => setSynced(!synced)}
          >
            {synced ? "Ver outro pedido" : "Ver pedido sincronizado"}
            {synced ? (
              <RefreshCw size={13} aria-hidden="true" />
            ) : (
              <ArrowRight size={13} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </Stage>
  );
}

export function InvoiceMock() {
  const [issued, setIssued] = useState(false);
  return (
    <Stage label="Exemplo interativo de automação fiscal">
      <div className={m.window}>
        <div className={m.header}>
          <FileText size={16} aria-hidden="true" />
          <strong>Central fiscal</strong>
          <small>Pedido #1048</small>
        </div>
        <div className={m.body}>
          <div className={m.invoice}>
            <div className={m.invoiceTop}>
              <div>
                <strong>Nota fiscal</strong>
                <small>Documento de exemplo</small>
              </div>
              {issued ? (
                <FileCheck2
                  size={24}
                  style={{ color: "var(--pd-green)" }}
                  aria-hidden="true"
                />
              ) : (
                <FileText
                  size={24}
                  style={{ color: "var(--pd-muted)" }}
                  aria-hidden="true"
                />
              )}
            </div>
            <dl className={m.invoiceDetails}>
              <dt>Origem</dt>
              <dd>Pedido #1048</dd>
              <dt>Itens</dt>
              <dd>1 produto</dd>
              <dt>Total</dt>
              <dd>R$ 289,00</dd>
            </dl>
            <div aria-live="polite">
              <span className={m.badge}>
                {issued ? (
                  <Check size={12} aria-hidden="true" />
                ) : (
                  <Circle size={12} aria-hidden="true" />
                )}
                {issued ? "Emissão ilustrada" : "Dados organizados"}
              </span>
            </div>
            <div className={m.barcode} aria-hidden="true" />
            <p className={m.invoiceNote}>Sem valor fiscal</p>
          </div>
          <button
            type="button"
            className={m.action}
            onClick={() => setIssued(!issued)}
          >
            {issued ? "Ver novamente" : "Ver emissão do exemplo"}
            {issued ? (
              <RefreshCw size={13} aria-hidden="true" />
            ) : (
              <Send size={13} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </Stage>
  );
}

export function PilotMock() {
  const [version, setVersion] = useState(0);
  const checks = [
    "Acessos por perfil",
    "Fluxo principal revisado",
    "Documentação de entrega",
  ];
  return (
    <Stage label="Comparação interativa da evolução de um piloto">
      <div className={m.window}>
        <div className={m.header}>
          <GitBranch size={16} aria-hidden="true" />
          <strong>Evolução do produto</strong>
          <small>Release</small>
        </div>
        <div className={m.body}>
          <div
            className={m.segment}
            role="group"
            aria-label="Versão ilustrativa do produto"
          >
            {["Piloto atual", "Próxima versão"].map((name, i) => (
              <button
                key={name}
                type="button"
                aria-pressed={version === i}
                onClick={() => setVersion(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className={m.release}>
            <span className={m.releaseTag}>
              <GitBranch size={12} aria-hidden="true" />
              {version === 0 ? "pilot / v0.1" : "release / v0.2"}
            </span>
            <strong>
              {version === 0
                ? "Uma base para evoluir."
                : "Uma entrega organizada."}
            </strong>
            <p>
              {version === 0
                ? "Decisões abertas para a próxima etapa."
                : "Controles e contexto para dar continuidade."}
            </p>
          </div>
          <div className={m.progress} aria-hidden="true">
            {checks.map((item, i) => (
              <i key={item} data-done={version === 1 || i === 0} />
            ))}
          </div>
          <div aria-live="polite">
            {checks.map((item, i) => (
              <div
                key={item}
                className={`${m.checkRow} ${version === 0 && i > 0 ? m.pending : ""}`}
              >
                {version === 1 || i === 0 ? (
                  <ShieldCheck size={15} aria-hidden="true" />
                ) : (
                  <Circle size={14} aria-hidden="true" />
                )}
                {item}
              </div>
            ))}
          </div>
          <button
            type="button"
            className={m.action}
            onClick={() => setVersion(1 - version)}
          >
            {version === 0 ? "Explorar a próxima versão" : "Voltar ao piloto"}
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </Stage>
  );
}

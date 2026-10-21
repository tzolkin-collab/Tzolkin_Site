'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Check, Search, ShoppingBag } from 'lucide-react';

/*
 * Mockups de MacBook e iPhone com a mesma loja em layouts próprios.
 * As telas usam cores fixas (uma loja é clara em qualquer tema do site) e tamanho intrínseco em px;
 * o palco inteiro é escalado para caber na coluna. Dados fictícios.
 */

export const STAGE_W = 940;
export const STAGE_H = 620;

const INK = 'text-[#171717]';
const MUTED = 'text-[#737373]';

const SIZES = ['P', 'M', 'G', 'GG'];
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Escala o palco para a largura disponível, sem passar de 1. */
function useFit(base: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / base)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [base]);
  return { ref, scale };
}

function Screen({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div aria-hidden={!active} className={`absolute inset-0 bg-white transition-opacity duration-200 motion-reduce:transition-none ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {children}
    </div>
  );
}

function Chip({ on, children }: { on?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex h-7 min-w-8 items-center justify-center rounded-md border px-2 text-[12px] font-medium ${on ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#e5e5e5] text-[#404040]'}`}>
      {children}
    </span>
  );
}

/* ---------- QR ilustrativo (não é um código válido) ---------- */
function FakeQr({ size }: { size: number }) {
  const n = 25;
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const cells: Array<[number, number]> = [];
  const inFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) cells.push([x, y]);
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" fill="#171717" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#171717" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} role="img" aria-label="QR Code de exemplo" shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#171717" />)}
      {finder(0, 0)}{finder(n - 7, 0)}{finder(0, n - 7)}
    </svg>
  );
}

/* ---------- Telas do Mac (700 x 438) ---------- */
function MacStore() {
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#ececec] px-6">
        <span className="text-[15px] font-semibold tracking-tight">Atelier Areia</span>
        <nav className={`flex gap-5 text-[12px] ${MUTED}`}><span>Novidades</span><span className="text-[#171717]">Camisetas</span><span>Calçados</span><span>Acessórios</span></nav>
        <span className="flex items-center gap-3"><Search size={15} /><span className="relative"><ShoppingBag size={16} /><i className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[8px] not-italic text-white">1</i></span></span>
      </div>
      <div className="grid flex-1 grid-cols-[1fr_1fr] gap-8 p-6">
        <Image src="/ecommerce/camiseta-lg.jpg" alt="Camiseta Básica Branca" width={360} height={360} unoptimized className="h-[330px] w-full rounded-lg object-cover" />
        <div className="flex flex-col pt-1">
          <p className={`text-[11px] ${MUTED}`}>Camisetas / Básicas</p>
          <h4 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-tight">Camiseta Básica Branca</h4>
          <p className="mt-3 text-[20px] font-semibold tabular-nums">{brl(129.9)}</p>
          <p className={`text-[12px] ${MUTED}`}>ou 3x de {brl(43.3)} sem juros</p>
          <p className="mt-5 text-[12px] font-medium">Tamanho</p>
          <div className="mt-2 flex gap-2">{SIZES.map((s) => <Chip key={s} on={s === 'M'}>{s}</Chip>)}</div>
          <span className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand text-[13px] font-semibold text-white">Adicionar à sacola</span>
          <p className={`mt-3 text-[11px] ${MUTED}`}>Frete e prazo calculados pelo CEP.</p>
        </div>
      </div>
    </div>
  );
}

function MacCheckout() {
  const field = (label: string, v: string) => (
    <div><p className={`text-[11px] ${MUTED}`}>{label}</p><div className="mt-1 flex h-9 items-center rounded-md border border-[#e5e5e5] px-3 text-[13px]">{v}</div></div>
  );
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#ececec] px-6">
        <span className="text-[15px] font-semibold tracking-tight">Atelier Areia</span>
        <span className={`text-[12px] ${MUTED}`}>Finalizar compra</span>
      </div>
      <div className="grid flex-1 grid-cols-[1.15fr_1fr]">
        <div className="space-y-4 p-6">
          <p className="text-[13px] font-semibold">Entrega</p>
          <div className="grid grid-cols-2 gap-3">{field('Nome', 'Camila Ribeiro')}{field('CEP', '30000-000')}</div>
          <p className="pt-1 text-[13px] font-semibold">Envio</p>
          <div className="flex items-center justify-between rounded-lg border border-[#e5e5e5] px-4 py-2.5 text-[13px]"><span className="font-medium">Entrega padrão</span><span className={`text-[11px] ${MUTED}`}>3 a 5 dias úteis · {brl(24.9)}</span></div>
          <p className="pt-1 text-[13px] font-semibold">Pagamento</p>
          <div className="divide-y divide-[#ececec] rounded-lg border border-[#e5e5e5]">
            {[['Pix', 'Aprovação na hora', true], ['Cartão de crédito', 'Até 3x sem juros', false], ['Boleto', 'Vence em 3 dias', false]].map(([n, d, on]) => (
              <div key={n as string} className="flex items-center gap-3 px-4 py-2.5">
                <span className={`h-4 w-4 rounded-full border-2 ${on ? 'border-brand bg-brand shadow-[inset_0_0_0_3px_#fff]' : 'border-[#d4d4d4]'}`} />
                <span className="text-[13px] font-medium">{n as string}</span>
                <span className={`ml-auto text-[11px] ${MUTED}`}>{d as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-l border-[#ececec] bg-[#fafafa] p-6">
          <div className="flex gap-3">
            <Image src="/ecommerce/camiseta.jpg" alt="" width={52} height={52} unoptimized className="h-13 w-13 rounded-md object-cover" style={{ width: 52, height: 52 }} />
            <div><p className="text-[13px] font-medium">Camiseta Básica Branca</p><p className={`text-[12px] ${MUTED}`}>Tamanho M · 1 un.</p></div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-[#e5e5e5] pt-4 text-[13px] tabular-nums">
            <div className="flex justify-between"><dt className={MUTED}>Subtotal</dt><dd>{brl(129.9)}</dd></div>
            <div className="flex justify-between"><dt className={MUTED}>Frete</dt><dd>{brl(24.9)}</dd></div>
            <div className="flex justify-between border-t border-[#e5e5e5] pt-3 text-[15px] font-semibold"><dt>Total</dt><dd>{brl(154.8)}</dd></div>
          </dl>
          <span className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-brand text-[13px] font-semibold text-white">Pagar com Pix · {brl(154.8)}</span>
        </div>
      </div>
    </div>
  );
}

const ADMIN_ROWS = [
  { id: '#4822', p: 'Camiseta Básica Branca', who: 'Camila R.', ch: 'Loja Shopify', v: 154.8, st: 'Novo', photo: 'camiseta', hot: true },
  { id: '#4821', p: 'Tênis Urbano Laranja', who: 'Rafael T.', ch: 'Mercado Livre', v: 129, st: 'Separando', photo: 'tenis' },
  { id: '#4820', p: 'Mochila Urbana Preta', who: 'Juliana M.', ch: 'Amazon', v: 246.8, st: 'Nota emitida', photo: 'mochila' },
  { id: '#4819', p: 'Jaqueta Jeans', who: 'Patrícia S.', ch: 'Shopee', v: 712.4, st: 'Aguardando', photo: 'jaqueta' },
  { id: '#4818', p: 'Óculos Acetato Preto', who: 'Bruno A.', ch: 'Loja Shopify', v: 59.9, st: 'Enviado', photo: 'oculos' },
  { id: '#4817', p: 'Mochila Urbana Preta', who: 'Marina F.', ch: 'Mercado Livre', v: 246.8, st: 'Entregue', photo: 'mochila' },
];

function MacAdmin() {
  const steps = ['Pedido recebido', 'Pagamento confirmado', 'Estoque reservado', 'Nota fiscal solicitada', 'Etiqueta gerada'];
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#ececec] px-6">
        <span className="text-[14px] font-semibold">Pedidos <span className={`font-normal ${MUTED}`}>· hoje</span></span>
        <span className={`text-[12px] ${MUTED}`}>Todos os canais</span>
      </div>
      <div className="grid flex-1 grid-cols-[1.25fr_1fr]">
        <ul className="divide-y divide-[#ececec]">
          {ADMIN_ROWS.map((r) => (
            <li key={r.id} className={`relative flex items-center gap-3 px-5 py-3 ${r.hot ? 'bg-[#fdf0f0]' : ''}`}>
              {r.hot && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand" />}
              <Image src={`/ecommerce/${r.photo}.jpg`} alt="" width={40} height={40} unoptimized className="rounded-md object-cover" style={{ width: 40, height: 40 }} />
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{r.p}</p><p className={`truncate text-[11px] ${MUTED}`}>{r.who} · {r.ch}</p></div>
              <div className="text-right"><p className="text-[13px] font-semibold tabular-nums">{brl(r.v)}</p><p className={`text-[11px] ${r.hot ? 'font-medium text-brand' : MUTED}`}>{r.st}</p></div>
            </li>
          ))}
        </ul>
        <div className="border-l border-[#ececec] bg-[#fafafa] p-5">
          <p className="text-[12px] font-semibold">Pedido #4822</p>
          <p className="mt-2 text-[30px] font-semibold leading-none tracking-tight tabular-nums">{brl(154.8)}</p>
          <p className={`mt-1 text-[12px] ${MUTED}`}>Camila R. · Pix · Loja Shopify</p>
          <ol className="mt-5 space-y-2.5">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2.5 text-[12px]">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full ${i < 3 ? 'bg-brand text-white' : i === 3 ? 'border-2 border-brand' : 'border border-[#d4d4d4]'}`}>{i < 3 && <Check size={10} strokeWidth={3} />}</span>
                <span className={i < 4 ? '' : 'text-[#a3a3a3]'}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ---------- Telas do iPhone (246 x 524) ---------- */
function PhoneBar() {
  return (
    <div className="flex h-9 shrink-0 items-end justify-between px-6 pb-1 text-[11px] font-semibold text-[#171717]"><span>9:41</span><span /></div>
  );
}

function PhoneStore() {
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <PhoneBar />
      <div className="flex h-9 shrink-0 items-center justify-between px-4"><span className="text-[13px] font-semibold">Atelier Areia</span><ShoppingBag size={15} /></div>
      <Image src="/ecommerce/camiseta-lg.jpg" alt="Camiseta Básica Branca" width={246} height={246} unoptimized className="h-[230px] w-full object-cover" />
      <div className="flex-1 px-4 pt-3">
        <h4 className="text-[15px] font-semibold leading-tight">Camiseta Básica Branca</h4>
        <p className="mt-1 text-[16px] font-semibold tabular-nums">{brl(129.9)}</p>
        <p className={`text-[10.5px] ${MUTED}`}>ou 3x de {brl(43.3)} sem juros</p>
        <div className="mt-3 flex gap-1.5">{SIZES.map((s) => <Chip key={s} on={s === 'M'}>{s}</Chip>)}</div>
      </div>
      <div className="p-4 pb-6"><span className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-[13px] font-semibold text-white">Adicionar à sacola</span></div>
    </div>
  );
}

function PhoneCheckout() {
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <PhoneBar />
      <div className="flex h-9 shrink-0 items-center justify-center border-b border-[#ececec] text-[13px] font-semibold">Pagamento</div>
      <div className="flex flex-1 flex-col items-center px-5 pt-5">
        <p className="text-[15px] font-semibold">Pague com Pix</p>
        <p className={`mt-0.5 text-[11px] ${MUTED}`}>Abra o app do seu banco e escaneie</p>
        <div className="mt-4 rounded-xl border border-[#e5e5e5] p-3"><FakeQr size={150} /></div>
        <span className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#d4d4d4] text-[12px] font-medium">Copiar código Pix</span>
        <div className="mt-5 flex w-full items-baseline justify-between border-t border-[#ececec] pt-3"><span className={`text-[12px] ${MUTED}`}>Total</span><span className="text-[17px] font-semibold tabular-nums">{brl(154.8)}</span></div>
        <span className="mt-3 rounded bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800">Aguardando pagamento</span>
      </div>
    </div>
  );
}

function PhoneDone() {
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <PhoneBar />
      <div className="flex flex-1 flex-col items-center px-5 pt-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white"><Check size={28} strokeWidth={3} /></span>
        <p className="mt-5 text-[19px] font-semibold tracking-tight">Pedido confirmado</p>
        <p className={`mt-1 text-[12px] ${MUTED}`}>#4822 · Camiseta Básica Branca</p>
        <p className="mt-5 text-[26px] font-semibold tabular-nums">{brl(154.8)}</p>
        <div className="mt-7 w-full space-y-2.5 border-t border-[#ececec] pt-5 text-left text-[12px]">
          {['Pagamento confirmado', 'Estoque reservado', 'Nota fiscal em emissão'].map((t) => (
            <p key={t} className="flex items-center gap-2"><Check size={13} className="text-brand" strokeWidth={3} />{t}</p>
          ))}
        </div>
        <p className={`mt-6 text-[11px] ${MUTED}`}>O rastreio chega por e-mail.</p>
      </div>
    </div>
  );
}

/* ---------- Quadros ---------- */
function MacFrame({ step }: { step: number }) {
  return (
    <div className="w-[700px]">
      <div className="rounded-[16px] bg-[#0f0f10] p-[9px] shadow-[0_40px_80px_-30px_rgba(10,20,40,0.55)] ring-1 ring-white/10">
        <div className="relative h-[438px] w-full overflow-hidden rounded-[8px] bg-white">
          <Screen active={step === 0}><MacStore /></Screen>
          <Screen active={step === 1}><MacCheckout /></Screen>
          <Screen active={step === 2}><MacAdmin /></Screen>
        </div>
      </div>
      <div className="mx-auto h-[13px] w-[760px] -translate-x-[30px] rounded-b-[14px] bg-gradient-to-b from-[#d9d9de] to-[#a9a9b0] shadow-[0_16px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="mx-auto h-[5px] w-[110px] rounded-b-md bg-[#8e8e95]" />
      </div>
    </div>
  );
}

function PhoneFrame({ step }: { step: number }) {
  return (
    <div className="w-[262px] rounded-[42px] bg-[#0f0f10] p-[8px] shadow-[0_40px_80px_-24px_rgba(10,20,40,0.65)] ring-1 ring-white/15">
      <div className="relative h-[524px] w-full overflow-hidden rounded-[34px] bg-white">
        <Screen active={step === 0}><PhoneStore /></Screen>
        <Screen active={step === 1}><PhoneCheckout /></Screen>
        <Screen active={step === 2}><PhoneDone /></Screen>
        <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-[20px] w-[72px] -translate-x-1/2 rounded-full bg-[#0f0f10]" />
        <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 z-10 h-1 w-[84px] -translate-x-1/2 rounded-full bg-[#171717]/80" />
      </div>
    </div>
  );
}

/** Palco: Mac e iPhone sobrepostos. Abaixo de md mostra só o iPhone, em tamanho real. */
export function EcommerceDevices({ step }: { step: number }) {
  const { ref, scale } = useFit(STAGE_W);
  return (
    <div role="group" aria-label="Loja de exemplo no computador e no celular: página de produto, checkout com Pix e pedido na fila">
      <div className="flex justify-center md:hidden"><PhoneFrame step={step} /></div>
      <div ref={ref} className="hidden w-full md:block" style={{ height: STAGE_H * scale }}>
        <div className="relative origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          <div className="absolute left-0 top-0"><MacFrame step={step} /></div>
          <div className="absolute right-0 top-[70px]"><PhoneFrame step={step} /></div>
        </div>
      </div>
    </div>
  );
}

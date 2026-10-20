import { cn } from "@/lib/utils";

export type TokenKind = "kw" | "fn" | "str" | "num" | "cm" | "punct" | "var" | "plain";

export interface CodeToken {
  t: TokenKind;
  v: string;
}

export type CodeLine = readonly CodeToken[];

export interface CodeTab {
  name: string;
  active?: boolean;
}

export interface CodeBlockProps {
  lines: readonly CodeLine[];
  /** Abas de arquivos (variante editor). */
  tabs?: readonly CodeTab[];
  /** Título da janela (variante terminal) ou texto à direita da barra. */
  title?: string;
  variant?: "editor" | "terminal";
  /** Linhas destacadas, 1-based. */
  highlightLines?: readonly number[];
  showLineNumbers?: boolean;
  ariaLabel: string;
  className?: string;
}

// Painel SEMPRE escuro, independente do tema. Cores só aqui, nos tokens.
const TOKEN_COLOR: Record<TokenKind, string> = {
  kw: "text-[#ff8da0]",
  fn: "text-[#ffc47e]",
  str: "text-[#94d9ae]",
  num: "text-[#d4a5ff]",
  cm: "text-[#8c8c9a] italic",
  punct: "text-[#a5a5b2]",
  var: "text-[#f6dede]",
  plain: "text-[#e6e6ea]",
};

/** Atalho para montar linhas: tok("kw", "const"). */
export const tok = (t: TokenKind, v: string): CodeToken => ({ t, v });

export function CodeBlock({
  lines,
  tabs,
  title,
  variant = "editor",
  highlightLines = [],
  showLineNumbers = true,
  ariaLabel,
  className,
}: CodeBlockProps) {
  const hl = new Set(highlightLines);
  const terminal = variant === "terminal";
  const numWidth = String(lines.length).length;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] text-left",
        "shadow-[0_1px_1px_rgba(0,0,0,.2),0_16px_32px_-8px_rgba(0,0,0,.35),0_40px_80px_-30px_rgba(60,0,10,.4)]",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
        className,
      )}
    >
      <div className="flex items-end gap-3 border-b border-white/[0.07] bg-white/[0.025] pl-4 pr-3">
        <div className="flex items-center gap-1.5 self-center py-3" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff8a96]/80" />
          <span className="size-2.5 rounded-full bg-[#ffc58a]/80" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </div>
        {!terminal && tabs && tabs.length > 0 ? (
          <div className="ml-2 flex min-w-0 flex-1 gap-1 overflow-x-auto" role="tablist" aria-label="Arquivos">
            {tabs.map((tab) => (
              <span
                key={tab.name}
                role="tab"
                aria-selected={Boolean(tab.active)}
                className={cn(
                  "relative whitespace-nowrap px-3 py-2.5 font-mono text-[11.5px]",
                  tab.active ? "text-white" : "text-[#8d8d99]",
                )}
              >
                {tab.name}
                {tab.active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#ff8a96] to-[#c90000]" />
                ) : null}
              </span>
            ))}
          </div>
        ) : (
          <span className="flex-1 truncate py-2.5 text-center font-mono text-[11.5px] text-[#8d8d99]">
            {title}
          </span>
        )}
        {terminal ? <span className="w-12" aria-hidden="true" /> : null}
      </div>

      <div
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="overflow-x-auto py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff8da0]/60"
      >
        <pre className="m-0 min-w-max font-mono text-[12.5px] leading-[1.7]">
          <code>
            {lines.map((line, i) => {
              const n = i + 1;
              const on = hl.has(n);
              return (
                <span
                  key={i}
                  className={cn(
                    "flex border-l-2 pr-5",
                    on ? "border-[#ff5a6e] bg-[#ff5a6e]/[0.09]" : "border-transparent",
                  )}
                >
                  {showLineNumbers ? (
                    <span
                      aria-hidden="true"
                      className="mr-4 inline-block shrink-0 select-none pl-3 text-right text-[#84848f]"
                      style={{ width: `${numWidth + 2}ch`, boxSizing: "content-box" }}
                    >
                      {n}
                    </span>
                  ) : (
                    <span className="w-3 shrink-0" aria-hidden="true" />
                  )}
                  <span className="whitespace-pre">
                    {line.length === 0 ? " " : null}
                    {line.map((tk, j) => (
                      <span key={j} className={TOKEN_COLOR[tk.t]}>
                        {tk.v}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

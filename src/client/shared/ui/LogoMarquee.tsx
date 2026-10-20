import Image from 'next/image'

interface LogoMarqueeProps {
  items: {
    name: string;
    logo: string;
    bright?: boolean;
    invert?: boolean;
  }[]
  /** Mantido por compatibilidade: a faixa é estática (sem animação). */
  speed?: number
}

/**
 * Faixa de logos de clientes, estática, como na Stripe. Os arquivos já vêm cortados rente ao
 * conteúdo, então todos cabem numa caixa de mesma altura. Logos coloridos viram escala de cinza;
 * os logos claros (`bright`, brancos ou bege sobre fundo transparente) viram silhueta cinza
 * (brightness-0 + opacidade). No tema escuro tudo é invertido para tons claros, senão os logos
 * escuros somem no fundo preto. Sem animação contínua.
 */
export function LogoMarquee({ items }: LogoMarqueeProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-12 md:py-12">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-8 sm:gap-x-10">
        {items.map((item) => (
          <li key={item.name} className="relative h-9 w-24 sm:w-28 md:h-11 md:w-32">
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className={
                item.bright
                  ? 'object-contain opacity-60 brightness-0 dark:opacity-80 dark:invert'
                  : 'object-contain grayscale opacity-70 dark:opacity-80 dark:invert'
              }
              sizes="(min-width: 768px) 144px, 112px"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

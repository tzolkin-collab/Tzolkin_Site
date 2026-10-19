import Image from 'next/image'

interface LogoMarqueeProps {
  items: {
    name: string;
    logo: string;
    bright?: boolean;
    invert?: boolean;
  }[]
  /** Mantido por compatibilidade: a faixa agora é estática (sem animação). */
  speed?: number
}

/**
 * Faixa de logos de clientes em escala de cinza, estática, como na Stripe.
 * Sem animação contínua: evita recálculo de estilo por frame. Logos claros ganham um
 * cartão escuro para não sumirem no fundo branco.
 */
export function LogoMarquee({ items }: LogoMarqueeProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-12">
      <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <li
            key={item.name}
            className={`relative h-12 w-full max-w-[140px] md:h-14 ${item.bright ? 'rounded-xl bg-neutral-900' : ''}`}
          >
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className={`object-contain grayscale opacity-70 dark:opacity-80 ${item.bright ? 'p-2' : ''}`}
              sizes="(min-width: 1024px) 140px, 33vw"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

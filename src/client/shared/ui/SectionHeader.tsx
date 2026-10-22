import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  /** Continuação do título em cinza (estilo Stripe: frase forte + frase suave). */
  muted?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  id?: string;
}

export function SectionHeader({ eyebrow, title, muted, description, align = 'left', id }: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
         <h2 id={id} className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.08]">
        {title}
        {muted && <span className="text-muted-foreground"> {muted}</span>}
      </h2>
      {description && <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">{description}</p>}
    </div>
  );
}

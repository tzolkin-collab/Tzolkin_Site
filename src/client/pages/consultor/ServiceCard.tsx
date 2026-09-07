"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/client/shared/ui/Button";
import Link from "next/link";

import { pricingData } from "@/client/shared/data/pricingData";

interface ServiceCardProps {
  slug: string;
  reason: string;
}

export function ServiceCard({ slug, reason }: ServiceCardProps) {
  const service = pricingData.find(p => p.slug === slug);
  const [showDetails, setShowDetails] = React.useState(false);

  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 w-full max-w-[380px] ${service.popular
        ? "bg-brand/5 border-brand/50"
        : "bg-white/5 dark:bg-neutral-900 border-border/50 hover:border-brand/30"
        }`}
    >
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand text-black text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
          Mais Procurado
        </div>
      )}

      <h4 className="text-lg font-bold text-foreground mb-1">
        {service.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        {service.description}
      </p>

      {/* Reason from bot */}
      <div className="bg-brand/10 border border-brand/20 rounded-lg p-2.5 mb-3">
        <p className="text-xs font-medium text-foreground/80 italic">
          {reason}
        </p>
      </div>

      {(service.price || service.dropPrice) && (
        <div className="flex items-end gap-2 mb-3">
          {service.dropPrice && (
            <span className="text-sm font-bold text-muted-foreground/40 line-through">
              {service.dropPrice}
            </span>
          )}
          {service.price && (
            <span className="text-xl font-black tracking-tight text-foreground">
              {service.price}
            </span>
          )}
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs font-semibold text-brand hover:underline self-start mb-3"
      >
        {showDetails ? "Ocultar detalhes" : "Ver detalhes"}
      </button>

      {showDetails && (
        <div className="mb-4">
          {service.paymentText && (
            <p className="inline-block px-1.5 py-0.5 bg-brand text-[10px] font-bold text-black uppercase tracking-wider mb-3 w-fit">
              {service.paymentText}
            </p>
          )}

          <div className="space-y-2">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span className="text-xs text-foreground/80 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link href={`/forms?service=${slug}`} className="mt-auto">
        <Button
          variant="primary"
          className="w-full rounded-full h-10 text-xs tracking-wide uppercase font-bold transition-all flex items-center justify-center gap-2 bg-brand text-black hover:bg-white hover:text-black border-none"
        >
          Tenho Interesse
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </motion.div>
  );
}

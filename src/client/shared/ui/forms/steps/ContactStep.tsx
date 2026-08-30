'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext, FormData } from '../FormContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/client/shared/ui/Button';
import { ArrowRight, User } from 'lucide-react';
import { trackEvent } from '@/client/shared/utils/analytics';

export function ContactStep() {
  const searchParams = useSearchParams();
  const { formData, updateData } = useFormContext();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: formData });
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    updateData({
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp
    });
    
    // Progress is not a persisted lead. Do not send personal data to analytics.
    trackEvent('form_started', { eventName: 'lead_form_started' });
    
    const query = new URLSearchParams();
    ['service', 'interesse'].forEach((key) => {
      const value = searchParams.get(key);
      if (value) query.set(key, value);
    });
    const qs = query.toString();
    router.push(`/forms/empresa${qs ? `?${qs}` : ''}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto rounded-[2rem] p-8 md:p-12 relative"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand mb-1">Passo 1 de 4</h2>
          <h3 className="text-3xl font-bold text-foreground">Informações de contato</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="group/field">
          <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2 group-focus-within/field:text-brand transition-colors">Nome e sobrenome</label>
          <input
            {...register('fullName', { required: 'Nome é obrigatório' })}
            className="w-full bg-foreground/5 px-4 rounded-xl border border-border focus:border-brand outline-none py-4 text-xl transition-all placeholder:text-foreground/30 focus:bg-background"
            placeholder="Qual é o seu nome?"
          />
          {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName.message}</span>}
        </div>

        <div className="group/field">
          <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2 group-focus-within/field:text-brand transition-colors">E-mail corporativo</label>
          <input
            {...register('email', { required: 'E-mail é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Informe um e-mail válido, como nome@empresa.com.' } })}
            className="w-full bg-foreground/5 px-4 rounded-xl border border-border focus:border-brand outline-none py-4 text-xl transition-all placeholder:text-foreground/30 focus:bg-background"
            placeholder="seu@email.com"
            type="email"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
        </div>

        <div className="group/field">
          <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2 group-focus-within/field:text-brand transition-colors">WhatsApp</label>
          <input
            {...register('whatsapp', { required: 'WhatsApp é obrigatório' })}
            className="w-full bg-foreground/5 px-4 rounded-xl border border-border focus:border-brand outline-none py-4 text-xl transition-all placeholder:text-foreground/30 focus:bg-background"
            placeholder="(11) 99999-9999"
            type="tel"
          />
          {errors.whatsapp && <span className="text-red-500 text-xs mt-1 block">{errors.whatsapp.message}</span>}
        </div>

        <div className="pt-6 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="rounded-full px-12 h-16 text-lg bg-foreground text-background hover:bg-brand hover:text-black transition-all duration-300 font-bold tracking-wide flex items-center justify-center gap-3"
          >
            Avançar
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

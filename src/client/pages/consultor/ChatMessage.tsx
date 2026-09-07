'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Volume2 } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { LeadSummaryCard } from './LeadSummaryCard';
import { LeadProfile } from './QualificationEngine';
import useEmblaCarousel from 'embla-carousel-react';

export interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  serviceCards?: Array<{ slug: string; reason: string }>;
  leadSummary?: LeadProfile;
  timestamp: Date;
}

interface ChatMessageProps {
  message: MessageData;
  onSpeak?: (text: string) => void;
  onUpdateLead?: (lead: LeadProfile) => void;
}

export function ChatMessage({ message, onSpeak, onUpdateLead }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const cleanContent = message.content.replace(/<service_card>[\s\S]*?(<\/service_card>|$)/gi, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'} w-full`}
    >
      {/* Avatar — bot only */}
      {!isUser && (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-brand" />
        </div>
      )}

      <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} max-w-[92%] md:max-w-[80%]`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3.5 md:px-5 md:py-4 rounded-3xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm ${
            isUser
              ? 'bg-foreground text-background rounded-br-md font-medium'
              : 'bg-card border border-border/70 text-foreground rounded-bl-md'
          }`}
        >
          {cleanContent}
        </div>

        {/* Ficha de Lead gerada */}
        {!isUser && message.leadSummary && (
          <div className="w-full mt-2">
            <LeadSummaryCard lead={message.leadSummary} onUpdateLead={onUpdateLead} />
          </div>
        )}

        {/* Service cards from bot */}
        {!isUser && message.serviceCards && message.serviceCards.length > 0 && (
          <div className="w-full mt-2 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-4 pt-2 cursor-grab active:cursor-grabbing touch-pan-y">
              {message.serviceCards.map((card, idx) => (
                <div key={idx} className="shrink-0 w-[280px] md:w-[320px]">
                  <ServiceCard slug={card.slug} reason={card.reason} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé da mensagem: Horário e botão de ouvir */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-[11px] text-muted-foreground">
            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && onSpeak && cleanContent && (
            <button
              type="button"
              onClick={() => onSpeak(cleanContent)}
              className="text-muted-foreground hover:text-brand transition-colors p-1 rounded-md hover:bg-foreground/5 flex items-center gap-1 text-[11px]"
              title="Ouvir mensagem"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ouvir</span>
            </button>
          )}
        </div>
      </div>

      {/* Avatar — user only */}
      {isUser && (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-foreground/10 border border-border flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <User className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
        </div>
      )}
    </motion.div>
  );
}

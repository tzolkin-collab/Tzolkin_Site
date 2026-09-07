'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Mic,
  MicOff,
  Plus,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Loader2,
  ExternalLink,
  MessageSquare,
  FileText,
  Mail,
  X
} from 'lucide-react';
import { ChatMessage, MessageData } from './ChatMessage';
import { sendMessage } from './chatApi';
import { pricingData } from '@/client/shared/data/pricingData';
import { useSpeech } from './useSpeech';
import { useRouter } from 'next/navigation';
import {
  CONSULTOR_INFO,
  LeadProfile,
  extractLeadInfo,
  buildWhatsAppUrl
} from './QualificationEngine';

type ChatIntent = 'idea' | 'catalog' | null;

export function ChatWindow() {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [intent, setIntent] = useState<ChatIntent>(null);
  const [qualifyStep, setQualifyStep] = useState<number>(0);
  const [lead, setLead] = useState<LeadProfile>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    ttsEnabled,
    setTtsEnabled,
    hasSttSupport,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useSpeech();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
          inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 180) + 'px';
        }
      });
    }
  };

  const startFlow = (chosenIntent: 'form' | 'idea' | 'catalog') => {
    if (chosenIntent === 'form') {
      router.push('/forms');
      return;
    }
    setIntent(chosenIntent);
    setQualifyStep(0);
    
    // Create first bot message asking for name
    const greetingMsg: MessageData = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: chosenIntent === 'idea' 
        ? 'Ótimo! Adoraria ouvir a sua ideia. Antes disso, como posso te chamar?'
        : 'Claro, vou te enviar o nosso portfólio. Como posso te chamar?',
      timestamp: new Date(),
    };
    setMessages([greetingMsg]);
  };

  const handleSend = async (customMessage?: string) => {
    const textToSend = typeof customMessage === 'string' ? customMessage : input;
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    stopSpeaking();
    if (isListening) stopListening();

    const updatedLead = extractLeadInfo(trimmed, lead);
    setLead(updatedLead);

    const userMsg: MessageData = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      let replyText = '';
      let serviceCards: Array<{ slug: string; reason: string }> = [];

      if (intent === 'catalog') {
        if (qualifyStep === 0) {
          setQualifyStep(1);
          replyText = `Muito prazer! E qual o nome da sua empresa?`;
        } else if (qualifyStep === 1) {
          setQualifyStep(2);
          replyText = `Perfeito. Aqui estão os principais formatos de trabalho e o catálogo dos nossos projetos recentes. Se quiser tirar dúvidas sobre algo específico, pode me perguntar aqui ou falar com nossa equipe no WhatsApp!`;
          serviceCards = pricingData.map(p => ({ slug: p.slug, reason: p.description }));
        } else {
          // Allow them to ask questions about the catalog
          const response = await sendMessage(sessionId, trimmed);
          if (!sessionId) setSessionId(response.sessionId);
          replyText = response.reply;
          serviceCards = response.serviceCards || [];
        }
      } else if (intent === 'idea') {
        if (qualifyStep === 0) {
          setQualifyStep(1);
          replyText = `Muito prazer! E qual o nome da sua empresa?`;
        } else if (qualifyStep === 1) {
          setQualifyStep(2);
          replyText = `Perfeito. Agora, me conte com detalhes a ideia de software, gargalo operacional ou integração que você quer desenvolver:`;
        } else {
          // Send idea to API to get feedback
          const response = await sendMessage(sessionId, "[IDEIA]: " + trimmed);
          if (!sessionId) setSessionId(response.sessionId);
          replyText = response.reply;
          serviceCards = response.serviceCards || [];
        }
      }

      const shouldAttachLeadCard = qualifyStep >= 2;

      const assistantMsg: MessageData = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        serviceCards: serviceCards.length > 0 ? serviceCards : undefined,
        leadSummary: shouldAttachLeadCard ? updatedLead : undefined,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      speak(replyText);
    } catch {
      const errorMsg: MessageData = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Tivemos um problema de conexão. Você pode clicar no botão abaixo para dar sequência diretamente no WhatsApp com a equipe técnica da TZOLKIN.',
        leadSummary: updatedLead,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasStartedChat = intent !== null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-background">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-brand/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* ── Top Bar Minimalista (Atalhos e áudio) ── */}
      <div className="flex items-center justify-end px-4 md:px-8 py-3 bg-background/70 backdrop-blur-xl z-30 shrink-0">
        <div className="flex items-center gap-2">


          <button
            type="button"
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              ttsEnabled
                ? 'bg-brand/10 border-brand/40 text-brand'
                : 'bg-card/40 border-border text-muted-foreground hover:text-foreground'
            }`}
            title={ttsEnabled ? 'Voz ativada' : 'Voz desativada'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {hasStartedChat && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
              title="Nova conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Conteúdo Central (Imersivo e Minimalista) ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
        {!hasStartedChat ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center my-auto py-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
              Como gostaria de começar?
            </h2>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => startFlow('form')}
                className="px-4 py-3 rounded-xl border border-border bg-card hover:border-brand/50 hover:bg-card/80 transition-all text-sm font-medium text-foreground"
              >
                Preencher Formulário Tradicional
              </button>
              <button
                onClick={() => startFlow('idea')}
                className="px-4 py-3 rounded-xl border border-border bg-card hover:border-brand/50 hover:bg-card/80 transition-all text-sm font-medium text-foreground"
              >
                Explicar minha ideia no Chat
              </button>
              <button
                onClick={() => startFlow('catalog')}
                className="px-4 py-3 rounded-xl border border-border bg-card hover:border-brand/50 hover:bg-card/80 transition-all text-sm font-medium text-foreground"
              >
                Ver o catálogo de projetos
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-5 pb-4">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSpeak={speak}
                  onUpdateLead={(updated) => setLead(updated)}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-center"
              >
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-brand animate-spin" />
                </div>
                <div className="bg-card border border-border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 text-brand animate-spin" />
                  <span className="text-xs text-muted-foreground font-medium">Analisando arquitetura da sua demanda...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input Flutuante Minimalista (ChatGPT Style Puro) ── */}
      {hasStartedChat && (
        <div className="px-4 md:px-8 pb-5 pt-2 shrink-0 bg-gradient-to-t from-background via-background/90 to-transparent z-20">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative rounded-[28px] border border-border/80 bg-card/95 backdrop-blur-2xl shadow-xl p-3 md:p-3.5 transition-all focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20">
              
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Escreva sua mensagem..."
                rows={1}
                className="w-full bg-transparent border-none outline-none resize-none text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 px-3 py-1.5 max-h-[160px] leading-relaxed"
              />

              <div className="flex items-center justify-end pt-2 border-t border-border/40">
                {/* Controles de Envio: Microfone e Seta */}
                <div className="flex items-center gap-2">
                  {hasSttSupport && (
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40 scale-105'
                          : 'hover:bg-foreground/5 text-muted-foreground hover:text-foreground'
                      }`}
                      title={isListening ? 'Gravando voz... clique para parar' : 'Falar por voz'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-full bg-foreground text-background disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md cursor-pointer"
                    title="Enviar mensagem"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

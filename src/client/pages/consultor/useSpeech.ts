'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [hasSttSupport, setHasSttSupport] = useState(false);
  const [hasTtsSupport, setHasTtsSupport] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setHasSttSupport(true);
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    if ('speechSynthesis' in window) {
      setHasTtsSupport(true);
    }
  }, []);

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      if (!recognitionRef.current) return;
      try {
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          onResult(transcript);
        };
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Erro ao iniciar reconhecimento de voz:', err);
        setIsListening(false);
      }
    },
    []
  );

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // Ignora se já estiver parado
    }
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!hasTtsSupport || !ttsEnabled || typeof window === 'undefined') return;

      try {
        window.speechSynthesis.cancel();

        const cleanText = text
          .replace(/<[^>]*>?/gm, '')
          .replace(/[*#_~`]/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Erro na síntese de voz:', err);
        setIsSpeaking(false);
      }
    },
    [hasTtsSupport, ttsEnabled]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    ttsEnabled,
    setTtsEnabled,
    hasSttSupport,
    hasTtsSupport,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}

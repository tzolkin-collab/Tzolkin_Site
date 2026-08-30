"use client";

import Image from "next/image";
import { useChat } from "@/client/shared/providers/ChatProvider";

export function FloatingChatButton() {
  const { toggleChat, isChatOpen } = useChat();

  if (isChatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[40] transition-transform duration-300 hover:scale-110 active:scale-95 group">
      {/* Border Container */}
      <div className="relative mb-10 rounded-full p-[2px] overflow-hidden flex items-center justify-center shadow-xl border border-brand/30 hover:border-brand transition-colors bg-background">
        {/* Button Content */}
        <button
          onClick={toggleChat}
          className="relative z-10 inline-block rounded-full cursor-pointer bg-black overflow-hidden backface-hidden"
          aria-label="Abrir chat consultor"
        >
          <Image
            src="/logotzolkin.svg"
            alt="TZOLKIN Logo"
            width={56}
            height={56}
            className="rounded-full object-contain dark:hidden"
          />
          <Image
            src="/logotzolkin-white.svg"
            alt="TZOLKIN Logo"
            width={56}
            height={56}
            className="rounded-full object-contain hidden dark:block"
          />
        </button>
      </div>
    </div>
  );
}

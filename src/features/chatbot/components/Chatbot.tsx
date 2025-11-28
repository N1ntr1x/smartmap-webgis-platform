"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faXmark, faPaperPlane, faCircle, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import type { Message, SpatialSearchData } from "@/features/chatbot";
import { SpatialSearchToggle } from "@/features/chatbot";
import { useChatbotFeatures } from "@/features/chatbot";
import ChatMessage from "@/features/chatbot/components/ChatMessage";
import "@/styles/scrollbar.css";
import { APP_CONFIG } from "@/configs";
import { Button } from "@/components/ui"

interface ChatbotProps {
  messages: Message[];
  sendMessage: (message: string, spatialData?: SpatialSearchData) => void;
  isWaiting: boolean;
  onClose?: () => void;
  onNewChat: () => void;
}

/*
Chatbot - Componente principale interfaccia chat
Gestisce rendering messaggi, input utente, scroll automatico e ricerca spaziale
*/
export default function Chatbot({ messages, sendMessage, isWaiting, onClose, onNewChat }: ChatbotProps) {
  const [input, setInput] = useState("");
  const { spatialSearch } = useChatbotFeatures();
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

  const handleSend = () => {
    if (isWaiting || input.trim().length < 3) return;

    // Invia messaggio con eventuali dati ricerca spaziale
    if (spatialSearch.isActive && spatialSearch.data) {
      sendMessage(input, spatialSearch.data);
    } else {
      sendMessage(input);
    }

    setInput("");
    shouldScrollRef.current = true; // Flag per scroll al prossimo messaggio utente
  };

  // Scroll automatico solo dopo invio messaggio utente
  useEffect(() => {
    if (shouldScrollRef.current && lastUserMessageRef.current) {
      const timer = setTimeout(() => {
        lastUserMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        shouldScrollRef.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Trova indice ultimo messaggio utente per ref scroll
  const lastUserMessageIndex = messages
    .map((msg, idx) => (msg.sender === "user" ? idx : -1))
    .filter((idx) => idx !== -1)
    .pop();

  return (
    <div className="absolute bottom-0 right-0 w-xs h-[80vh] sm:h-[70vh] lg:w-100 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header chat con info bot e controlli */}
      <div className="flex items-center justify-between mb-2 bg-blue-600 text-white px-4 py-4 rounded-t-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-white rounded-full px-2 py-2.5 text-lg">
            <FontAwesomeIcon icon={faRobot} className="text-blue-600" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base">{`Assistente ${APP_CONFIG.name}`}</span>
            <span className="flex items-center justify-start text-xs text-white gap-1">
              <FontAwesomeIcon icon={faCircle} className="text-green-400" />
              Online <span className="hidden sm:block">e pronto ad aiutarti</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="normal" size="icon" onClick={onNewChat} title="Nuova Chat" className="text-white hover:bg-blue-700 rounded-lg">
            <FontAwesomeIcon icon={faSyncAlt} />
          </Button>
          {onClose && (
            <Button variant="normal" size="icon" onClick={onClose} title="Chiudi Chat" className="text-white hover:bg-blue-700 rounded-lg">
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          )}
        </div>
      </div>

      {/* Area messaggi con scroll */}
      <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden flex flex-col gap-2 custom-scrollbar-general">
        {messages.map((msg, idx) => {
          const isLastUserMessage = idx === lastUserMessageIndex;

          return (
            <div
              key={idx}
              ref={isLastUserMessage ? lastUserMessageRef : null}
            >
              <ChatMessage msg={msg} idx={idx} />
            </div>
          );
        })}
      </div>

      <hr className="border-none h-0.5 mx-2 bg-gray-400" />

      {/* Input area con ricerca spaziale e invio */}
      <div className="p-3 flex flex-col gap-2">
        <SpatialSearchToggle />

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              isWaiting
                ? "Attendi la risposta del bot..."
                : "Scrivi qui il tuo messaggio..."
            }
            className="text-gray-600 flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 select-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isWaiting}
          />

          <Button variant="primary" onClick={handleSend} disabled={isWaiting || input.trim().length < 3} size="icon-md">
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </div>
      </div>
    </div>
  );
}

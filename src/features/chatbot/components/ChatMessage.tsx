import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import SaveButton from "@/features/chatbot/components/SaveButton";
import type { Message } from "@/features/chatbot";

interface ChatMessageProps {
  msg: Message;
  idx: number;
}

/*
ChatMessage - Componente singolo messaggio chat
Layout responsive con avatar, contenuto e pulsante salvataggio
*/
const ChatMessage = React.memo(({ msg, idx }: ChatMessageProps) => {
  return (
    <div className={`flex items-start gap-2 w-full ${msg.sender === "bot" ? "" : "justify-end"}`}>
      {/* Avatar utente o bot */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === "bot" ? "bg-gray-300" : "order-2 bg-blue-600"
          }`}
      >
        <FontAwesomeIcon
          icon={msg.sender === "bot" ? faRobot : faUser}
          className="text-base text-white"
        />
      </div>

      {/* Contenuto messaggio con markdown support */}
      <div
        className={`flex flex-col min-w-0 ${msg.sender === "bot" ? "items-start" : "items-end order-1"
          }`}
      >
        <div
          className={`p-2 rounded-lg shadow-sm ring-1 w-full sm:max-w-[400px] ${msg.sender === "bot"
              ? "bg-white text-gray-800 ring-gray-300"
              : "bg-blue-600 text-white ring-blue-700"
            }`}
        >
          <div
            className={`prose prose-sm max-w-none break-words overflow-hidden ${msg.sender === "user" ? "text-white" : ""
              }`}
            style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
              wordBreak: "break-word"
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-1">{msg.time}</div>

        {/* Pulsante salvataggio solo per risposte bot con geojson */}
        {msg.sender === "bot" && msg.geojsonData && (
          <SaveButton
            query={msg.userQuery || ""}
            answer={msg.answer || "Nessuna risposta"}
            geojsonData={msg.geojsonData}
            messageIndex={idx}
          />
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;

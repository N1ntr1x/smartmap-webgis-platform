"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { Chatbot, useChatbot } from "@/features/chatbot";
import { Button } from "@/components/ui";

interface MapChatBotProps {
    isOpen: boolean;
    onToggle: () => void;
}

/*
MapChatbot - Wrapper chatbot per mappa
Gestisce toggle tra pulsante apertura e pannello chat completo
*/
export default function MapChatBot({ isOpen, onToggle }: MapChatBotProps) {
    const { messages, sendMessage, isWaiting, startNewChat } = useChatbot();

    return (
        <>
            {!isOpen && (
                <Button onClick={onToggle} variant="map-button" size="icon-lg" className="rounded-lg">
                    <FontAwesomeIcon icon={faComment} color="red" size="2xl" />
                </Button>
            )}

            {isOpen && (
                <Chatbot
                    messages={messages}
                    sendMessage={sendMessage}
                    isWaiting={isWaiting}
                    onClose={onToggle}
                    onNewChat={startNewChat}
                />
            )}
        </>
    );
}

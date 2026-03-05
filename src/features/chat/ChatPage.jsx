import React, { useState } from 'react';
import { useChatData } from './hooks/useChatData';
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        user,
        conversaciones,
        mensajes,
        loadingConversations,
        loadingMessages,
        sendMutation,
        getOtherParticipant,
        getUnreadCount,
    } = useChatData(selectedConversation?.id);

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            <ConversationList
                conversaciones={conversaciones}
                loadingConversations={loadingConversations}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
                getOtherParticipant={getOtherParticipant}
                getUnreadCount={getUnreadCount}
            />
            <ChatArea
                selectedConversation={selectedConversation}
                user={user}
                mensajes={mensajes}
                loadingMessages={loadingMessages}
                getOtherParticipant={getOtherParticipant}
                sendMutation={sendMutation}
            />
        </div>
    );
}

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

    // Derived state: find the latest version of the selected conversation in the current list
    const currentConversation = conversaciones.find(c => c.id === selectedConversation?.id) || selectedConversation;

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
                selectedConversation={currentConversation}
                user={user}
                mensajes={mensajes}
                loadingMessages={loadingMessages}
                getOtherParticipant={getOtherParticipant}
                sendMutation={sendMutation}
            />
        </div>
    );
}

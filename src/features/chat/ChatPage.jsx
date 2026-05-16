import { useState, useEffect } from 'react';
import { useChatData } from './hooks/useChatData';
import { useIsMobile } from '@/hooks/use-mobile';
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useIsMobile();
    const [showMobileChat, setShowMobileChat] = useState(false);

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

    // Sync mobile view state when selection changes
    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
        if (isMobile) setShowMobileChat(true);
    };

    useEffect(() => {
        if (!selectedConversation) setShowMobileChat(false);
    }, [selectedConversation]);

    // Derived state: find the latest version of the selected conversation in the current list
    const currentConversation = conversaciones.find(c => c.id === selectedConversation?.id) || selectedConversation;

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-0 lg:gap-4 overflow-hidden min-h-0">
            {(!isMobile || !showMobileChat) && (
                <ConversationList
                    conversaciones={conversaciones}
                    loadingConversations={loadingConversations}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={handleSelectConversation}
                    getOtherParticipant={getOtherParticipant}
                    getUnreadCount={getUnreadCount}
                    className="w-full lg:w-80 flex-shrink-0"
                />
            )}
            
            {(!isMobile || showMobileChat) && (
                <ChatArea
                    selectedConversation={currentConversation}
                    user={user}
                    mensajes={mensajes}
                    loadingMessages={loadingMessages}
                    getOtherParticipant={getOtherParticipant}
                    sendMutation={sendMutation}
                    isMobile={isMobile}
                    onBack={() => setShowMobileChat(false)}
                    className={`flex-1 min-w-0 ${
                        isMobile && showMobileChat ? 'fixed inset-0 z-[100] h-full w-full bg-background rounded-none border-none' : ''
                    }`}
                />
            )}
        </div>
    );
}

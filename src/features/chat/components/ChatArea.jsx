import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    MessageSquare,
    Send,
    Paperclip,
    MoreVertical,
    Check,
    CheckCheck,
    File,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import EmptyState from '@/components/ui/EmptyState';
import ChatActionPanel from './ChatActionPanel';
import ReviewModal from './ReviewModal';
import { useSocketConnectionState } from '../hooks/useSocketConnectionState';
import { WifiOff, Loader2 } from 'lucide-react';

export default function ChatArea({
    selectedConversation,
    user,
    mensajes,
    loadingMessages,
    getOtherParticipant,
    sendMutation,
}) {
    const [messageText, setMessageText] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const connectionStatus = useSocketConnectionState();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const handleSend = () => {
        if (!messageText.trim() && !attachedFile) return;
        sendMutation.mutate(
            { contenido: messageText, archivo: attachedFile, selectedConversation },
            {
                onSuccess: () => {
                    setMessageText('');
                    setAttachedFile(null);
                },
            }
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    if (!selectedConversation) {
        return (
            <Card className="flex-1 border-0 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <EmptyState
                        icon={MessageSquare}
                        title="Selecciona una conversación"
                        description="Elige una conversación de la lista para comenzar a chatear"
                    />
                </div>
            </Card>
        );
    }

    const otherParticipant = getOtherParticipant(selectedConversation);

    return (
        <Card className="flex-1 border-0 shadow-sm flex flex-col overflow-hidden relative">
            {/* Review Overlay */}
            <ReviewModal selectedConversation={selectedConversation} user={user} />

            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={otherParticipant.logo} />
                        <AvatarFallback className="bg-[#D2FC31] text-slate-900">
                            {otherParticipant.nombre?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                                {otherParticipant.nombre || 'Usuario'}
                            </p>
                            {connectionStatus === 'offline' && (
                                <Badge variant="destructive" className="h-5 text-[10px] px-1.5 flex items-center gap-1">
                                    <WifiOff className="w-3 h-3" /> Offline
                                </Badge>
                            )}
                            {connectionStatus === 'reconnecting' && (
                                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Reconectando...
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">En línea</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                </Button>
            </div>

            {/* Negotiation Info Bar */}
            {(selectedConversation.request || selectedConversation.quote_response) && (
                <div className="px-4 py-2 bg-slate-50 border-b flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {selectedConversation.request && (
                        <div className="flex items-center gap-2 min-w-max">
                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 flex gap-1.5 py-1 px-2.5">
                                <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                                    {selectedConversation.request.product_service}
                                </span>
                            </Badge>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 min-w-max">
                        {(selectedConversation.quote_response?.quantity || selectedConversation.request?.quantity) && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-400">Cantidad:</span>
                                <span className="text-slate-700">
                                    {selectedConversation.quote_response?.quantity || selectedConversation.request?.quantity} {selectedConversation.request?.unit || ''}
                                </span>
                            </div>
                        )}

                        {selectedConversation.quote_response?.price && (
                            <div className="flex items-center gap-1.5 border-l pl-4">
                                <span className="text-slate-400">Precio:</span>
                                <span className="text-[#059669] font-bold">
                                    ${Number(selectedConversation.quote_response.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}/u
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {loadingMessages ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div className="h-12 w-48 bg-slate-100 rounded-2xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : mensajes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        Inicia la conversación enviando un mensaje
                    </div>
                ) : (
                    <div className="space-y-3">
                        {mensajes.map((msg, index) => {
                            const isOwn = msg.remitente_id === user?.email;
                            const showDate =
                                index === 0 ||
                                format(new Date(msg.created_date), 'yyyy-MM-dd') !==
                                format(new Date(mensajes[index - 1].created_date), 'yyyy-MM-dd');

                            return (
                                <React.Fragment key={msg.id}>
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {format(new Date(msg.created_date), "d 'de' MMMM", {
                                                    locale: es,
                                                })}
                                            </Badge>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 ${isOwn
                                                        ? 'bg-[#1E293B] text-white rounded-br-md'
                                                        : 'bg-slate-100 text-foreground rounded-bl-md'
                                                    }`}
                                            >
                                                {msg.archivo_adjunto_url && (
                                                    <a
                                                        href={msg.archivo_adjunto_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 mb-2 text-sm ${isOwn ? 'text-[#D2FC31]' : 'text-blue-600'
                                                            }`}
                                                    >
                                                        <File className="w-4 h-4" />
                                                        Ver archivo adjunto
                                                    </a>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {msg.contenido}
                                                </p>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 mt-1 text-xs text-slate-400 ${isOwn ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                {format(new Date(msg.created_date), 'HH:mm')}
                                                {isOwn &&
                                                    (msg.leido ? (
                                                        <CheckCheck className="w-3 h-3 text-[#D2FC31]" />
                                                    ) : (
                                                        <Check className="w-3 h-3" />
                                                    ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Contextual Action Panel (State Machine) */}
            <ChatActionPanel selectedConversation={selectedConversation} user={user} />

            {/* Input */}
            <div className="p-4 border-t">
                {attachedFile && (
                    <div className="mb-3 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                        <File className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600 flex-1 truncate">
                            {attachedFile.name}
                        </span>
                        <button onClick={() => setAttachedFile(null)}>
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="w-5 h-5 text-slate-400" />
                    </Button>
                    <Input
                        placeholder="Escribe un mensaje..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 h-11"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={(!messageText.trim() && !attachedFile) || sendMutation.isPending || connectionStatus === 'offline'}
                        className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] h-11 px-4 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

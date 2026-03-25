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
        <Card className="flex-1 border-0 shadow-sm flex flex-col overflow-hidden">
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
                        <p className="font-semibold text-foreground">
                            {otherParticipant.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs text-slate-500">En línea</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                </Button>
            </div>

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

            {/* Actions */}
            <div className="px-4 py-3 border-t bg-muted/50 flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => toast.success('Propuesta aceptada')}
                >
                    <Check className="w-4 h-4 mr-2" />
                    Aceptar Propuesta
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => toast.error('Propuesta rechazada')}
                >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                </Button>
            </div>

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
                        disabled={(!messageText.trim() && !attachedFile) || sendMutation.isPending}
                        className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] h-11 px-4"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

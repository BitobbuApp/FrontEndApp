import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  User,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import EmptyState from '@/components/ui/EmptyState';

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: conversaciones = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversaciones', user?.email],
    queryFn: async () => {
      const convs = await base44.entities.Conversacion.list('-fecha_ultimo_mensaje');
      return convs.filter(c => 
        c.participante_1_id === user?.email || c.participante_2_id === user?.email
      );
    },
    enabled: !!user?.email,
  });

  const { data: mensajes = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['mensajes', selectedConversation?.id],
    queryFn: () => base44.entities.Mensaje.filter(
      { conversacion_id: selectedConversation?.id },
      'created_date'
    ),
    enabled: !!selectedConversation?.id,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async ({ contenido, archivo }) => {
      let archivo_adjunto_url = null;
      if (archivo) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: archivo });
        archivo_adjunto_url = file_url;
      }

      const destinatario = selectedConversation.participante_1_id === user?.email
        ? selectedConversation.participante_2_id
        : selectedConversation.participante_1_id;

      await base44.entities.Mensaje.create({
        conversacion_id: selectedConversation.id,
        remitente_id: user.email,
        destinatario_id: destinatario,
        contenido,
        archivo_adjunto_url,
      });

      await base44.entities.Conversacion.update(selectedConversation.id, {
        ultimo_mensaje: contenido,
        fecha_ultimo_mensaje: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensajes'] });
      queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
      setMessageText('');
      setAttachedFile(null);
    },
    onError: () => {
      toast.error('Error al enviar mensaje');
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleSend = () => {
    if (!messageText.trim() && !attachedFile) return;
    sendMutation.mutate({ contenido: messageText, archivo: attachedFile });
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

  const getOtherParticipant = (conv) => {
    if (conv.participante_1_id === user?.email) {
      return {
        id: conv.participante_2_id,
        nombre: conv.participante_2_nombre,
        logo: conv.participante_2_logo,
      };
    }
    return {
      id: conv.participante_1_id,
      nombre: conv.participante_1_nombre,
      logo: conv.participante_1_logo,
    };
  };

  const getUnreadCount = (conv) => {
    if (conv.participante_1_id === user?.email) {
      return conv.mensajes_no_leidos_1 || 0;
    }
    return conv.mensajes_no_leidos_2 || 0;
  };

  const filteredConversations = conversaciones.filter(conv => {
    const other = getOtherParticipant(conv);
    return other.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex-shrink-0 border-0 shadow-sm flex flex-col overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar conversación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {loadingConversations ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              No tienes conversaciones aún
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const unread = getUnreadCount(conv);
                const isSelected = selectedConversation?.id === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-[#D2FC31]/20' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={other.logo} />
                      <AvatarFallback className="bg-[#D2FC31] text-[#1E293B] font-medium">
                        {other.nombre?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[#1E293B] truncate">
                          {other.nombre || 'Usuario'}
                        </p>
                        {conv.fecha_ultimo_mensaje && (
                          <span className="text-xs text-slate-400">
                            {format(new Date(conv.fecha_ultimo_mensaje), "HH:mm")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 truncate">
                          {conv.ultimo_mensaje || 'Sin mensajes'}
                        </p>
                        {unread > 0 && (
                          <Badge className="bg-[#D2FC31] text-[#1E293B] h-5 min-w-5 justify-center">
                            {unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 border-0 shadow-sm flex flex-col overflow-hidden">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Selecciona una conversación"
              description="Elige una conversación de la lista para comenzar a chatear"
            />
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getOtherParticipant(selectedConversation).logo} />
                  <AvatarFallback className="bg-[#D2FC31] text-[#1E293B]">
                    {getOtherParticipant(selectedConversation).nombre?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-[#1E293B]">
                    {getOtherParticipant(selectedConversation).nombre || 'Usuario'}
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
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
                    const showDate = index === 0 || 
                      format(new Date(msg.created_date), 'yyyy-MM-dd') !== 
                      format(new Date(mensajes[index - 1].created_date), 'yyyy-MM-dd');

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {format(new Date(msg.created_date), "d 'de' MMMM", { locale: es })}
                            </Badge>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                            <div className={`rounded-2xl px-4 py-2.5 ${
                              isOwn 
                                ? 'bg-[#1E293B] text-white rounded-br-md' 
                                : 'bg-slate-100 text-[#1E293B] rounded-bl-md'
                            }`}>
                              {msg.archivo_adjunto_url && (
                                <a 
                                  href={msg.archivo_adjunto_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 mb-2 text-sm ${
                                    isOwn ? 'text-[#D2FC31]' : 'text-blue-600'
                                  }`}
                                >
                                  <File className="w-4 h-4" />
                                  Ver archivo adjunto
                                </a>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.contenido}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-xs text-slate-400 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              {format(new Date(msg.created_date), "HH:mm")}
                              {isOwn && (
                                msg.leido 
                                  ? <CheckCheck className="w-3 h-3 text-[#D2FC31]" />
                                  : <Check className="w-3 h-3" />
                              )}
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
            <div className="px-4 py-3 border-t bg-slate-50 flex gap-2">
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
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
                  className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] h-11 px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

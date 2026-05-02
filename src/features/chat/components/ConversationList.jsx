import { Search } from 'lucide-react';
import { format } from 'date-fns';
import {
    Card,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ConversationList({
    conversaciones,
    loadingConversations,
    searchTerm,
    setSearchTerm,
    selectedConversation,
    setSelectedConversation,
    getOtherParticipant,
    getUnreadCount,
    className = "",
}) {
    const getReferenceInfo = (conv) => {
        if (conv.transaction?.serial_number) {
            return { code: `TRX-${String(conv.transaction.serial_number).padStart(5, '0')}`, type: 'transaction' };
        }
        if (conv.quote_response?.serial_number) {
            return { code: `QUO-${String(conv.quote_response.serial_number).padStart(5, '0')}`, type: 'quote' };
        }
        if (conv.request?.serial_number) {
            return { code: `RFQ-${String(conv.request.serial_number).padStart(5, '0')}`, type: 'request' };
        }
        return null;
    };

    const filteredConversations = conversaciones.filter((conv) => {
        const other = getOtherParticipant(conv);
        return other.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Card className={`flex flex-col border-0 shadow-sm overflow-hidden ${className}`}>
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
                        {[1, 2, 3, 4].map((i) => (
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
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isSelected ? 'bg-[#D2FC31]/20' : 'hover:bg-muted/50'
                                        }`}
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={other.logo} />
                                        <AvatarFallback className="bg-[#D2FC31] text-slate-900 font-medium">
                                            {other.nombre?.[0] || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="font-medium text-foreground truncate">
                                                {other.nombre || 'Usuario'}
                                            </p>
                                            {conv.fecha_ultimo_mensaje && (
                                                <span className="text-[10px] text-slate-400">
                                                    {format(new Date(conv.fecha_ultimo_mensaje), 'HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Reference Code & Product */}
                                        <div className="flex items-center gap-2 mb-1">
                                            {(() => {
                                                const ref = getReferenceInfo(conv);
                                                if (!ref) return null;
                                                return (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                        ref.type === 'transaction' ? 'bg-emerald-100 text-emerald-700' :
                                                        ref.type === 'quote' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {ref.code}
                                                    </span>
                                                );
                                            })()}
                                            <span className="text-[11px] text-slate-400 truncate italic">
                                                {conv.request?.product_service || 'Chat general'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-500 truncate">
                                                {conv.ultimo_mensaje || 'Sin mensajes'}
                                            </p>
                                            {unread > 0 && (
                                                <Badge className="bg-[#D2FC31] text-slate-900 h-5 min-w-5 justify-center ml-2 flex-shrink-0">
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
    );
}

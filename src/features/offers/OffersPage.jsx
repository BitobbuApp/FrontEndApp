import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOffersData from './hooks/useOffersData';
import OffersTable from './components/OffersTable';
import RejectOfferModal from './components/RejectOfferModal';

export default function OffersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [activeTab, setActiveTab] = useState('todas');

    const { ofertas, isLoading, rejectMutation, acceptMutation } =
        useOffersData();

    const filteredOfertas = ofertas.filter((oferta) => {
        const matchesSearch =
            oferta.producto_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            oferta.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'todas') return matchesSearch;
        if (activeTab === 'proactivas') return matchesSearch && oferta.es_proactiva;
        if (activeTab === 'pendientes')
            return matchesSearch && oferta.estado === 'Pendiente';
        return matchesSearch;
    });

    const handleReject = (oferta) => {
        setSelectedOferta(oferta);
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        if (selectedOferta) {
            rejectMutation.mutate(
                { id: selectedOferta.id, motivo: rejectReason },
                {
                    onSuccess: () => {
                        setRejectModalOpen(false);
                        setRejectReason('');
                        setSelectedOferta(null);
                    },
                },
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                    Ofertas
                </h1>
                <p className="text-slate-500 mt-1">
                    Revisa y gestiona las ofertas de proveedores
                </p>
            </div>

            {/* Tabs and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className="bg-slate-100">
                        <TabsTrigger value="todas">Todas</TabsTrigger>
                        <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                        <TabsTrigger value="proactivas">Anuncios</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Buscar ofertas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11"
                    />
                </div>
            </div>

            <OffersTable
                ofertas={filteredOfertas}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onAccept={(id) => acceptMutation.mutate(id)}
                onReject={handleReject}
            />

            <RejectOfferModal
                open={rejectModalOpen}
                onOpenChange={setRejectModalOpen}
                rejectReason={rejectReason}
                onRejectReasonChange={setRejectReason}
                onConfirm={confirmReject}
                isPending={rejectMutation.isPending}
            />
        </div>
    );
}

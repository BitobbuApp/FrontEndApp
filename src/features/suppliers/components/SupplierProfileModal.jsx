import React from 'react';
import { MessageSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RatingStars from '@/components/ui/RatingStars';

function getMetadataLabel(value) {
    if (typeof value === 'string') {
        return value;
    }

    if (!value || typeof value !== 'object') {
        return '';
    }

    if (typeof value.name === 'string') {
        return value.name;
    }

    if (typeof value.method === 'string') {
        return value.method;
    }

    if (value.method && typeof value.method === 'object') {
        return value.method.name || value.method.name_es || value.method.name_en || '';
    }

    if (typeof value.category === 'string') {
        return value.category;
    }

    if (value.category && typeof value.category === 'object') {
        return value.category.name || value.category.name_es || value.category.name_en || '';
    }

    return value.name_es || value.name_en || '';
}

export default function SupplierProfileModal({
    open,
    onOpenChange,
    selectedProveedor,
}) {
    if (!selectedProveedor) return null;

    const company = selectedProveedor;
    const mainLocation = company.locations?.[0] || {};
    const primaryContact = company.contacts?.[0] || {};
    const commercial = company.commercial_profile || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh] p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
                    <DialogTitle className="text-xl font-bold text-foreground">Perfil del Proveedor</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company.logo_url ? (
                                <img
                                    src={company.logo_url}
                                    alt={company.trade_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-foreground">
                                    {company.trade_name?.[0] || 'P'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-foreground">
                                {company.trade_name}
                            </h3>
                            <RatingStars rating={company.average_rating || 0} />
                            <p className="text-sm text-slate-500 mt-1">
                                {company.transaction_count || 0} transacciones •{' '}
                                {company.review_count || 0} reseñas
                            </p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Sector</p>
                            <p className="font-semibold text-foreground">
                                {company.sector || '-'}
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Tipo</p>
                            <p className="font-semibold text-foreground">
                                {company.company_type || 'Empresa'}
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Ubicación</p>
                            <p className="font-semibold text-foreground">
                                [mainLocation.city?.name, mainLocation.state?.name, mainLocation.location_city, mainLocation.location_state]
                                    .filter(Boolean)
                                    .join(', ') || 'No especificada'}
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Cobertura</p>
                            <p className="font-semibold text-foreground">
                                {mainLocation.national_coverage ? 'Nacional' : 'Local'}
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    {company.bio && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Acerca de</p>
                            <p className="text-slate-700 text-sm leading-relaxed">{company.bio}</p>
                        </div>
                    )}

                    {/* Contact Info */}
                    {primaryContact.contact_person && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Contacto</p>
                            <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                                <p className="font-semibold text-foreground">{primaryContact.contact_person}</p>
                                {primaryContact.position && (
                                    <p className="text-sm text-slate-500">{primaryContact.position}</p>
                                )}
                                {primaryContact.corporate_email && (
                                    <p className="text-sm text-slate-600">{primaryContact.corporate_email}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Commercial Info */}
                    <div className="flex flex-wrap gap-2">
                        {commercial.works_with_credit && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Trabaja a crédito
                            </Badge>
                        )}
                        {commercial.retention_agent && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Agente de retención
                            </Badge>
                        )}
                    </div>

                    {/* Payment Methods */}
                    {company.payment_methods && company.payment_methods.length > 0 && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Métodos de pago</p>
                            <div className="flex flex-wrap gap-2">
                                {company.payment_methods.map((method, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                        {getMetadataLabel(method)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories */}
                    {company.categories_of_interest && company.categories_of_interest.length > 0 && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Categorías de interés</p>
                            <div className="flex flex-wrap gap-2">
                                {company.categories_of_interest.map((cat, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {getMetadataLabel(cat)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                        <Button className="flex-1 bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contactar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

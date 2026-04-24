import React from 'react';
import { Upload, Check, AlertCircle, Clock } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocumentUploadCard from './DocumentUploadCard';
import { companyApi } from '../services/companyApi';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function VerificationTab({ company }) {
    const queryClient = useQueryClient();
    const verificationInfo = company?.verification_info || {};
    const docs = verificationInfo.documents || [];
    const status = verificationInfo.status || 'pending';
    
    // RIF: 1, Cedula: 2, Fotos: 3
    const DOC_TYPES = [
        { type_id: 1, label: 'RIF de la Empresa', description: 'Copia del registro de información fiscal', accept: '.pdf,.jpg,.png' },
        { type_id: 2, label: 'Cédula del Representante', description: 'Cédula de identidad del representante legal', accept: '.pdf,.jpg,.png' },
        { type_id: 3, label: 'Fotos del Local', description: 'Fotografías de tu establecimiento comercial', accept: '.jpg,.png' },
    ];

    const STATUS_LABELS = {
        pending: 'Pendiente',
        under_review: 'En Revisión',
        verified: 'Verificado',
        rejected: 'Rechazado'
    };

    const handleUpload = async (typeId, file) => {
        if (!company?.id) return;
        await companyApi.uploadVerificationDocument(company.id, typeId, file);
        toast.success('Documento subido exitosamente');
        // Invalidar para obtener los nuevos documentos
        queryClient.invalidateQueries(['myCompany']);
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Estado de Verificación</CardTitle>
                <CardDescription>Documenta tu empresa para obtener el sello verificado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    className={`p-4 rounded-xl flex items-center gap-4 ${status === 'verified'
                        ? 'bg-emerald-50'
                        : status === 'rejected'
                            ? 'bg-red-50'
                            : status === 'under_review' ? 'bg-blue-50' : 'bg-amber-50'
                        }`}
                >
                    {status === 'verified' ? (
                        <Check className="w-8 h-8 text-emerald-600" />
                    ) : status === 'rejected' ? (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    ) : (
                        <Clock className={`w-8 h-8 ${status === 'under_review' ? 'text-blue-600' : 'text-amber-600'}`} />
                    )}
                    <div>
                        <p
                            className={`font-semibold ${status === 'verified'
                                ? 'text-emerald-700'
                                : status === 'rejected'
                                    ? 'text-red-700'
                                    : status === 'under_review' ? 'text-blue-700' : 'text-amber-700'
                                }`}
                        >
                            Estado: {STATUS_LABELS[status] || 'Pendiente'}
                        </p>
                        {status === 'rejected' && verificationInfo.rejection_reason && (
                            <p className="text-sm text-red-600 mt-1">{verificationInfo.rejection_reason}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Documentos Requeridos</h4>
                    <div className="grid gap-4">
                        {DOC_TYPES.map((type) => {
                            const existingDoc = docs.find(d => d.type_id === type.type_id);
                            return (
                                <DocumentUploadCard
                                    key={type.type_id}
                                    label={type.label}
                                    description={type.description}
                                    typeId={type.type_id}
                                    accept={type.accept}
                                    existingDoc={existingDoc}
                                    companyId={company?.id}
                                    onUpload={handleUpload}
                                />
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

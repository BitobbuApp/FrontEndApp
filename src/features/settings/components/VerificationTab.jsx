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

export default function VerificationTab({ company }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Estado de Verificación</CardTitle>
                <CardDescription>Documenta tu empresa para obtener el sello verificado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    className={`p-4 rounded-xl flex items-center gap-4 ${company?.verification_status === 'Verificado'
                        ? 'bg-emerald-50'
                        : company?.verification_status === 'Rechazado'
                            ? 'bg-red-50'
                            : 'bg-amber-50'
                        }`}
                >
                    {company?.verification_status === 'Verificado' ? (
                        <Check className="w-8 h-8 text-emerald-600" />
                    ) : company?.verification_status === 'Rechazado' ? (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    ) : (
                        <Clock className="w-8 h-8 text-amber-600" />
                    )}
                    <div>
                        <p
                            className={`font-semibold ${company?.verification_status === 'Verificado'
                                ? 'text-emerald-700'
                                : company?.verification_status === 'Rechazado'
                                    ? 'text-red-700'
                                    : 'text-amber-700'
                                }`}
                        >
                            Estado: {company?.verification_status || 'Pendiente'}
                        </p>
                        {company?.rejection_reason && (
                            <p className="text-sm text-red-600 mt-1">{company.rejection_reason}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Documentos Requeridos</h4>
                    <div className="grid gap-4">
                        <div className="p-4 border border-dashed border-border rounded-xl">
                            <p className="font-medium text-foreground">RIF de la Empresa</p>
                            <p className="text-sm text-slate-500 mb-3">
                                Copia del registro de información fiscal
                            </p>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Cargar Documento
                            </Button>
                        </div>
                        <div className="p-4 border border-dashed border-border rounded-xl">
                            <p className="font-medium text-foreground">Cédula del Representante</p>
                            <p className="text-sm text-slate-500 mb-3">
                                Cédula de identidad del representante legal
                            </p>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Cargar Documento
                            </Button>
                        </div>
                        <div className="p-4 border border-dashed border-border rounded-xl">
                            <p className="font-medium text-foreground">Fotos del Local</p>
                            <p className="text-sm text-slate-500 mb-3">
                                Fotografías de tu establecimiento comercial
                            </p>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Cargar Fotos
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

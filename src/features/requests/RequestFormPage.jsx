import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useRequestForm from './hooks/useRequestForm';
import TypeSelector from './components/TypeSelector';
import ProductRequestForm from './components/ProductRequestForm';
import ServiceRequestForm from './components/ServiceRequestForm';
import FileUpload from './components/FileUpload';

export default function RequestFormPage() {
    const navigate = useNavigate();

    const {
        isEditing,
        isLoadingRequest,
        requestType,
        setRequestType,
        productForm,
        setProductForm,
        serviceForm,
        setServiceForm,
        files,
        handleFileChange,
        removeFile,
        handleSubmit,
        isPending,
    } = useRequestForm();

    if (isEditing && isLoadingRequest) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B]">
                        {isEditing ? 'Editar Solicitud' : 'Solicitar Cotización'}
                    </h1>
                    {!isEditing && (
                        <p className="text-sm text-slate-500">
                            Publica tu necesidad y recibe ofertas de proveedores
                        </p>
                    )}
                </div>
            </div>

            {/* Main card */}
            <Card>
                <CardContent className="p-6 space-y-6">

                    {/* Step 1 — Type selector */}
                    <TypeSelector value={requestType} onChange={setRequestType} />

                    {/* Step 2 — Specific form (shown only after type is selected) */}
                    {requestType === 'Producto' && (
                        <div className="pt-2 border-t border-slate-100">
                            <ProductRequestForm form={productForm} setForm={setProductForm} />
                        </div>
                    )}

                    {requestType === 'Servicio' && (
                        <div className="pt-2 border-t border-slate-100">
                            <ServiceRequestForm form={serviceForm} setForm={setServiceForm} />
                        </div>
                    )}

                    {/* Step 3 — File upload (only after type is chosen) */}
                    {requestType && (
                        <div className="pt-2 border-t border-slate-100">
                            <FileUpload
                                files={files}
                                onAdd={handleFileChange}
                                onRemove={removeFile}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !requestType}
                            className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] px-8 font-medium"
                        >
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? 'Guardar Cambios' : 'Publicar Solicitud'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Check, Package, Wrench } from 'lucide-react';
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
        categoryOptions,
        unitOptions,
        paymentConditionOptions,
    } = useRequestForm();

    if (isEditing && isLoadingRequest) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const step = requestType ? 2 : 1;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            
            {/* Header */}
            <div className="flex items-start gap-4">
                <Button variant="ghost" size="icon" className="-mt-1" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isEditing ? 'Editar Solicitud' : 'Solicitar Cotización'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Paso {step} de 2
                    </p>
                </div>
            </div>

            {/* Stepper Bar */}
            <div className="relative flex items-center justify-between px-2 w-full mt-6 mb-8">
                <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
                {step === 2 && (
                    <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-[#D2FC31] -z-10 -translate-y-1/2 transition-all duration-300"></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-[#D2FC31] text-slate-900 border-2 border-white ring-2 ring-[#D2FC31]' : 'bg-[#D2FC31] text-slate-900'}`}>
                    {step === 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-[#D2FC31] text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
                    2
                </div>
            </div>

            {/* Step 1: Type Selection */}
            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground mb-4">¿Qué necesitas cotizar?</h2>
                    <TypeSelector value={requestType} onChange={setRequestType} />
                </div>
            )}

            {/* Step 2: Form */}
            {step === 2 && (
                <Card className="border-0 shadow-sm overflow-hidden">
                    {/* Selected Type Banner inside card */}
                    <div className="bg-slate-50/50 border-b border-border px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold">
                            {requestType === 'Producto' ? <Package className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                            {requestType}
                        </div>
                        <button 
                            onClick={() => setRequestType('')}
                            className="text-sm text-slate-500 hover:text-indigo-600 underline underline-offset-2 transition-colors"
                        >
                            Cambiar tipo
                        </button>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {requestType === 'Producto' && (
                            <ProductRequestForm
                                form={productForm}
                                setForm={setProductForm}
                                categoryOptions={categoryOptions}
                                unitOptions={unitOptions}
                                paymentConditionOptions={paymentConditionOptions}
                            />
                        )}

                        {requestType === 'Servicio' && (
                            <ServiceRequestForm
                                form={serviceForm}
                                setForm={setServiceForm}
                                categoryOptions={categoryOptions}
                                paymentConditionOptions={paymentConditionOptions}
                            />
                        )}

                        <div className="pt-2">
                            <FileUpload
                                files={files}
                                onAdd={handleFileChange}
                                onRemove={removeFile}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-6">
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
                                disabled={isPending}
                                className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] px-8 font-medium"
                            >
                                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isEditing ? 'Guardar Cambios' : 'Publicar Solicitud'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

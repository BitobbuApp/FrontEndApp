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

    const step = 1;
    const totalSteps = 1;

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
                        Información de tu requerimiento
                    </p>
                </div>
            </div>


            {/* Form */}
            <Card className="border-0 shadow-sm overflow-hidden">

                    <CardContent className="p-6 space-y-6">
                        <ProductRequestForm
                            form={productForm}
                            setForm={setProductForm}
                            categoryOptions={categoryOptions}
                            unitOptions={unitOptions}
                            paymentConditionOptions={paymentConditionOptions}
                        />

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
        </div>
    );
}

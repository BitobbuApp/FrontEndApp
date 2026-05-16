import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DOC_STATUS_LABELS = {
    pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Aprobado', color: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-700' }
};

export default function DocumentUploadCard({ label, description, typeId, accept, existingDoc, companyId, onUpload }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (pendingFile) {
            const url = URL.createObjectURL(pendingFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [pendingFile]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error('El archivo es demasiado grande (máximo 5MB).');
            return;
        }

        // Set pending file instead of uploading immediately
        setPendingFile(file);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const confirmUpload = async () => {
        if (!pendingFile) return;
        try {
            setIsUploading(true);
            await onUpload(typeId, pendingFile);
            setPendingFile(null);
            // Si el onUpload maneja toast on success lo hace arriba
        } catch (error) {
            console.error('Error al subir documento:', error);
            toast.error('Ocurrió un error al subir el documento. Intenta nuevamente.');
        } finally {
            setIsUploading(false);
        }
    };

    const cancelUpload = () => {
        setPendingFile(null);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 border border-dashed border-border rounded-xl bg-card">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="font-medium text-foreground flex items-center gap-2">
                        {label}
                        {existingDoc && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${DOC_STATUS_LABELS[existingDoc.status]?.color || DOC_STATUS_LABELS.pending.color}`}>
                                {DOC_STATUS_LABELS[existingDoc.status]?.label || 'Pendiente'}
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-slate-500 mb-3">
                        {description}
                    </p>

                    {existingDoc ? (
                        <div className="mt-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-2 overflow-hidden truncate">
                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                    <a
                                        href={existingDoc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary hover:underline truncate"
                                        title="Ver documento adjunto"
                                    >
                                        Ver documento adjunto
                                    </a>
                                </div>
                            </div>
                            {existingDoc.status === 'rejected' && existingDoc.notes && (
                                <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
                                    <span className="font-semibold block mb-1">Motivo de rechazo:</span>
                                    {existingDoc.notes}
                                </p>
                            )}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />

                    {pendingFile ? (
                        <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={cancelUpload}>
                                    Cancelar
                                </Button>
                                <Button size="sm" className="bg-[#D2FC31] hover:bg-[#c4ee2a] text-slate-900 border border-[#D2FC31] shadow-none" onClick={confirmUpload} disabled={isUploading}>
                                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                    Confirmar
                                </Button>
                            </div>
                            {previewUrl && (
                                <a 
                                    href={previewUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                                >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Previsualizar {pendingFile.name}
                                </a>
                            )}
                        </div>
                    ) : (
                        existingDoc && (existingDoc.status === 'pending' || existingDoc.status === 'approved') ? null : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUploadClick}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {existingDoc ? 'Reemplazar' : 'Cargar'}
                            </Button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

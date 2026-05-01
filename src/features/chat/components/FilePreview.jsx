import React, { useState } from 'react';
import { FileText, File, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FilePreview({ fileUrl, fileName, isOwn }) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!fileUrl) return null;

    // Extract clean filename without query parameters to properly detect extension
    const cleanFileName = fileName?.split('?')[0] || fileUrl?.split('/').pop()?.split('?')[0];
    const extension = cleanFileName?.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    const isPdf = extension === 'pdf';

    const getIcon = () => {
        if (isPdf) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-slate-500" />;
    };

    if (isImage) {
        return (
            <>
                <div 
                    className="relative mb-2 rounded-lg overflow-hidden cursor-pointer group bg-slate-900/10"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <img 
                        src={fileUrl} 
                        alt={fileName || 'Imagen adjunta'} 
                        className="max-w-[240px] max-h-[240px] object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        {/* Indicador sutil de que es clickeable */}
                    </div>
                </div>

                {isLightboxOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <div className="relative max-w-[90vw] max-h-[90vh]">
                            <img 
                                src={fileUrl} 
                                alt={fileName || 'Imagen ampliada'} 
                                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                            />
                            <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
                                <a 
                                    href={fileUrl} 
                                    download={fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/50 px-4 py-2 rounded-full text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar original
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors border ${
                isOwn 
                    ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/50' 
                    : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
        >
            <div className={`p-2 rounded-lg ${isOwn ? 'bg-slate-700' : 'bg-slate-100'}`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isOwn ? 'text-slate-200' : 'text-slate-700'}`}>
                    {fileName || 'Documento adjunto'}
                </p>
                <p className={`text-xs ${isOwn ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isPdf ? 'Documento PDF' : 'Archivo adjunto'}
                </p>
            </div>
            <Download className={`w-4 h-4 flex-shrink-0 ${isOwn ? 'text-[#D2FC31]' : 'text-blue-600'}`} />
        </a>
    );
}

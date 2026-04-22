import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

/**
 * File upload dropzone + file list pill previews.
 * Props: files (File[]), onAdd (ChangeEvent fn), onRemove (index fn)
 */
function FilePreview({ file, onRemove }) {
    const [previewUrl, setPreviewUrl] = React.useState(null);

    React.useEffect(() => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const isImage = file.type.startsWith('image/');

    return (
        <div className="flex flex-col items-center gap-2 border border-border rounded-lg p-3 bg-white shadow-sm relative group hover:border-[#D2FC31]/50 transition-colors">
            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 bg-slate-200 text-slate-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                title="Eliminar archivo"
            >
                <X className="w-3 h-3" />
            </button>
            
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer block" title="Abrir previsualización">
                {isImage ? (
                    <img src={previewUrl} alt={file.name} className="h-16 w-16 object-cover rounded border bg-slate-50" />
                ) : (
                    <div className="h-16 w-16 bg-red-50 border border-red-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600">PDF</span>
                    </div>
                )}
            </a>
            
            <span className="truncate w-20 text-[11px] text-center text-slate-600 font-medium" title={file.name}>
                {file.name}
            </span>
        </div>
    );
}

export default function FileUpload({ files, existingFiles = [], onAdd, onRemove }) {
    return (
        <div className="space-y-3">
            <Label>Archivos Adjuntos</Label>

            <div className="border-2 border-dashed border-border rounded-xl bg-muted/50 hover:border-[#D2FC31] transition-colors">
                <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onAdd}
                    className="hidden"
                    id="file-upload-input"
                />
                <label
                    htmlFor="file-upload-input"
                    className="flex flex-col items-center gap-3 py-8 cursor-pointer"
                >
                    <Upload className="w-8 h-8 text-[#D2FC31]" />
                    <span className="text-sm font-medium text-[#D2FC31]">Click para subir archivos</span>
                    <span className="text-xs text-slate-400">Solo PDF, JPG, PNG admitidos. Max 5MB</span>
                </label>
            </div>

            {/* Existing Files from DB */}
            {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {existingFiles.map((file, index) => (
                        <a
                            key={`existing-${index}`}
                            href={`https://0454977f57bc1c0b8ddbf2f8735d82c7.r2.cloudflarestorage.com/bitobbu-test/${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#D2FC31]/10 border border-[#D2FC31] hover:bg-[#D2FC31]/30 rounded-lg px-3 py-2 text-sm transition-colors text-slate-800"
                            title="Ver documento subido previamente"
                        >
                            <span className="truncate max-w-[200px] font-medium">
                                {file.file_name || 'Documento adjunto'}
                            </span>
                        </a>
                    ))}
                </div>
            )}

            {/* Newly added files to be uploaded */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {files.map((file, index) => (
                        <FilePreview 
                            key={`new-${index}`} 
                            file={file} 
                            onRemove={() => onRemove(index)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

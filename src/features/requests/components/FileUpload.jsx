import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

/**
 * File upload dropzone + file list pill previews.
 * Props: files (File[]), onAdd (ChangeEvent fn), onRemove (index fn)
 */
export default function FileUpload({ files, onAdd, onRemove }) {
    return (
        <div className="space-y-3">
            <Label>Archivos Adjuntos</Label>

            <div className="border-2 border-dashed border-border rounded-xl bg-muted/50 hover:border-[#D2FC31] transition-colors">
                <input
                    type="file"
                    multiple
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
                    <span className="text-xs text-slate-400">JPG, PNG</span>
                </label>
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-slate-100 border rounded-lg px-3 py-2 text-sm"
                        >
                            <span className="truncate max-w-[200px] font-medium text-slate-700">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

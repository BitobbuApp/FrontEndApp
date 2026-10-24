import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { copyToClipboard } from '@/utils/clipboard';

function downloadCodes(codes) {
    const text = ['Códigos de respaldo de Bitobbu', 'Cada código sirve una sola vez.', '', ...codes, ''].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bitobbu-codigos-de-respaldo.txt';
    link.click();
    URL.revokeObjectURL(url);
}

/** The one-time recovery codes: copy, download and an explicit "I saved them" before continuing. */
export default function RecoveryCodesPanel({ codes, onDone, doneLabel = 'Continuar' }) {
    const [saved, setSaved] = useState(false);

    const copy = async () => {
        if (await copyToClipboard(codes.join('\n'))) toast.success('Códigos copiados');
        else toast.error('No se pudo copiar. Selecciónalos y cópialos a mano.');
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-muted rounded-xl p-4">
                {codes.map((item) => <span key={item} className="text-center select-all">{item}</span>)}
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={copy}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => downloadCodes(codes)}>
                    <Download className="w-4 h-4 mr-2" /> Descargar
                </Button>
            </div>
            <label htmlFor="codes-saved" className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <Checkbox id="codes-saved" checked={saved} onCheckedChange={(value) => setSaved(value === true)} />
                Ya guardé mis códigos de respaldo
            </label>
            <div className="flex justify-end">
                <Button
                    type="button"
                    disabled={!saved}
                    onClick={onDone}
                    className="bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold"
                >
                    {doneLabel}
                </Button>
            </div>
        </div>
    );
}

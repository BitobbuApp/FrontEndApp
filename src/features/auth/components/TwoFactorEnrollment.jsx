import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { copyToClipboard } from '@/utils/clipboard';
import TwoFactorCodeInput from './TwoFactorCodeInput';
import { enable2Fa, setup2Fa } from '../services/authApi';

function downloadCodes(codes) {
    const text = ['Códigos de respaldo de Bitobbu', 'Cada código sirve una sola vez.', '', ...codes, ''].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bitobbu-codigos-de-respaldo.txt';
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Turns on two-step verification: scan the QR, confirm one code, keep the recovery codes.
 * `enrollmentToken` is used at login when the company requires 2FA; in Settings the session is used.
 * Enabling 2FA revokes the previous token and the server issues a fresh session:
 *  - `onEnabled(session)` fires as soon as it is enabled (Settings adopts the new token right away)
 *  - `onComplete(session)` fires when the user confirms the recovery codes are saved (login opens the app then)
 */
export default function TwoFactorEnrollment({ enrollmentToken, onEnabled, onComplete, onCancel }) {
    const [step, setStep] = useState('intro'); // intro | scan | codes
    const [setup, setSetup] = useState(null);
    const [code, setCode] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [session, setSession] = useState(null);
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const begin = async () => {
        setIsLoading(true);
        setError('');
        try {
            setSetup(await setup2Fa({ token: enrollmentToken }));
            setStep('scan');
        } catch (err) {
            setError(err?.userMessage || 'No pudimos iniciar la configuración. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const confirm = async (value = code) => {
        if (value.length !== 6 || isLoading) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await enable2Fa(value, { token: enrollmentToken });
            setRecoveryCodes(result.recovery_codes || []);
            setSession(result.session);
            onEnabled?.(result.session);
            setStep('codes');
        } catch (err) {
            setCode('');
            setError(err?.userMessage || 'No pudimos activar la verificación. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const copy = async (text, message) => {
        if (await copyToClipboard(text)) toast.success(message);
        else toast.error('No se pudo copiar. Selecciónalo y cópialo a mano.');
    };

    if (step === 'intro') {
        return (
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D2FC31]/30 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-slate-800" />
                    </div>
                    <p className="text-sm text-slate-600">
                        Necesitas una aplicación de autenticación en tu teléfono, como Google Authenticator, Microsoft Authenticator,
                        Authy o 1Password. Te mostraremos un código QR para vincularla y 10 códigos de respaldo por si pierdes el teléfono.
                    </p>
                </div>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-2 justify-end">
                    {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>}
                    <Button type="button" onClick={begin} disabled={isLoading} className="bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Comenzar'}
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 'scan') {
        return (
            <div className="space-y-5">
                <p className="text-sm text-slate-600">
                    1. Abre tu aplicación de autenticación y escanea el código QR.<br />
                    2. Escribe el código de 6 dígitos que muestra.
                </p>
                <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-xl border">
                        <QRCodeSVG value={setup.otpauth_url} size={176} />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs text-slate-500">¿No puedes escanear? Escribe esta clave en la aplicación:</p>
                    <button
                        type="button"
                        onClick={() => copy(setup.secret, 'Clave copiada')}
                        className="inline-flex items-center gap-2 font-mono text-sm bg-muted px-3 py-1.5 rounded-lg break-all"
                    >
                        {setup.secret}
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                    </button>
                </div>
                <TwoFactorCodeInput
                    value={code}
                    onChange={setCode}
                    onComplete={confirm}
                    allowRecovery={false}
                    disabled={isLoading}
                />
                {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
                <div className="flex gap-2 justify-end">
                    {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>}
                    <Button
                        type="button"
                        onClick={() => confirm()}
                        disabled={code.length !== 6 || isLoading}
                        className="bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activar'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="font-semibold text-slate-800">Verificación en dos pasos activada</p>
                    <p className="text-sm text-slate-600">
                        Guarda estos códigos de respaldo en un lugar seguro. Cada uno sirve una sola vez y no volverás a verlos.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-muted rounded-xl p-4">
                {recoveryCodes.map((item) => <span key={item} className="text-center select-all">{item}</span>)}
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => copy(recoveryCodes.join('\n'), 'Códigos copiados')}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => downloadCodes(recoveryCodes)}>
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
                    onClick={() => onComplete(session)}
                    className="bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold"
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}

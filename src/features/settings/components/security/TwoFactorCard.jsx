import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/features/auth/AuthContext';
import { disable2Fa, regenerateRecoveryCodes } from '@/features/auth/services/authApi';
import PasswordField from '@/features/auth/components/PasswordField';
import RecoveryCodesPanel from '@/features/auth/components/RecoveryCodesPanel';
import TwoFactorCodeInput from '@/features/auth/components/TwoFactorCodeInput';
import TwoFactorEnrollment from '@/features/auth/components/TwoFactorEnrollment';
import { TWO_FACTOR_STATUS_KEY, useTwoFactorStatus } from '../../hooks/useTwoFactorStatus';

const formatDate = (value) => (value
    ? new Date(value).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
    : '');

function EnableDialog({ open, onClose }) {
    const { refreshToken } = useAuth();
    const queryClient = useQueryClient();
    // Once enabled, the old token is already revoked: the dialog cannot be dismissed before the codes are saved
    const [enabledPending, setEnabledPending] = useState(false);

    const handleOpenChange = (next) => {
        if (!next && !enabledPending) onClose();
    };
    const blockWhilePending = (event) => { if (enabledPending) event.preventDefault(); };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onInteractOutside={blockWhilePending} onEscapeKeyDown={blockWhilePending}>
                <DialogHeader>
                    <DialogTitle>Activar la verificación en dos pasos</DialogTitle>
                    <DialogDescription>Protege tu cuenta con un código de tu teléfono además de la contraseña.</DialogDescription>
                </DialogHeader>
                <TwoFactorEnrollment
                    onCancel={onClose}
                    onEnabled={(session) => {
                        setEnabledPending(true);
                        refreshToken(session.token);
                        queryClient.invalidateQueries({ queryKey: [TWO_FACTOR_STATUS_KEY] });
                    }}
                    onComplete={() => {
                        setEnabledPending(false);
                        onClose();
                        toast.success('Verificación en dos pasos activada');
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

function RegenerateDialog({ open, onClose }) {
    const queryClient = useQueryClient();
    const [code, setCode] = useState('');
    const [codes, setCodes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const close = () => {
        setCode('');
        setCodes(null);
        setError('');
        onClose();
    };

    const submit = async (value = code) => {
        if (value.length !== 6 || isLoading) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await regenerateRecoveryCodes(value);
            setCodes(result.recovery_codes);
            queryClient.invalidateQueries({ queryKey: [TWO_FACTOR_STATUS_KEY] });
        } catch (err) {
            setCode('');
            setError(err?.userMessage || 'No pudimos generar los códigos. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next && !codes) close(); }}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => { if (codes) e.preventDefault(); }}>
                <DialogHeader>
                    <DialogTitle>Regenerar códigos de respaldo</DialogTitle>
                    <DialogDescription>
                        {codes
                            ? 'Estos códigos reemplazan a los anteriores, que ya no sirven. Guárdalos ahora: no volverás a verlos.'
                            : 'Escribe el código actual de tu aplicación. Los códigos anteriores dejarán de funcionar.'}
                    </DialogDescription>
                </DialogHeader>
                {codes ? (
                    <RecoveryCodesPanel codes={codes} onDone={close} doneLabel="Listo" />
                ) : (
                    <div className="space-y-4">
                        <TwoFactorCodeInput value={code} onChange={setCode} onComplete={submit} allowRecovery={false} disabled={isLoading} />
                        {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={close} disabled={isLoading}>Cancelar</Button>
                            <Button type="button" onClick={() => submit()} disabled={code.length !== 6 || isLoading} className="bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DisableDialog({ open, onClose }) {
    const { refreshToken } = useAuth();
    const queryClient = useQueryClient();
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [useRecovery, setUseRecovery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const close = () => {
        setPassword('');
        setCode('');
        setUseRecovery(false);
        setError('');
        onClose();
    };

    const codeReady = useRecovery ? code.trim().length >= 10 : code.length === 6;
    const canSubmit = password !== '' && codeReady && !isLoading;

    const submit = async (e) => {
        e?.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await disable2Fa({ password, code: code.trim() });
            refreshToken(result?.token);
            queryClient.invalidateQueries({ queryKey: [TWO_FACTOR_STATUS_KEY] });
            toast.success('Verificación en dos pasos desactivada');
            close();
        } catch (err) {
            setCode('');
            setError(err?.normalizedError?.code === 'USER_INVALID_CREDENTIALS'
                ? 'La contraseña es incorrecta.'
                : err?.userMessage || 'No pudimos desactivar la verificación. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) close(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Desactivar la verificación en dos pasos</DialogTitle>
                    <DialogDescription>
                        Tu cuenta quedará protegida solo por la contraseña. Confirma con tu contraseña y un código.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <PasswordField id="disable-password" label="Contraseña" value={password} onChange={setPassword} autoComplete="current-password" size="md" />
                    <TwoFactorCodeInput
                        value={code}
                        onChange={setCode}
                        useRecovery={useRecovery}
                        onToggleRecovery={() => { setUseRecovery((v) => !v); setCode(''); }}
                        disabled={isLoading}
                    />
                    {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={close} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" variant="destructive" disabled={!canSubmit}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Desactivar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function TwoFactorCard() {
    const { data: status, isLoading, isError } = useTwoFactorStatus();
    const [dialog, setDialog] = useState(null); // 'enable' | 'regenerate' | 'disable'
    const closeDialog = () => setDialog(null);

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-foreground" />
                    Verificación en dos pasos
                    {status?.enabled && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Activa</Badge>}
                </CardTitle>
                <CardDescription>
                    Además de la contraseña, te pedimos un código de 6 dígitos de tu aplicación de autenticación al iniciar sesión.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && <div className="h-16 rounded-lg bg-muted animate-pulse" />}
                {isError && <p className="text-sm text-red-600">No pudimos cargar el estado de la verificación. Recarga la página.</p>}

                {status && !status.enabled && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-sm text-slate-600">
                            {status.company_requires_2fa
                                ? 'Tu empresa exige la verificación en dos pasos. Actívala para seguir usando tu cuenta.'
                                : 'Está desactivada. Te recomendamos activarla.'}
                        </p>
                        <Button onClick={() => setDialog('enable')} className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] shrink-0">
                            Activar
                        </Button>
                    </div>
                )}

                {status?.enabled && (
                    <>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>Activada el {formatDate(status.enabled_at)}.</p>
                            <p className={status.recovery_codes_remaining <= 2 ? 'text-amber-700 font-medium' : ''}>
                                Te quedan {status.recovery_codes_remaining} códigos de respaldo.
                                {status.recovery_codes_remaining <= 2 && ' Genera nuevos para no quedarte sin acceso.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => setDialog('regenerate')}>
                                <KeyRound className="w-4 h-4 mr-2" /> Regenerar códigos de respaldo
                            </Button>
                            <Button variant="outline" onClick={() => setDialog('disable')} disabled={status.company_requires_2fa}>
                                <ShieldOff className="w-4 h-4 mr-2" /> Desactivar
                            </Button>
                        </div>
                        {status.company_requires_2fa && (
                            <p className="text-xs text-slate-500">Tu empresa exige la verificación en dos pasos, por eso no se puede desactivar.</p>
                        )}
                    </>
                )}
            </CardContent>

            <EnableDialog open={dialog === 'enable'} onClose={closeDialog} />
            <RegenerateDialog open={dialog === 'regenerate'} onClose={closeDialog} />
            <DisableDialog open={dialog === 'disable'} onClose={closeDialog} />
        </Card>
    );
}

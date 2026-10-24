import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AuthPageShell from './components/AuthPageShell';
import PasswordField from './components/PasswordField';
import PasswordRequirements from './components/PasswordRequirements';
import TwoFactorCodeInput from './components/TwoFactorCodeInput';
import { evaluatePassword, isPasswordValid } from './utils/passwordPolicy';
import { resetPasswordWithToken, validateResetToken } from './services/authApi';

const readTokenFromUrl = () => new URLSearchParams(window.location.search).get('token');

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    // Kept only in memory (never localStorage); the address bar is cleaned right after mount
    const [token, setToken] = useState(readTokenFromUrl);

    const [stage, setStage] = useState(token ? 'validating' : 'invalid'); // validating | invalid | ready | done
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [enrollmentRequired, setEnrollmentRequired] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState('');

    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [code, setCode] = useState('');
    const [useRecovery, setUseRecovery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // The token must not stay in the address bar, the history or a Referer header
    useEffect(() => {
        if (window.location.search) window.history.replaceState({}, '', window.location.pathname);
    }, []);

    // No referrer while this page is open: the link must not travel to third parties
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'no-referrer';
        document.head.appendChild(meta);
        return () => meta.remove();
    }, []);

    useEffect(() => {
        if (!token) return undefined;
        let cancelled = false;
        validateResetToken(token)
            .then((result) => {
                if (cancelled) return;
                setRequiresTwoFactor(Boolean(result?.requires_two_factor));
                setStage('ready');
            })
            .catch((err) => {
                if (cancelled) return;
                setInvalidMessage(err?.normalizedError?.code === 'TOO_MANY_REQUESTS' ? err.userMessage : '');
                setStage('invalid');
            });
        return () => { cancelled = true; };
    }, [token]);

    const checks = useMemo(() => evaluatePassword(password, confirmation), [password, confirmation]);
    const codeReady = !requiresTwoFactor || (useRecovery ? code.trim().length >= 10 : code.length === 6);
    const canSubmit = isPasswordValid(checks) && codeReady && !isLoading;

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await resetPasswordWithToken({
                token,
                new_password: password,
                confirm_password: confirmation,
                ...(requiresTwoFactor && (useRecovery ? { recovery_code: code.trim() } : { totp_code: code })),
            });
            setEnrollmentRequired(Boolean(result?.two_factor_enrollment_required));
            setToken(null);
            setStage('done');
            toast.success('Contraseña actualizada.');
        } catch (err) {
            const errorCode = err?.normalizedError?.code;
            if (errorCode === 'RESET_TOKEN_INVALID') {
                setInvalidMessage(err.userMessage);
                setStage('invalid');
            } else {
                if (errorCode === 'TWO_FACTOR_INVALID') setCode('');
                setError(err?.userMessage || 'No pudimos actualizar la contraseña. Inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (stage === 'validating') {
        return (
            <AuthPageShell>
                <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Verificando el enlace...</p>
                </div>
            </AuthPageShell>
        );
    }

    if (stage === 'invalid') {
        return (
            <AuthPageShell>
                <div className="text-center space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <ShieldAlert className="w-7 h-7 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Enlace no válido</h1>
                    <p className="text-slate-500">
                        {invalidMessage || 'Este enlace ya se usó, venció o no es correcto. Pide uno nuevo para continuar.'}
                    </p>
                    <Button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold rounded-xl"
                    >
                        Pedir otro enlace
                    </Button>
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
                    </Link>
                </div>
            </AuthPageShell>
        );
    }

    if (stage === 'done') {
        return (
            <AuthPageShell>
                <div className="text-center space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Contraseña actualizada</h1>
                    <p className="text-slate-500">Ya puedes iniciar sesión con tu nueva contraseña. Cerramos tus otras sesiones por seguridad.</p>
                    {enrollmentRequired && (
                        <p className="text-sm text-slate-600 bg-muted rounded-xl px-4 py-3">
                            Tu empresa exige la verificación en dos pasos: al entrar te pediremos activarla.
                        </p>
                    )}
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold rounded-xl"
                    >
                        Iniciar sesión
                    </Button>
                </div>
            </AuthPageShell>
        );
    }

    return (
        <AuthPageShell>
            <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#D2FC31]/30 flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-slate-800" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Crea tu nueva contraseña</h1>
                <p className="text-slate-500">Elige una contraseña que no hayas usado antes en Bitobbu.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordField id="new-password" label="Nueva contraseña" value={password} onChange={setPassword} autoComplete="new-password" disabled={isLoading} />
                <PasswordField id="confirm-password" label="Confirmar contraseña" value={confirmation} onChange={setConfirmation} autoComplete="new-password" disabled={isLoading} />
                <PasswordRequirements checks={checks} password={password} />

                {requiresTwoFactor && (
                    <div className="space-y-3 pt-2 border-t border-border">
                        <p className="text-sm font-medium text-slate-700 pt-3">
                            {useRecovery
                                ? 'Escribe uno de tus códigos de respaldo'
                                : 'Escribe el código de 6 dígitos de tu aplicación de autenticación'}
                        </p>
                        <TwoFactorCodeInput
                            value={code}
                            onChange={setCode}
                            useRecovery={useRecovery}
                            onToggleRecovery={() => { setUseRecovery((v) => !v); setCode(''); }}
                            disabled={isLoading}
                        />
                    </div>
                )}

                {error && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
                )}

                <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold text-base rounded-xl shadow-lg shadow-[#D2FC31]/25"
                >
                    {isLoading ? 'Guardando...' : 'Guardar contraseña'}
                </Button>
            </form>
        </AuthPageShell>
    );
}

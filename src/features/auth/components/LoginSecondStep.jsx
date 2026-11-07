import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../AuthContext';
import { verifyLogin2Fa } from '../services/authApi';
import TwoFactorCodeInput from './TwoFactorCodeInput';
import TwoFactorEnrollment from './TwoFactorEnrollment';

function TwoFactorChallenge({ mfaToken, onVerified, onBack }) {
    const [code, setCode] = useState('');
    const [useRecovery, setUseRecovery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (value = code) => {
        const ready = useRecovery ? value.trim().length >= 10 : value.length === 6;
        if (!ready || isLoading) return;
        setIsLoading(true);
        setError('');
        try {
            const session = await verifyLogin2Fa({ mfa_token: mfaToken, code: value.trim() });
            onVerified(session);
        } catch (err) {
            const errorCode = err?.normalizedError?.code;
            if (errorCode === 'MFA_TOKEN_INVALID') {
                onBack(err.userMessage); // the challenge expired or was used up: sign in again
                return;
            }
            setCode('');
            setError(err?.userMessage || 'No pudimos verificar el código. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-[#D2FC31]/30 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-slate-800" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Verificación en dos pasos</h1>
                <p className="text-sm text-slate-500">
                    {useRecovery
                        ? 'Escribe uno de tus códigos de respaldo. Cada uno sirve una sola vez.'
                        : 'Escribe el código de 6 dígitos de tu aplicación de autenticación.'}
                </p>
            </div>

            <TwoFactorCodeInput
                value={code}
                onChange={setCode}
                useRecovery={useRecovery}
                onToggleRecovery={() => { setUseRecovery((v) => !v); setCode(''); setError(''); }}
                onComplete={submit}
                disabled={isLoading}
            />

            {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}

            {useRecovery && (
                <Button
                    type="button"
                    onClick={() => submit()}
                    disabled={isLoading || code.trim().length < 10}
                    className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold rounded-xl"
                >
                    {isLoading ? 'Verificando...' : 'Verificar'}
                </Button>
            )}

            <button
                type="button"
                onClick={() => onBack()}
                className="mx-auto flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
                <ArrowLeft className="w-4 h-4" /> Volver
            </button>
        </div>
    );
}

/**
 * What follows a login that did not return a session: the 2FA code (`mfa_required`) or the mandatory
 * 2FA setup (`enrollment_required`). `step` is the result of AuthContext.login().
 * Rendered by the login page and by the login modal; `onBack(message?)` returns to the credentials form.
 */
export default function LoginSecondStep({ step, onBack, onAuthenticated }) {
    const { completeLogin } = useAuth();

    const finish = (session) => {
        completeLogin(session);
        onAuthenticated?.(session);
    };

    if (step.status === 'mfa_required') {
        return <TwoFactorChallenge mfaToken={step.mfaToken} onVerified={finish} onBack={onBack} />;
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Activa la verificación en dos pasos</h1>
                <p className="text-sm text-slate-500">
                    Tu empresa exige este paso de seguridad para todos sus usuarios. Configúralo ahora para continuar.
                </p>
            </div>
            <TwoFactorEnrollment enrollmentToken={step.enrollmentToken} onComplete={finish} onCancel={() => onBack()} />
        </div>
    );
}

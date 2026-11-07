import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthPageShell from './components/AuthPageShell';
import { requestPasswordReset } from './services/authApi';

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sentTo, setSentTo] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const send = async (target) => {
        setIsLoading(true);
        setError('');
        try {
            // The answer is always the same, whether the email exists or not
            await requestPasswordReset(target);
            setSentTo(target);
            setSecondsLeft(RESEND_SECONDS);
        } catch (err) {
            setError(err?.userMessage || 'No pudimos procesar la solicitud. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const target = email.trim().toLowerCase();
        if (!target) {
            setError('Ingresa tu correo electrónico.');
            return;
        }
        send(target);
    };

    return (
        <AuthPageShell>
            {sentTo ? (
                <div className="text-center space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#D2FC31]/30 flex items-center justify-center">
                        <MailCheck className="w-7 h-7 text-slate-800" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Revisa tu correo</h1>
                    <p className="text-slate-500">
                        Si <span className="font-semibold text-slate-700">{sentTo}</span> está registrado, te enviamos un enlace
                        para crear una contraseña nueva. Vence en 20 minutos.
                    </p>
                    <p className="text-sm text-slate-500">¿No llegó? Revisa la carpeta de spam o pide otro enlace.</p>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                        type="button"
                        variant="outline"
                        disabled={secondsLeft > 0 || isLoading}
                        onClick={() => send(sentTo)}
                        className="w-full h-12 rounded-xl"
                    >
                        {secondsLeft > 0 ? `Reenviar en ${secondsLeft} s` : 'Reenviar enlace'}
                    </Button>
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[#D2FC31]/30 flex items-center justify-center mb-4">
                            <KeyRound className="w-6 h-6 text-slate-800" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">¿Olvidaste tu contraseña?</h1>
                        <p className="text-slate-500">Escribe tu correo y te enviaremos un enlace para crear una nueva.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@empresa.com"
                                autoComplete="email"
                                autoFocus
                                disabled={isLoading}
                                className="h-12 bg-background border-border"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold text-base rounded-xl shadow-lg shadow-[#D2FC31]/25"
                        >
                            {isLoading ? 'Enviando...' : 'Enviar enlace'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
                        </Link>
                    </p>
                </>
            )}
        </AuthPageShell>
    );
}

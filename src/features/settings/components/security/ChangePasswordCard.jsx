import React, { useMemo, useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import { changePassword } from '@/features/auth/services/authApi';
import PasswordField from '@/features/auth/components/PasswordField';
import PasswordRequirements from '@/features/auth/components/PasswordRequirements';
import { evaluatePassword, isPasswordValid } from '@/features/auth/utils/passwordPolicy';

export default function ChangePasswordCard() {
    const { refreshToken } = useAuth();
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const checks = useMemo(() => evaluatePassword(next, confirmation), [next, confirmation]);
    const canSubmit = isPasswordValid(checks) && current !== '' && !isLoading;

    const handleSave = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await changePassword({ currentPassword: current, newPassword: next, confirmPassword: confirmation });
            // The server revokes the other sessions; this one continues with the fresh token
            refreshToken(result?.token);
            toast.success('Contraseña actualizada correctamente', {
                description: 'Cerramos tus otras sesiones; esta permanece activa.',
                icon: <Check className="w-4 h-4 text-emerald-500" />,
            });
            setCurrent('');
            setNext('');
            setConfirmation('');
        } catch (err) {
            const code = err?.normalizedError?.code;
            setError(code === 'USER_INVALID_CREDENTIALS'
                ? 'La contraseña actual es incorrecta.'
                : err?.userMessage || 'No pudimos actualizar la contraseña. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-foreground" />
                    Cambiar contraseña
                </CardTitle>
                <CardDescription>
                    Usa una contraseña que no repitas en otros sitios. No puede ser ninguna de tus últimas 5 contraseñas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                    <PasswordField id="current-password" label="Contraseña actual" value={current} onChange={setCurrent} autoComplete="current-password" size="md" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PasswordField id="new-password" label="Nueva contraseña" value={next} onChange={setNext} autoComplete="new-password" size="md" />
                        <PasswordField id="confirm-password" label="Confirmar nueva contraseña" value={confirmation} onChange={setConfirmation} autoComplete="new-password" size="md" />
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                        <PasswordRequirements checks={checks} />
                    </div>

                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={!canSubmit} className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]">
                            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

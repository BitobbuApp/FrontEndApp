import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { companyApi } from '../../services/companyApi';
import { TWO_FACTOR_STATUS_KEY, useTwoFactorStatus } from '../../hooks/useTwoFactorStatus';

/**
 * Company policy: every user of the company must use two-step verification.
 * It saves immediately (a security action), outside the page's "Guardar cambios" button.
 */
export default function CompanyTwoFactorPolicyCard({ companyId }) {
    const queryClient = useQueryClient();
    const { data: status } = useTwoFactorStatus();
    const [pendingValue, setPendingValue] = useState(null); // value waiting for confirmation
    const [isSaving, setIsSaving] = useState(false);

    const required = Boolean(status?.company_requires_2fa);

    const confirm = async () => {
        setIsSaving(true);
        try {
            await companyApi.updateCompanySettings(companyId, { two_factor_required: pendingValue });
            await queryClient.invalidateQueries({ queryKey: [TWO_FACTOR_STATUS_KEY] });
            toast.success(pendingValue ? 'La empresa ahora exige la verificación en dos pasos' : 'La empresa ya no exige la verificación en dos pasos');
        } catch (err) {
            toast.error(err?.userMessage || 'No pudimos guardar el cambio. Inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
            setPendingValue(null);
        }
    };

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-foreground" />
                    Política de la empresa
                </CardTitle>
                <CardDescription>Define si todos los usuarios de tu empresa deben proteger su cuenta con dos pasos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="company-2fa" className="text-sm text-slate-700 cursor-pointer">
                        Exigir la verificación en dos pasos a todos los usuarios de mi empresa
                    </Label>
                    <Switch
                        id="company-2fa"
                        checked={required}
                        disabled={!status || isSaving}
                        onCheckedChange={(value) => setPendingValue(value)}
                    />
                </div>
            </CardContent>

            <AlertDialog open={pendingValue !== null} onOpenChange={(open) => { if (!open && !isSaving) setPendingValue(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingValue ? '¿Exigir la verificación en dos pasos?' : '¿Dejar de exigir la verificación en dos pasos?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingValue
                                ? 'Quienes todavía no la tengan deberán activarla en su próximo inicio de sesión, antes de entrar a Bitobbu. Los usuarios que ya la activaron no verán cambios. Mientras la exigencia esté activa, nadie podrá desactivar su verificación.'
                                : 'Cada usuario podrá desactivar su verificación en dos pasos si lo desea. Las cuentas que ya la tienen seguirán usándola hasta que la desactiven.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); confirm(); }} disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Confirmar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

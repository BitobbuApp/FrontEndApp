import React from 'react';
import { Clock3 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function NotificationsTab({ formData, setFormData }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Configura como quieres recibir alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Canales</h4>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                            <p className="font-medium text-foreground">Email</p>
                            <p className="text-sm text-slate-500">Recibir notificaciones por correo</p>
                        </div>
                        <Switch
                            checked={formData.email_notifications}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, email_notifications: v }))
                            }
                        />
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                                <Clock3 className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-foreground">Mas canales proximamente</p>
                                <p className="text-sm text-slate-500">
                                    Las notificaciones web y WhatsApp se habilitaran en futuras actualizaciones. Por ahora, email es el canal disponible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

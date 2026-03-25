import React from 'react';
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
                <CardDescription>Configura cómo quieres recibir alertas</CardDescription>
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

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                            <p className="font-medium text-foreground">Notificaciones Web</p>
                            <p className="text-sm text-slate-500">Alertas en el navegador</p>
                        </div>
                        <Switch
                            checked={formData.web_notifications}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, web_notifications: v }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                            <p className="font-medium text-foreground">WhatsApp</p>
                            <p className="text-sm text-slate-500">
                                Recibir notificaciones por WhatsApp
                            </p>
                        </div>
                        <Switch
                            checked={formData.whatsapp_notifications}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, whatsapp_notifications: v }))
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

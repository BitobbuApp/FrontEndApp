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
                    <h4 className="font-medium text-[#1E293B]">Canales</h4>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#1E293B]">Email</p>
                            <p className="text-sm text-slate-500">Recibir notificaciones por correo</p>
                        </div>
                        <Switch
                            checked={formData.notificaciones_email}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, notificaciones_email: v }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#1E293B]">Notificaciones Web</p>
                            <p className="text-sm text-slate-500">Alertas en el navegador</p>
                        </div>
                        <Switch
                            checked={formData.notificaciones_web}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, notificaciones_web: v }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#1E293B]">WhatsApp</p>
                            <p className="text-sm text-slate-500">
                                Recibir notificaciones por WhatsApp
                            </p>
                        </div>
                        <Switch
                            checked={formData.notificaciones_whatsapp}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, notificaciones_whatsapp: v }))
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

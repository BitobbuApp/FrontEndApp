import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContactTab({ formData, setFormData }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Persona y datos de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Persona Encargada *</Label>
                        <Input
                            value={formData.persona_encargada}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, persona_encargada: e.target.value }))
                            }
                            placeholder="Juan Pérez"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Cargo *</Label>
                        <Input
                            value={formData.cargo}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cargo: e.target.value }))}
                            placeholder="Gerente de Compras"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp *</Label>
                        <Input
                            value={formData.whatsapp}
                            onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                            placeholder="+58 412 1234567"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Corporativo *</Label>
                        <Input
                            type="email"
                            value={formData.email_corporativo}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email_corporativo: e.target.value }))
                            }
                            placeholder="contacto@empresa.com"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

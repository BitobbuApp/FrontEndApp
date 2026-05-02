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
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import tooltips from '@/constants/tooltips.json';

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
                        <Label className="flex items-center">
                            Persona Encargada *
                            <InfoTooltip content={tooltips.settings.contact.person} />
                        </Label>
                        <Input
                            value={formData.contact_person}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, contact_person: e.target.value }))
                            }
                            placeholder="Juan Pérez"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Cargo *</Label>
                        <Input
                            value={formData.contact_role}
                            onChange={(e) => setFormData((prev) => ({ ...prev, contact_role: e.target.value }))}
                            placeholder="Gerente de Compras"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center">
                            WhatsApp *
                            <InfoTooltip content={tooltips.settings.contact.whatsapp} />
                        </Label>
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
                            value={formData.corporate_email}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, corporate_email: e.target.value }))
                            }
                            placeholder="contacto@empresa.com"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

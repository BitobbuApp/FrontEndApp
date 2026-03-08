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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export const ESTADOS_VENEZUELA = [
    'Amazonas',
    'Anzoátegui',
    'Apure',
    'Aragua',
    'Barinas',
    'Bolívar',
    'Carabobo',
    'Cojedes',
    'Delta Amacuro',
    'Distrito Capital',
    'Falcón',
    'Guárico',
    'Lara',
    'Mérida',
    'Miranda',
    'Monagas',
    'Nueva Esparta',
    'Portuguesa',
    'Sucre',
    'Táchira',
    'Trujillo',
    'Vargas',
    'Yaracuy',
    'Zulia',
];

export default function LocationTab({ formData, setFormData }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Dirección y cobertura de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Dirección Fiscal *</Label>
                    <Textarea
                        value={formData.tax_address}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, tax_address: e.target.value }))
                        }
                        placeholder="Av. Principal, Edificio..."
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Estado *</Label>
                        <Select
                            value={formData.location_state}
                            onValueChange={(v) =>
                                setFormData((prev) => ({ ...prev, location_state: v }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {ESTADOS_VENEZUELA.map((e) => (
                                    <SelectItem key={e} value={e}>
                                        {e}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ciudad *</Label>
                        <Input
                            value={formData.location_city}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, location_city: e.target.value }))
                            }
                            placeholder="Caracas"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                        <p className="font-medium text-[#1E293B]">Cobertura Nacional</p>
                        <p className="text-sm text-slate-500">¿Tu empresa opera en todo el país?</p>
                    </div>
                    <Switch
                        checked={formData.national_coverage}
                        onCheckedChange={(v) =>
                            setFormData((prev) => ({ ...prev, national_coverage: v }))
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

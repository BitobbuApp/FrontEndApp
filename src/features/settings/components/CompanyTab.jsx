import React from 'react';
import { Upload, Building2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export const SECTORES = [
    'Alimentos',
    'Ferretería',
    'Salud',
    'IT',
    'Automotriz',
    'Embalaje',
    'Químicos',
    'Oficina',
    'Textil',
    'Logística',
    'Mantenimiento',
    'Seguridad',
    'Marketing',
    'Legal',
    'RRHH',
];

export const TIPOS_EMPRESA = [
    'Fabricante',
    'Mayorista',
    'Distribuidor',
    'Prestador de Servicios',
    'Minorista',
];

export default function CompanyTab({ formData, setFormData, handleLogoChange, uploadLogoPending }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>Datos principales de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                        {formData.logo_url ? (
                            <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="w-10 h-10 text-slate-300" />
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="logo-upload"
                            onChange={handleLogoChange}
                        />
                        <label htmlFor="logo-upload">
                            <Button variant="outline" asChild className="cursor-pointer">
                                <span>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadLogoPending ? 'Cargando...' : 'Cambiar Logo'}
                                </span>
                            </Button>
                        </label>
                        <p className="text-xs text-slate-500 mt-2">PNG, JPG hasta 5MB</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Nombre Comercial *</Label>
                        <Input
                            value={formData.trade_name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, trade_name: e.target.value }))
                            }
                            placeholder="Mi Empresa C.A."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Nombre Legal *</Label>
                        <Input
                            value={formData.legal_name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, legal_name: e.target.value }))
                            }
                            placeholder="Mi Empresa, C.A."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>RIF *</Label>
                        <Input
                            value={formData.tax_id}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tax_id: e.target.value }))}
                            placeholder="J-12345678-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Año de Fundación</Label>
                        <Input
                            type="number"
                            value={formData.founding_year}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    founding_year: parseInt(e.target.value),
                                }))
                            }
                            placeholder="2010"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sector *</Label>
                        <Select
                            value={formData.sector}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, sector: v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un sector" />
                            </SelectTrigger>
                            <SelectContent>
                                {SECTORES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Empresa</Label>
                        <Select
                            value={formData.company_type}
                            onValueChange={(v) => setFormData((prev) => ({ ...prev, company_type: v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS_EMPRESA.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Bio / Descripción</Label>
                    <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Describe tu empresa, productos y servicios..."
                        className="min-h-[100px]"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

import React from 'react';
import { Building2, Upload } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CompanyTab({
    formData,
    setFormData,
    foundingYearError,
    setFoundingYearError,
    handleLogoChange,
    uploadLogoPending,
    sectorOptions = [],
    companyTypeOptions = [],
}) {
    const currentYear = new Date().getFullYear();

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Informacion de la Empresa</CardTitle>
                <CardDescription>Datos principales de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-slate-100">
                        {formData.logo_url ? (
                            <img src={formData.logo_url} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <Building2 className="h-10 w-10 text-slate-300" />
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
                                    <Upload className="mr-2 h-4 w-4" />
                                    {uploadLogoPending ? 'Cargando...' : 'Cambiar Logo'}
                                </span>
                            </Button>
                        </label>
                        <p className="mt-2 text-xs text-slate-500">PNG, JPG hasta 5MB</p>
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
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, tax_id: e.target.value }))
                            }
                            placeholder="J-12345678-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Año de Fundacion</Label>
                        <Input
                            type="number"
                            value={formData.founding_year}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setFormData((prev) => ({ ...prev, founding_year: nextValue }));

                                if (!nextValue) {
                                    setFoundingYearError('');
                                    return;
                                }

                                const parsedYear = Number(nextValue);
                                if (!Number.isInteger(parsedYear) || parsedYear > currentYear) {
                                    setFoundingYearError(`Ingresa un año válido no mayor a ${currentYear}.`);
                                    return;
                                }

                                setFoundingYearError('');
                            }}
                            placeholder="2010"
                            min="1800"
                            max={currentYear}
                        />
                        {foundingYearError && (
                            <p className="text-sm text-red-600">{foundingYearError}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Sector *</Label>
                        <Select
                            value={formData.sector_id}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, sector_id: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un sector" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectorOptions.map((sector) => (
                                    <SelectItem key={sector.id} value={sector.value}>
                                        {sector.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Empresa</Label>
                        <Select
                            value={formData.company_type_id}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, company_type_id: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {companyTypeOptions.map((companyType) => (
                                    <SelectItem key={companyType.id} value={companyType.value}>
                                        {companyType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Bio / Descripcion</Label>
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

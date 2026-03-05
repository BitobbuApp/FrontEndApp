import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SECTORES } from './CompanyTab';

export const METODOS_PAGO = [
    'Transferencia',
    'Efectivo',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Criptomoneda',
    'Pago Móvil',
    'Zelle',
];

export default function CommercialTab({ formData, setFormData, toggleCategoria, toggleMetodoPago }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Perfil Comercial</CardTitle>
                <CardDescription>Información sobre tu actividad comercial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Interés Principal *</Label>
                    <RadioGroup
                        value={formData.interes}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, interes: v }))}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Comprar" id="comprar" />
                            <Label htmlFor="comprar">Comprar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Vender" id="vender" />
                            <Label htmlFor="vender">Vender</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ambos" id="ambos" />
                            <Label htmlFor="ambos">Ambos</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label>Categorías de Interés</Label>
                    <div className="flex flex-wrap gap-2">
                        {SECTORES.map((cat) => (
                            <Badge
                                key={cat}
                                variant={
                                    formData.categorias_interes?.includes(cat) ? 'default' : 'outline'
                                }
                                className={`cursor-pointer transition-colors ${formData.categorias_interes?.includes(cat)
                                        ? 'bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]'
                                        : 'hover:bg-slate-100'
                                    }`}
                                onClick={() => toggleCategoria(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Volumen Aproximado</Label>
                    <Select
                        value={formData.volumen_aproximado}
                        onValueChange={(v) =>
                            setFormData((prev) => ({ ...prev, volumen_aproximado: v }))
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pequeño">Pequeño</SelectItem>
                            <SelectItem value="Medio">Medio</SelectItem>
                            <SelectItem value="Grande">Grande</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-[#1E293B]">Confianza y Pagos</h4>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#1E293B]">¿Agente de Retención?</p>
                            <p className="text-sm text-slate-500">
                                ¿Tu empresa es agente de retención de IVA?
                            </p>
                        </div>
                        <Switch
                            checked={formData.agente_retencion}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, agente_retencion: v }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-[#1E293B]">¿Trabajas con Crédito?</p>
                            <p className="text-sm text-slate-500">
                                ¿Ofreces o aceptas pagos a crédito?
                            </p>
                        </div>
                        <Switch
                            checked={formData.trabaja_credito}
                            onCheckedChange={(v) =>
                                setFormData((prev) => ({ ...prev, trabaja_credito: v }))
                            }
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Métodos de Pago Aceptados</Label>
                        <div className="flex flex-wrap gap-2">
                            {METODOS_PAGO.map((metodo) => (
                                <Badge
                                    key={metodo}
                                    variant={
                                        formData.metodos_pago?.includes(metodo)
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className={`cursor-pointer transition-colors ${formData.metodos_pago?.includes(metodo)
                                            ? 'bg-[#1E293B] text-white hover:bg-slate-700'
                                            : 'hover:bg-slate-100'
                                        }`}
                                    onClick={() => toggleMetodoPago(metodo)}
                                >
                                    {metodo}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

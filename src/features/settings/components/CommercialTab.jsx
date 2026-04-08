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

export default function CommercialTab({
    formData,
    setFormData,
    toggleCategoria,
    toggleMetodoPago,
    categoryOptions = [],
    paymentMethodOptions = [],
    companySizeOptions = [],
    estimatedMonthlyTransactionOptions = [],
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Perfil Comercial</CardTitle>
                <CardDescription>Informacion sobre tu actividad comercial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/*
                <div className="space-y-3">
                    <Label>Interes Principal *</Label>
                    <RadioGroup
                        value={formData.interest}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, interest: value }))}
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
                */}
                <div className="space-y-3">
                    <Label>Categorias de Interes</Label>
                    <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((category) => (
                            <Badge
                                key={category.id}
                                variant={formData.interest_category_ids?.includes(category.value) ? 'default' : 'outline'}
                                className={`cursor-pointer transition-colors ${
                                    formData.interest_category_ids?.includes(category.value)
                                        ? 'bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]'
                                        : 'hover:bg-slate-100'
                                }`}
                                onClick={() => toggleCategoria(category.value)}
                            >
                                {category.label}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tamaño de la Empresa</Label>
                        <Select
                            value={formData.company_size_id || ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, company_size_id: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tamaño" />
                            </SelectTrigger>
                            <SelectContent>
                                {companySizeOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Volumen Mensual Estimado</Label>
                        <Select
                            value={formData.monthly_transactions_id || ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, monthly_transactions_id: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar volumen" />
                            </SelectTrigger>
                            <SelectContent>
                                {estimatedMonthlyTransactionOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-foreground">Confianza y Pagos</h4>

                    <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                        <div>
                            <p className="font-medium text-foreground">Agente de Retencion</p>
                            <p className="text-sm text-slate-500">
                                Tu empresa es agente de retencion de IVA?
                            </p>
                        </div>
                        <Switch
                            checked={formData.retention_agent}
                            onCheckedChange={(value) =>
                                setFormData((prev) => ({ ...prev, retention_agent: value }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                        <div>
                            <p className="font-medium text-foreground">Trabajas con Credito</p>
                            <p className="text-sm text-slate-500">
                                Ofreces o aceptas pagos a credito?
                            </p>
                        </div>
                        <Switch
                            checked={formData.works_with_credit}
                            onCheckedChange={(value) =>
                                setFormData((prev) => ({ ...prev, works_with_credit: value }))
                            }
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Metodos de Pago Aceptados</Label>
                        <div className="flex flex-wrap gap-2">
                            {paymentMethodOptions.map((paymentMethod) => (
                                <Badge
                                    key={paymentMethod.id}
                                    variant={formData.payment_method_ids?.includes(paymentMethod.value) ? 'default' : 'outline'}
                                    className={`cursor-pointer transition-colors ${
                                        formData.payment_method_ids?.includes(paymentMethod.value)
                                            ? 'bg-[#1E293B] text-white hover:bg-slate-700'
                                            : 'hover:bg-slate-100'
                                    }`}
                                    onClick={() => toggleMetodoPago(paymentMethod.value)}
                                >
                                    {paymentMethod.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import React from 'react';
import { CalendarIcon } from 'lucide-react';
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
import useAppMetadata from '../../appMetadata/hooks/useAppMetadata';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import tooltips from '@/constants/tooltips.json';

export default function ProductRequestForm({
    form,
    setForm,
    categoryOptions = [],
    unitOptions = [],
    paymentConditionOptions = [],
}) {
    // Venezuela is the only active country — always fixed to ID 1
    const VENEZUELA_ID = '1';
    const { states, isLoading: isLoadingStates } = useAppMetadata();

    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label className="flex items-center">
                    Nombre del producto *
                    <InfoTooltip content={tooltips.requests.product.name} />
                </Label>
                <Input
                    value={form.product_service}
                    onChange={set('product_service')}
                    placeholder="Ej: Papel Bond A4, Cabillas 3/8..."
                    className="h-11"
                />
            </div>

            <div className="space-y-2">
                <Label className="flex items-center">
                    Categoría / Rubro *
                    <InfoTooltip content={tooltips.requests.product.category} />
                </Label>
                <Select value={form.category_id} onValueChange={set('category_id')}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        {categoryOptions.map((category) => (
                            <SelectItem key={category.id} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Cantidad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={set('quantity')}
                        placeholder="Ej: 500"
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center">
                        Unidad de medida *
                        <InfoTooltip content={tooltips.requests.product.unit} />
                    </Label>
                    <Select value={form.unit_id} onValueChange={set('unit_id')}>
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {unitOptions.map((unit) => (
                                <SelectItem key={unit.id} value={unit.value}>
                                    {unit.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>País de Entrega</Label>
                    <Select disabled value="1">
                        <SelectTrigger className="h-11 bg-slate-50 text-slate-500">
                            <SelectValue placeholder="Venezuela" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Venezuela</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center">
                        Estado de ejecución / Entrega *
                        <InfoTooltip content={tooltips.requests.product.location} />
                    </Label>
                    <Select
                        disabled={isLoadingStates}
                        value={form.state_id?.toString()}
                        onValueChange={(value) => {
                            setForm((prev) => ({
                                ...prev,
                                country_id: VENEZUELA_ID,
                                state_id: value,
                            }));
                        }}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccionar estado (Venezuela)" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((estado) => (
                                <SelectItem key={estado.id} value={estado.id.toString()}>
                                    {estado.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center">
                    Condición de pago preferida *
                    <InfoTooltip content={tooltips.requests.product.payment} />
                </Label>
                <Select value={form.payment_condition_id || ''} onValueChange={set('payment_condition_id')}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar condición" />
                    </SelectTrigger>
                    <SelectContent>
                        {paymentConditionOptions.map((option) => (
                            <SelectItem key={option.id} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center">
                    Fecha límite de recepción de cotizaciones *
                    <InfoTooltip content={tooltips.requests.product.deadline} />
                </Label>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-slate-400" />
                    <Input
                        type="date"
                        value={form.expiration_date}
                        onChange={set('expiration_date')}
                        className="h-11 pl-9 text-slate-600"
                        placeholder="Seleccionar fecha"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center">
                    Descripción adicional
                    <InfoTooltip content={tooltips.requests.product.description} />
                </Label>
                <Textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Marca, especificaciones tecnicas, presentacion preferida..."
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}

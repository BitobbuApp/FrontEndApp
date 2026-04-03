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
import useGeographicData from '../../geographic/hooks/useGeographicData';

const CONDICIONES_PAGO = ['Negociable', 'Contado', 'Credito 30 dias', 'Credito 60 dias', 'Anticipo 50%'];

export default function ProductRequestForm({
    form,
    setForm,
    categoryOptions = [],
    unitOptions = [],
}) {
    // Default country to Venezuela (ID: 1) if not set
    const currentCountryId = form.delivery_country_id || '1';
    const { countries, states, isLoadingCountries, isLoadingStates } = useGeographicData(currentCountryId, null);

    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label>
                    Nombre del Producto <span className="text-red-500">*</span>
                </Label>
                <Input
                    value={form.product_service}
                    onChange={set('product_service')}
                    placeholder="Ej: Papel Bond A4, Cabillas 3/8..."
                    className="h-11"
                />
            </div>

            <div className="space-y-2">
                <Label>Categoria / Rubro</Label>
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
                    <Label className="text-[#D2FC31] font-semibold">Unidad de Medida</Label>
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
                    <Select 
                        disabled={isLoadingCountries} 
                        value={currentCountryId} 
                        onValueChange={(value) => {
                            setForm((prev) => ({ 
                                ...prev, 
                                delivery_country_id: value, 
                                delivery_state_id: '', 
                                delivery_state: '' 
                            }));
                        }}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((pais) => (
                                <SelectItem key={pais.id} value={pais.id.toString()}>
                                    {pais.name_es}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Estado de Entrega</Label>
                    <Select 
                        disabled={isLoadingStates || !currentCountryId}
                        value={form.delivery_state_id?.toString()} 
                        onValueChange={(value) => {
                            const selectedState = states.find(s => s.id.toString() === value);
                            setForm((prev) => ({ 
                                ...prev, 
                                delivery_state_id: value, 
                                delivery_state: selectedState?.name || '' 
                            }));
                        }}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccionar estado" />
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
                <Label>Condiciones de Pago</Label>
                <Select value={form.payment_terms} onValueChange={set('payment_terms')}>
                    <SelectTrigger className="h-11">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CONDICIONES_PAGO.map((condicion) => (
                            <SelectItem key={condicion} value={condicion}>
                                {condicion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Fecha Limite</Label>
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
                <Label>Descripcion adicional</Label>
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

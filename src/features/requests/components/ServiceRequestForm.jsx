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

export default function ServiceRequestForm({ form, setForm, categoryOptions = [] }) {
    // Default country to Venezuela (ID: 1) if not set
    const currentCountryId = form.execution_country_id || '1';
    const { countries, states, isLoadingCountries, isLoadingStates } = useGeographicData(currentCountryId, null);

    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label>
                    Nombre del Servicio <span className="text-red-500">*</span>
                </Label>
                <Input
                    value={form.product_service}
                    onChange={set('product_service')}
                    placeholder="Ej: Mantenimiento de aires, Flete Caracas-Valencia..."
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

            <div className="space-y-2">
                <Label>
                    Descripcion del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    value={form.project_description}
                    onChange={set('project_description')}
                    placeholder="Describe el trabajo que necesitas realizar, materiales disponibles, condiciones del sitio..."
                    className="min-h-[120px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Fecha de Ejecucion</Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-slate-400" />
                        <Input
                            type="date"
                            value={form.execution_date}
                            onChange={set('execution_date')}
                            className="h-11 pl-9 text-slate-600"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Alcance del Servicio</Label>
                    <Input
                        value={form.scope}
                        onChange={set('scope')}
                        placeholder="Ej: 3 equipos, 500 m2..."
                        className="h-11"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>País donde se ejecuta</Label>
                    <Select 
                        disabled={isLoadingCountries} 
                        value={currentCountryId} 
                        onValueChange={(value) => {
                            setForm((prev) => ({ 
                                ...prev, 
                                execution_country_id: value, 
                                execution_state_id: '', 
                                execution_state: '' 
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
                    <Label>Estado donde se ejecuta</Label>
                    <Select 
                        disabled={isLoadingStates || !currentCountryId}
                        value={form.execution_state_id?.toString()} 
                        onValueChange={(value) => {
                            const selectedState = states.find(s => s.id.toString() === value);
                            setForm((prev) => ({ 
                                ...prev, 
                                execution_state_id: value, 
                                execution_state: selectedState?.name || '' 
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
                    />
                </div>
            </div>
        </div>
    );
}

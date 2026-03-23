import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

const CATEGORIAS = [
    'Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje',
    'Químicos', 'Oficina', 'Textil', 'Logística', 'Mantenimiento',
    'Seguridad', 'Marketing', 'Legal', 'RRHH', 'Otro',
];

const ESTADOS_VE = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
    'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa',
    'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
    'Distrito Capital',
];

const CONDICIONES_PAGO = ['Negociable', 'Contado', 'Crédito 30 días', 'Crédito 60 días', 'Anticipo 50%'];

/**
 * Atomic form for requesting a Service (Servicio / Conocimiento).
 */
export default function ServiceRequestForm({ form, setForm }) {
    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

    return (
        <div className="space-y-5">
            {/* Service name */}
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

            {/* Category */}
            <div className="space-y-2">
                <Label>Categoría / Rubro</Label>
                <Select value={form.category} onValueChange={set('category')}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIAS.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Project description */}
            <div className="space-y-2">
                <Label>
                    Descripción del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    value={form.project_description}
                    onChange={set('project_description')}
                    placeholder="Describe el trabajo que necesitas realizar, materiales disponibles, condiciones del sitio..."
                    className="min-h-[120px]"
                />
            </div>

            {/* Execution date + Scope */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Fecha de Ejecución</Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
                        placeholder="Ej: 3 equipos, 500 m²..."
                        className="h-11"
                    />
                </div>
            </div>

            {/* Location — State + City */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Estado donde se ejecuta</Label>
                    <Select value={form.execution_state} onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, execution_state: v, execution_city: '' }));
                    }}>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {ESTADOS_VE.map((e) => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input
                        value={form.execution_city}
                        onChange={set('execution_city')}
                        disabled={!form.execution_state}
                        placeholder={form.execution_state ? 'Ej: Maracaibo' : 'Primero un estado'}
                        className="h-11"
                    />
                </div>
            </div>

            {/* Payment terms */}
            <div className="space-y-2">
                <Label>Condiciones de Pago</Label>
                <Select value={form.payment_terms} onValueChange={set('payment_terms')}>
                    <SelectTrigger className="h-11">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CONDICIONES_PAGO.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Expiry date */}
            <div className="space-y-2">
                <Label>Fecha Límite</Label>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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

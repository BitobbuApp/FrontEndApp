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

const UNIDADES = [
    { value: 'Units', label: 'Unidades' },
    { value: 'Kg', label: 'Kg' },
    { value: 'Liters', label: 'Litros' },
    { value: 'Meters', label: 'Metros' },
    { value: 'Boxes', label: 'Cajas' },
    { value: 'Pallets', label: 'Paletas' },
    { value: 'Tons', label: 'Toneladas' },
    { value: 'Gallons', label: 'Galones' },
];

const ESTADOS_VE = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
    'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa',
    'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
    'Distrito Capital',
];

const CONDICIONES_PAGO = ['Negociable', 'Contado', 'Crédito 30 días', 'Crédito 60 días', 'Anticipo 50%'];

const field = (form, setForm) => (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value ?? e }));

/**
 * Atomic form for requesting a Product (Bien físico).
 */
export default function ProductRequestForm({ form, setForm }) {
    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === 'string' ? e : e.target.value }));

    return (
        <div className="space-y-5">
            {/* Name */}
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

            {/* Quantity + Unit */}
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
                    <Select value={form.unit_of_measure} onValueChange={set('unit_of_measure')}>
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {UNIDADES.map((u) => (
                                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Delivery — State + City */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Estado de Entrega</Label>
                    <Select value={form.delivery_state} onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, delivery_state: v, delivery_city: '' }));
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
                        value={form.delivery_city}
                        onChange={set('delivery_city')}
                        disabled={!form.delivery_state}
                        placeholder={form.delivery_state ? 'Ej: Valencia' : 'Primero un estado'}
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
                        placeholder="Seleccionar fecha"
                    />
                </div>
            </div>

            {/* Additional description */}
            <div className="space-y-2">
                <Label>Descripción adicional</Label>
                <Textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Marca, especificaciones técnicas, presentación preferida..."
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}

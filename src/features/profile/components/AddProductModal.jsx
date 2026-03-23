import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { productsApi } from '../services/productsApi';
import { toast } from 'sonner';
import { Upload, Package } from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const CATEGORIAS = [
    'Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje',
    'Químicos', 'Oficina', 'Textil', 'Logística', 'Mantenimiento',
    'Seguridad', 'Marketing', 'Legal', 'RRHH', 'Otro',
];

const UNIDADES = [
    'Unidad', 'Kg', 'Gramos', 'Litros', 'Metros', 'M²', 'Caja', 'Palet',
    'Tonelada', 'Galón', 'Rollo', 'Par', 'Docena', 'Servicio',
];

const TIPOS = ['Producto', 'Servicio'];
const DISPONIBILIDAD = ['Disponible', 'Bajo Pedido', 'Agotado'];

const DEFAULT_FORM = {
    type: 'Producto',
    name: '',
    category: '',
    brand: '',
    unit_price: '',
    unit_of_measure: 'Unidad',
    min_order_quantity: '1',
    availability: 'Disponible',
    short_description: '',
    full_description: '',
    image_url: '',
};

export default function AddProductModal({ open, onOpenChange }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(DEFAULT_FORM);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const mutation = useMutation({
        mutationFn: (data) => productsApi.createProduct(data),
        onSuccess: () => {
            toast.success('Producto/Servicio agregado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['companyProducts'] });
            setForm(DEFAULT_FORM);
            onOpenChange(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al guardar');
        },
    });

    const handleSubmit = () => {
        if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
        if (!form.unit_price || Number(form.unit_price) < 0) { toast.error('Ingresa un precio válido'); return; }

        mutation.mutate({
            ...form,
            unit_price: Number(form.unit_price),
            min_order_quantity: Number(form.min_order_quantity) || 1,
            company_id: user?.company_id,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-[#1E293B]">
                        Agregar Producto o Servicio
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* Type toggle */}
                    <div className="flex gap-2">
                        {TIPOS.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => set('type', t)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                    form.type === t
                                        ? 'bg-[#D2FC31] border-[#D2FC31] text-[#1E293B]'
                                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Image upload */}
                    <div>
                        <Label className="mb-2 block">Imágenes del {form.type}</Label>
                        <div className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 transition-colors">
                            <Upload className="w-6 h-6 text-slate-400" />
                            <span className="text-[10px] text-slate-400">Subir imagen</span>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Nombre del {form.type} *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder={form.type === 'Servicio' ? 'Ej: Diseño de Logo' : 'Ej: Aceite de Motor 5W30'}
                        />
                    </div>

                    {/* Category + Brand */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Select value={form.category} onValueChange={(v) => set('category', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {form.type === 'Producto' && (
                            <div className="space-y-2">
                                <Label>Marca</Label>
                                <Input
                                    value={form.brand}
                                    onChange={(e) => set('brand', e.target.value)}
                                    placeholder="Ej: Shell"
                                />
                            </div>
                        )}
                    </div>

                    {/* Price + Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Precio Unitario ($) *</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.unit_price}
                                onChange={(e) => set('unit_price', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Unidad de Medida</Label>
                            <Select value={form.unit_of_measure} onValueChange={(v) => set('unit_of_measure', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {UNIDADES.map((u) => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* MOQ + Availability (Producto only) */}
                    {form.type === 'Producto' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cantidad Mínima (MOQ) *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={form.min_order_quantity}
                                    onChange={(e) => set('min_order_quantity', e.target.value)}
                                    placeholder="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Disponibilidad</Label>
                                <Select value={form.availability} onValueChange={(v) => set('availability', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {DISPONIBILIDAD.map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Descriptions */}
                    <div className="space-y-2">
                        <Label>Descripción Corta</Label>
                        <Input
                            value={form.short_description}
                            onChange={(e) => set('short_description', e.target.value)}
                            placeholder="Resumen breve del producto o servicio"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Descripción Completa</Label>
                        <Textarea
                            value={form.full_description}
                            onChange={(e) => set('full_description', e.target.value)}
                            placeholder="Descripción detallada..."
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Guardando...' : `Agregar ${form.type}`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

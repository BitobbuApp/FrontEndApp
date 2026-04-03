import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { productsApi } from '../services/productsApi';

const TIPOS = ['Producto', 'Servicio'];
const DISPONIBILIDAD = ['Disponible', 'Bajo Pedido', 'Agotado'];

const DEFAULT_FORM = {
    type: 'Producto',
    name: '',
    category_id: '',
    brand: '',
    base_price: '',
    unit_id: '',
    moq: '1',
    availability: 'Disponible',
    description: '',
    image_url: '',
};

export default function AddProductModal({ open, onOpenChange }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(DEFAULT_FORM);
    const {
        categoryOptions,
        unitOptions,
        defaultUnitOption,
    } = useAppMetadata();

    useEffect(() => {
        if (!defaultUnitOption?.value) {
            return;
        }

        setForm((prev) => (
            prev.unit_id
                ? prev
                : { ...prev, unit_id: defaultUnitOption.value }
        ));
    }, [defaultUnitOption?.value]);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const mutation = useMutation({
        mutationFn: (data) => productsApi.createProduct(data),
        onSuccess: () => {
            toast.success('Producto/Servicio agregado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['companyProducts'] });
            setForm({
                ...DEFAULT_FORM,
                unit_id: defaultUnitOption?.value || '',
            });
            onOpenChange(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al guardar');
        },
    });

    const handleSubmit = () => {
        if (!form.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (!form.base_price || Number(form.base_price) < 0) {
            toast.error('Ingresa un precio valido');
            return;
        }

        mutation.mutate({
            name: form.name.trim(),
            description: form.description?.trim() || null,
            category_id: form.category_id ? Number(form.category_id) : null,
            base_price: Number(form.base_price),
            unit_id: form.unit_id ? Number(form.unit_id) : Number(defaultUnitOption?.id) || null,
            moq: Number(form.moq) || 1,
            is_active: form.availability !== 'Agotado',
            company_id: user?.company_id,
            photos: form.image_url ? [{ url: form.image_url, sort_order: 0 }] : [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-foreground">
                        Agregar Producto o Servicio
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    <div className="flex gap-2">
                        {TIPOS.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => set('type', type)}
                                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                                    form.type === type
                                        ? 'border-[#D2FC31] bg-[#D2FC31] text-slate-900'
                                        : 'border-border text-slate-500 hover:bg-muted/50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div>
                        <Label className="mb-2 block">Imagenes del {form.type}</Label>
                        <div className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-slate-100">
                            <Upload className="h-6 w-6 text-slate-400" />
                            <span className="text-[10px] text-slate-400">Subir imagen</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Nombre del {form.type} *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder={form.type === 'Servicio' ? 'Ej: Diseno de Logo' : 'Ej: Aceite de Motor 5W30'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select value={form.category_id} onValueChange={(value) => set('category_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Precio Unitario ($) *</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.base_price}
                                onChange={(e) => set('base_price', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Unidad de Medida</Label>
                            <Select value={form.unit_id} onValueChange={(value) => set('unit_id', value)}>
                                <SelectTrigger>
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

                    {form.type === 'Producto' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cantidad Minima (MOQ) *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={form.moq}
                                    onChange={(e) => set('moq', e.target.value)}
                                    placeholder="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Disponibilidad</Label>
                                <Select value={form.availability} onValueChange={(value) => set('availability', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DISPONIBILIDAD.map((availability) => (
                                            <SelectItem key={availability} value={availability}>
                                                {availability}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Descripcion</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            placeholder="Descripcion detallada del producto o servicio..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border pt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
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


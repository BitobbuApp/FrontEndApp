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

const DISPONIBILIDAD = ['Disponible', 'Bajo Pedido', 'Agotado'];
const DEFAULT_FORM = {
    name: '',
    category_id: '',
    brand: '',
    base_price_usd: '',
    unit_id: '',
    moq: '1',
    availability: 'Disponible',
    description: '',
};

export default function AddProductModal({ open, onOpenChange }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(DEFAULT_FORM);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
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
            toast.success('Producto agregado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['companyProducts'] });
            setForm({
                ...DEFAULT_FORM,
                unit_id: defaultUnitOption?.value || '',
            });
            setSelectedFile(null);
            setPreviewUrl(null);
            onOpenChange(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al guardar');
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!form.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (!form.base_price_usd || Number(form.base_price_usd) < 0) {
            toast.error('Ingresa un precio valido');
            return;
        }

        if (!selectedFile) {
            toast.error('Debes subir al menos una imagen del producto');
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name.trim());
        formData.append('description', form.description?.trim() || '');
        if (form.category_id) formData.append('category_id', Number(form.category_id));
        formData.append('base_price_usd', Number(form.base_price_usd));
        formData.append('unit_id', form.unit_id ? Number(form.unit_id) : Number(defaultUnitOption?.id) || '');
        formData.append('moq', Number(form.moq) || 1);
        formData.append('is_active', form.availability !== 'Agotado');
        formData.append('company_id', user?.company_id);
        
        if (selectedFile) {
            formData.append('files', selectedFile);
        }

        mutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-foreground">
                        Agregar Producto
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    <div>
                        <Label className="mb-2 block text-xs uppercase tracking-wider font-bold text-slate-500">Imágenes del Producto *</Label>
                        <div 
                            className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-slate-100 overflow-hidden relative"
                            onClick={() => document.getElementById('product-image-upload').click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="h-6 w-6 text-slate-400" />
                                    <span className="text-[10px] text-slate-400">Subir imagen</span>
                                </>
                            )}
                            <input 
                                id="product-image-upload"
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Nombre del Producto *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder="Ej: Aceite de Motor 5W30"
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
                        <div className="space-y-2">
                            <Label>Marca</Label>
                            <Input
                                value={form.brand}
                                onChange={(e) => set('brand', e.target.value)}
                                placeholder="Ej: Shell"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Precio Unitario ($) *</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.base_price_usd}
                                onChange={(e) => set('base_price_usd', e.target.value)}
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

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            placeholder="Descripción detallada del producto..."
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
                            className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-bold"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Guardando...' : 'Agregar Producto'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


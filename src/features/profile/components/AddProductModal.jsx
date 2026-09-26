import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
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
    base_price_usd: '',
    unit_id: '',
    moq: '1',
    availability: 'Disponible',
    description: '',
};

export default function AddProductModal({ open, onOpenChange, initialData = null }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(DEFAULT_FORM);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [pricingTiers, setPricingTiers] = useState([]);

    const addTier = () => setPricingTiers(prev => [...prev, { min_quantity: '', max_quantity: '', price_usd: '' }]);
    const removeTier = (idx) => setPricingTiers(prev => prev.filter((_, i) => i !== idx));
    const updateTier = (idx, field, value) => setPricingTiers(prev => {
        const newTiers = [...prev];
        newTiers[idx][field] = value;
        return newTiers;
    });

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

    useEffect(() => {
        if (initialData && open) {
            setForm({
                name: initialData.name || '',
                category_id: initialData.category_id?.toString() || '',
                base_price_usd: initialData.base_price_usd?.toString() || '',
                unit_id: initialData.unit_id?.toString() || defaultUnitOption?.value || '',
                moq: initialData.moq?.toString() || '1',
                availability: initialData.is_active ? 'Disponible' : 'Agotado',
                description: initialData.description || '',
            });

            if (initialData.pricing_tiers) {
                setPricingTiers(initialData.pricing_tiers.map(t => ({
                    min_quantity: t.min_quantity?.toString() || '',
                    max_quantity: t.max_quantity?.toString() || '',
                    price_usd: t.price_usd?.toString() || ''
                })));
            }

            if (initialData.photos && initialData.photos.length > 0) {
                setSelectedFiles(initialData.photos.map(p => ({
                    file: null,
                    preview: p.url,
                    type: 'image',
                    existing: true
                })));
            }
        } else if (!open) {
            // Limpiar al cerrar
            setForm(DEFAULT_FORM);
            setPricingTiers([]);
            setSelectedFiles([]);
        }
    }, [initialData, open, defaultUnitOption]);

    const mutation = useMutation({
        mutationFn: (data) => initialData 
            ? productsApi.updateProduct(initialData.id, data) 
            : productsApi.createProduct(data),
        onSuccess: () => {
            toast.success(initialData ? 'Producto actualizado' : 'Producto agregado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['companyProducts'] });
            setForm({
                ...DEFAULT_FORM,
                unit_id: defaultUnitOption?.value || '',
            });
            setPricingTiers([]);
            setSelectedFiles([]);
            onOpenChange(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al guardar');
        },
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 4) {
            toast.error('Solo puedes subir hasta 4 archivos multimedia');
            return;
        }

        const newFiles = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image'
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        e.target.value = null;
    };

    const removeFile = (idx) => {
        setSelectedFiles(prev => {
            const copy = [...prev];
            URL.revokeObjectURL(copy[idx].preview);
            copy.splice(idx, 1);
            return copy;
        });
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

        if (!initialData && selectedFiles.length === 0) {
            toast.error('Debes subir al menos un archivo multimedia');
            return;
        }

        const isUpdating = !!initialData;

        if (isUpdating) {
            const payload = {
                name: form.name.trim(),
                description: form.description?.trim() || '',
                category_id: form.category_id ? Number(form.category_id) : null,
                base_price_usd: Number(form.base_price_usd),
                unit_id: form.unit_id ? Number(form.unit_id) : (Number(defaultUnitOption?.id) || null),
                moq: Number(form.moq) || 1,
                is_active: form.availability !== 'Agotado'
            };

            if (pricingTiers.length > 0) {
                payload.pricing_tiers = pricingTiers
                    .filter(t => t.min_quantity && t.price_usd)
                    .map(t => ({
                        min_quantity: Number(t.min_quantity),
                        max_quantity: t.max_quantity ? Number(t.max_quantity) : null,
                        price_usd: Number(t.price_usd)
                    }));
            } else {
                payload.pricing_tiers = [];
            }
            mutation.mutate(payload);
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
        
        if (pricingTiers.length > 0) {
            const formattedTiers = pricingTiers
                .filter(t => t.min_quantity && t.price_usd)
                .map(t => ({
                    min_quantity: Number(t.min_quantity),
                    max_quantity: t.max_quantity ? Number(t.max_quantity) : null,
                    price_usd: Number(t.price_usd)
                }));
            if (formattedTiers.length > 0) {
                formData.append('pricing_tiers', JSON.stringify(formattedTiers));
            }
        }
        
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(f => {
                formData.append('files', f.file);
            });
        }

        mutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-foreground">
                        {initialData ? 'Editar Producto' : 'Agregar Producto'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {!initialData && (
                        <div>
                            <Label className="mb-2 block text-xs uppercase tracking-wider font-bold text-slate-500">Archivos Multimedia (Máx 4) *</Label>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                            {selectedFiles.map((f, idx) => (
                                <div key={idx} className="relative h-28 w-28 flex-shrink-0 rounded-xl overflow-hidden border border-border group">
                                    {f.type === 'video' ? (
                                        <video src={f.preview} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={f.preview} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeFile(idx)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            
                            {selectedFiles.length < 4 && (
                                <div 
                                    className="flex h-28 w-28 flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-slate-100"
                                    onClick={() => document.getElementById('product-image-upload').click()}
                                >
                                    <Upload className="h-6 w-6 text-slate-400" />
                                    <span className="text-[10px] text-slate-400 text-center px-1">Subir imagen<br/>o video</span>
                                </div>
                            )}
                            
                            <input 
                                id="product-image-upload"
                                type="file" 
                                accept="image/*,video/*"
                                multiple
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    )}

                    <div className="space-y-2">
                        <Label>Nombre del Producto *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder="Ej: Aceite de Motor 5W30"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Categoría</Label>
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

                    <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold text-slate-700">Precios por volumen (Opcional)</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addTier}>
                                + Añadir Rango
                            </Button>
                        </div>
                        {pricingTiers.length > 0 && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <span>Cant. Mínima</span>
                                    <span>Cant. Máx (vacío=infinito)</span>
                                    <span>Precio ($)</span>
                                    <span className="w-8"></span>
                                </div>
                                {pricingTiers.map((tier, idx) => (
                                    <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                                        <Input 
                                            type="number" min="1" placeholder="Ej: 50"
                                            value={tier.min_quantity} onChange={e => updateTier(idx, 'min_quantity', e.target.value)}
                                        />
                                        <Input 
                                            type="number" min="1" placeholder="Ej: 100"
                                            value={tier.max_quantity} onChange={e => updateTier(idx, 'max_quantity', e.target.value)}
                                        />
                                        <Input 
                                            type="number" min="0" step="0.01" placeholder="Ej: 90.00"
                                            value={tier.price_usd} onChange={e => updateTier(idx, 'price_usd', e.target.value)}
                                        />
                                        <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-10 w-10 flex-shrink-0" onClick={() => removeTier(idx)}>
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
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
                            {mutation.isPending ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Agregar Producto')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

